'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';
import { getCurrentUser } from '../actions';
import { resolveSearchRequester, runCachedSearch } from '../search/query-cache';
import { scrapeDolarValue } from './dolar';
import { scrapeGoogleShoppingProducts } from './google-shopping';
import { getDomainFromUrl, getDomainTrustIndex, getTrustLabel, TrustLabel } from './trust-score';

type Country = 'argentina' | 'brasil' | 'colombia' | 'uruguay';

interface PriceComparisonProduct {
  url: string;
  title: string;
  price: number;
  image: string;
  dolarPrice: number;
  source: 'mercadolibre' | 'google-shopping';
  domain: string;
  storeName?: string;
  trustScore: number;
  trustLabel: TrustLabel;
}

type RawProduct = {
  url: string;
  title: string;
  price: number;
  image?: string;
};

const LOG_TAG = '[PRICE_COMPARISON]';
const PRICE_COMPARISON_DEBUG = process.env.PRICE_COMPARISON_DEBUG === 'true';
const MIN_RELATIVE_PRICE_RATIO = 0.35;
const MAX_RELATIVE_PRICE_RATIO = 1.6;
const MIN_TOKEN_OVERLAP_SCORE = 0.45;

const SEARCH_BASE_BY_COUNTRY: Record<Country, string> = {
  argentina: 'https://listado.mercadolibre.com.ar',
  brasil: 'https://lista.mercadolivre.com.br',
  colombia: 'https://listado.mercadolibre.com.co',
  uruguay: 'https://listado.mercadolibre.com.uy',
};

const REQUEST_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
  Referer: 'https://www.mercadolibre.com/',
};

const ACCESSORY_KEYWORDS = [
  'funda',
  'fundas',
  'case',
  'cover',
  'protector',
  'proteccion',
  'film',
  'hidrogel',
  'vidrio',
  'templado',
  'glass',
  'auricular',
  'auriculares',
  'headset',
  'cargador',
  'charger',
  'cable',
  'teclado',
  'keyboard',
  'stylus',
  'lapiz',
  'pen',
  'estuche',
  'carcasa',
  'adapter',
  'adaptador',
  'soporte',
  'holder',
  'dock',
];

const STOPWORDS = new Set([
  'de',
  'del',
  'la',
  'el',
  'los',
  'las',
  'para',
  'con',
  'por',
  'en',
  'y',
  'or',
  'the',
  'a',
  'an',
  'inch',
  'inches',
  'tipo',
  'compatible',
  'for',
]);

const normalizeForComparison = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenizeForComparison = (value: string) =>
  normalizeForComparison(value)
    .split(' ')
    .filter((token) => token.length >= 2 && !STOPWORDS.has(token));

const hasAccessoryKeyword = (value: string) => {
  const normalized = normalizeForComparison(value);
  return ACCESSORY_KEYWORDS.some((keyword) => normalized.includes(keyword));
};

const getTokenOverlapScore = (query: string, candidate: string) => {
  const queryTokens = Array.from(new Set(tokenizeForComparison(query)));
  const candidateTokenSet = new Set(tokenizeForComparison(candidate));

  if (queryTokens.length === 0 || candidateTokenSet.size === 0) return 0;

  const overlap = queryTokens.filter((token) => candidateTokenSet.has(token)).length;
  return overlap / queryTokens.length;
};

const logInfo = (requestId: string, message: string, meta?: Record<string, unknown>) => {
  if (!PRICE_COMPARISON_DEBUG) return;
  if (meta) {
    console.log(`${LOG_TAG}[${requestId}] ${message}`, meta);
    return;
  }
  console.log(`${LOG_TAG}[${requestId}] ${message}`);
};

const logError = (requestId: string, message: string, meta?: Record<string, unknown>) => {
  if (!PRICE_COMPARISON_DEBUG) return;
  if (meta) {
    console.error(`${LOG_TAG}[${requestId}] ${message}`, meta);
    return;
  }
  console.error(`${LOG_TAG}[${requestId}] ${message}`);
};

const cleanSearchQuery = (title: string) =>
  title
    .replace(/['"`]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const buildQueryCandidates = (query: string) => {
  const words = query.split(' ').filter(Boolean);
  const candidates = [
    query,
    words.slice(0, 8).join(' '),
    words.slice(0, 6).join(' '),
    words.slice(0, 4).join(' '),
  ].filter((item) => item.length > 0);

  return Array.from(new Set(candidates));
};

const parsePrice = (value: string) => {
  if (!value) return NaN;
  const numeric = value.replace(/[^\d]/g, '');
  if (!numeric) return NaN;
  return Number(numeric);
};

const toHttpsImageUrl = (url?: string) => {
  if (!url) return '';
  return url.startsWith('http://') ? url.replace('http://', 'https://') : url;
};

const normalizeListingUrl = (url?: string) => {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    parsed.hash = '';
    parsed.search = '';
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url.split('#')[0].split('?')[0];
  }
};

const findFirstMatch = (root: any, selectors: string[]) => {
  for (const selector of selectors) {
    const match = root.find(selector).first();
    if (match.length > 0) return match;
  }
  return null;
};

const findFirstText = (root: any, selectors: string[]) => {
  for (const selector of selectors) {
    const value = root.find(selector).first().text().trim();
    if (value) return value;
  }
  return '';
};

const findFirstAttr = (root: any, selectors: string[], attr: string) => {
  for (const selector of selectors) {
    const value = root.find(selector).first().attr(attr);
    if (value) return String(value);
  }
  return '';
};

const getBrightDataOptions = () => {
  const username = String(process.env.BRIGHT_DATA_USERNAME || '');
  const password = String(process.env.BRIGHT_DATA_PASSWORD || '');
  if (!username || !password) return null;

  const sessionId = (1000000 * Math.random()) | 0;

  return {
    auth: {
      username: `${username}-session-${sessionId}`,
      password,
    },
    host: 'brd.superproxy.io',
    port: 22225,
  };
};

const buildSearchUrls = (country: Country, candidate: string, priceThreshold: number) => {
  const baseUrl = SEARCH_BASE_BY_COUNTRY[country] || SEARCH_BASE_BY_COUNTRY.argentina;
  const slug = candidate.replace(/\s+/g, '-');
  const encodedSlug = encodeURIComponent(slug);

  return [
    `${baseUrl}/${encodedSlug}_PriceRange_0-${priceThreshold}_NoIndex_True`,
    `${baseUrl}/${encodedSlug}`,
  ];
};

const parseItemsFromLdJson = ($: any) => {
  const items: RawProduct[] = [];

  const pushProduct = (value: any) => {
    if (!value || typeof value !== 'object') return;

    const title = String(value.name || '').trim();

    const rawOffer = Array.isArray(value.offers) ? value.offers[0] : value.offers;
    const resolvedUrl =
      String(value.url || rawOffer?.url || value?.offers?.url || value?.item_offered?.url || '').trim();
    const url = normalizeListingUrl(resolvedUrl);

    const rawPrice =
      rawOffer?.price ??
      rawOffer?.priceSpecification?.price ??
      rawOffer?.lowPrice ??
      rawOffer?.highPrice ??
      value?.offers?.price ??
      value.price;

    const parsedPrice =
      typeof rawPrice === 'number' ? rawPrice : parsePrice(String(rawPrice ?? ''));

    const rawImage = Array.isArray(value.image) ? value.image[0] : value.image;
    const image = String(rawImage || '').trim();

    items.push({ url, title, price: parsedPrice, image });
  };

  const walk = (value: any) => {
    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach((entry) => walk(entry));
      return;
    }

    if (typeof value !== 'object') return;

    if (value['@type'] === 'ItemList' && Array.isArray(value.itemListElement)) {
      value.itemListElement.forEach((entry: any) => walk(entry?.item || entry));
    }

    if (value['@type'] === 'Product' || (value.name && (value.offers || value.url))) {
      pushProduct(value);
    }

    if (Array.isArray(value['@graph'])) {
      value['@graph'].forEach((entry: any) => walk(entry));
    }
  };

  $('script[type="application/ld+json"]').each((_: any, element: any) => {
    const rawScript = $(element).contents().text().trim();
    if (!rawScript) return;

    try {
      const parsed = JSON.parse(rawScript);
      walk(parsed);
    } catch {
      // Ignore malformed JSON-LD blocks
    }
  });

  return items;
};

const parseItemsFromDom = ($: any, requestId?: string) => {
  const items: RawProduct[] = [];
  const cardSelectors = [
    '.ui-search-layout .ui-search-layout__item',
    'li.ui-search-layout__item',
    '.poly-card',
    '.ui-search-result__wrapper',
  ];

  const selectorStats = cardSelectors.map((selector) => ({ selector, count: $(selector).length }));
  const selectedCards = selectorStats.find((entry) => entry.count > 0);

  if (requestId) {
    logInfo(requestId, 'DOM selector scan', {
      selectorStats,
      selectedSelector: selectedCards?.selector || 'none-by-count',
      selectedCount: selectedCards?.count || 0,
    });
  }

  if (!selectedCards || selectedCards.count === 0) return items;

  $(selectedCards.selector).each((_: any, element: any) => {
    const card = $(element);
    const titleAnchor = findFirstMatch(card, [
      'h3.poly-component__title-wrapper a.poly-component__title',
      'a.poly-component__title',
      'a.ui-search-link',
      'a[href*="/MLA"]',
      'a[href*="/ML"]',
    ]);

    const title =
      titleAnchor?.text().trim() ||
      findFirstText(card, ['.ui-search-item__title']) ||
      findFirstAttr(card, ['a[title]'], 'title') ||
      '';

    const rawUrl =
      titleAnchor?.attr('href') ||
      findFirstAttr(card, ['a.ui-search-link', 'a[href*="/MLA"]', 'a[href*="/ML"]'], 'href') ||
      '';

    const url = normalizeListingUrl(rawUrl);
    const mainCurrentPrice = findFirstMatch(card, [
      '.poly-price__current .andes-money-amount',
      '.andes-money-amount[aria-label*="Ahora"]',
      '.andes-money-amount',
    ]);
    const currentPriceAria = mainCurrentPrice?.attr('aria-label') || '';
    const currentPriceFraction =
      mainCurrentPrice?.find('.andes-money-amount__fraction').first().text().trim() ||
      findFirstText(card, ['.andes-money-amount__fraction']);
    const metaPrice = findFirstAttr(card, ['meta[itemprop="price"]'], 'content');

    const parsedPrice =
      parsePrice(currentPriceAria) ||
      parsePrice(currentPriceFraction) ||
      parsePrice(metaPrice);

    const image = findFirstAttr(
      card,
      [
        '.poly-component__picture',
        '.ui-search-result-image__element',
        'img[data-testid="picture"]',
        'img',
      ],
      'src',
    )
      || findFirstAttr(
        card,
        [
          '.poly-component__picture',
          '.ui-search-result-image__element',
          'img[data-testid="picture"]',
          'img',
        ],
        'data-src',
      )
      '';

    if (!title && !url) return;

    items.push({ url: String(url), title: String(title), price: parsedPrice, image: String(image) });
  });

  return items;
};

const buildProductList = (
  items: RawProduct[],
  dolarValue: number,
  maxPrice?: number,
  source: 'mercadolibre' | 'google-shopping' = 'mercadolibre',
) => {
  const validDolarValue = Number.isFinite(dolarValue) && dolarValue > 0 ? dolarValue : 1;
  const seenUrls = new Set<string>();

  return items
    .filter((item) => {
      if (!item.url || !item.title || seenUrls.has(item.url)) return false;
      seenUrls.add(item.url);
      if (!Number.isFinite(item.price) || item.price <= 0) return false;
      if (typeof maxPrice === 'number') return item.price <= maxPrice;
      return true;
    })
    .map((item) => ({
      url: normalizeListingUrl(item.url),
      title: item.title,
      price: item.price,
      image: toHttpsImageUrl(item.image),
      dolarPrice: item.price / validDolarValue,
      source,
      domain: getDomainFromUrl(item.url),
      trustScore: getDomainTrustIndex(getDomainFromUrl(item.url), source),
      trustLabel: getTrustLabel(getDomainTrustIndex(getDomainFromUrl(item.url), source)),
    }))
    .sort((a, b) => a.price - b.price)
    .slice(0, 30);
};

const fetchFromHtml = async (country: Country, candidate: string, priceThreshold: number, requestId: string) => {
  const urls = buildSearchUrls(country, candidate, priceThreshold);
  const brightDataOptions = getBrightDataOptions();
  const requestStrategies = [
    { name: 'direct', config: { headers: REQUEST_HEADERS, timeout: 12000 } },
    ...(brightDataOptions
      ? [{ name: 'proxy', config: { headers: REQUEST_HEADERS, timeout: 12000, ...brightDataOptions } }]
      : []),
  ];

  for (const strategy of requestStrategies) {
    for (const searchUrl of urls) {
      try {
        logInfo(requestId, 'Trying HTML scraper', {
          country,
          candidate,
          strategy: strategy.name,
          searchUrl,
        });

        const response = await axios.get(searchUrl, strategy.config);
        const $ = cheerio.load(response.data);

        const ldJsonItems = parseItemsFromLdJson($);
        const domItems = ldJsonItems.length > 0 ? [] : parseItemsFromDom($, requestId);
        const items = ldJsonItems.length > 0 ? ldJsonItems : domItems;

        logInfo(requestId, 'HTML scraper response parsed', {
          status: response.status,
          source: ldJsonItems.length > 0 ? 'ld-json' : 'dom',
          totalResults: items.length,
          strategy: strategy.name,
        });

        if (items.length > 0) return items;

        const htmlText = String(response.data || '');
        logInfo(requestId, 'No parseable items found in HTML response', {
          pageTitle: $('title').text().trim().slice(0, 140),
          htmlLength: htmlText.length,
          hasCaptchaWord: /captcha|robot|interruption|denied|forbidden/i.test(htmlText),
          strategy: strategy.name,
        });
      } catch (error: any) {
        logError(requestId, 'HTML scraper request failed', {
          candidate,
          strategy: strategy.name,
          searchUrl,
          status: error?.response?.status,
          message: error?.message,
        });
      }
    }
  }

  return [] as RawProduct[];
};

async function scrapePriceComparissonProductsUncached(
  productTitle: string,
  productPrice: number,
  country: Country,
) {
  const requestId = Math.random().toString(36).slice(2, 10);

  if (!productTitle || !Number.isFinite(productPrice) || productPrice <= 0) {
    logInfo(requestId, 'Invalid input received. Returning empty result set.', {
      productTitle,
      productPrice,
    });
    return [] as PriceComparisonProduct[];
  }

  const query = cleanSearchQuery(productTitle);
  const isAccessoryQuery = hasAccessoryKeyword(query);

  if (!query) {
    logInfo(requestId, 'Query is empty after normalization. Returning empty result set.', { productTitle });
    return [] as PriceComparisonProduct[];
  }

  const priceThreshold = Math.max(1, Math.round(productPrice));
  const dolarValueResponse = await scrapeDolarValue().catch(() => undefined);
  const dolarValue = Number(dolarValueResponse);
  const queryCandidates = buildQueryCandidates(query);
  let localCheaperProducts: PriceComparisonProduct[] = [];
  let localComparableProducts: PriceComparisonProduct[] = [];

  logInfo(requestId, 'Starting price comparison search (SCRAPER ONLY)', {
    country,
    originalTitle: productTitle,
    normalizedQuery: query,
    queryCandidates,
    productPrice,
    priceThreshold,
    dolarValue: Number.isFinite(dolarValue) ? dolarValue : 'unavailable',
  });

  for (const candidate of queryCandidates) {
    const htmlItems = await fetchFromHtml(country, candidate, priceThreshold, requestId);
    const htmlProducts = buildProductList(htmlItems, dolarValue, priceThreshold, 'mercadolibre');
    const comparableProducts = buildProductList(htmlItems, dolarValue, undefined, 'mercadolibre');

    logInfo(requestId, 'Filtered HTML scraper results', {
      candidate,
      rawCount: htmlItems.length,
      filteredCount: htmlProducts.length,
      comparableCount: comparableProducts.length,
    });

    if (localCheaperProducts.length === 0 && htmlProducts.length > 0) {
      localCheaperProducts = htmlProducts;
      logInfo(requestId, 'Stored local cheaper results', {
        candidate,
        count: htmlProducts.length,
        sample: htmlProducts.slice(0, 3).map((item) => ({ title: item.title, price: item.price })),
      });
      break;
    }

    if (localComparableProducts.length === 0 && comparableProducts.length > 0) {
      localComparableProducts = [...comparableProducts]
        .sort((a, b) => Math.abs(a.price - productPrice) - Math.abs(b.price - productPrice))
        .slice(0, 30);

      logInfo(requestId, 'Stored fallback comparable results', {
        candidate,
        count: localComparableProducts.length,
        sample: localComparableProducts.slice(0, 3).map((item) => ({ title: item.title, price: item.price })),
      });
    }
  }

  const localResults =
    localCheaperProducts.length > 0
      ? localCheaperProducts
      : localComparableProducts;

  let googleShoppingResults: PriceComparisonProduct[] = [];
  try {
    googleShoppingResults = await scrapeGoogleShoppingProducts(query, productPrice, country, dolarValue);
    logInfo(requestId, 'Google Shopping comparison parsed', {
      totalResults: googleShoppingResults.length,
      sample: googleShoppingResults.slice(0, 3).map((item) => ({
        title: item.title,
        price: item.price,
        domain: item.domain,
      })),
    });
  } catch (error: any) {
    logError(requestId, 'Google Shopping comparison failed. Keeping local-only comparison.', {
      message: error?.message,
    });
  }

  const combinedByUrl = new Map<string, PriceComparisonProduct>();
  [...localResults, ...googleShoppingResults].forEach((item) => {
    const normalizedUrl = normalizeListingUrl(item.url);
    if (!normalizedUrl) return;
    if (!combinedByUrl.has(normalizedUrl)) {
      combinedByUrl.set(normalizedUrl, {
        ...item,
        url: normalizedUrl,
      });
    }
  });

  const mergedResults = Array.from(combinedByUrl.values()).filter(
    (item) => Number.isFinite(item.price) && item.price > 0,
  );

  const strictComparableResults = mergedResults.filter((item) => {
    if (!isAccessoryQuery && hasAccessoryKeyword(item.title)) return false;

    const overlapScore = getTokenOverlapScore(query, item.title);
    if (overlapScore < MIN_TOKEN_OVERLAP_SCORE) return false;

    if (!isAccessoryQuery && productPrice > 0) {
      const ratio = item.price / productPrice;
      if (ratio < MIN_RELATIVE_PRICE_RATIO || ratio > MAX_RELATIVE_PRICE_RATIO) {
        return false;
      }
    }

    return true;
  });

  const combinedResults = strictComparableResults
    .sort((a, b) => a.price - b.price)
    .slice(0, 40);

  if (combinedResults.length > 0) {
    logInfo(requestId, 'Returning combined comparison results', {
      localCount: localResults.length,
      googleCount: googleShoppingResults.length,
      combinedCount: combinedResults.length,
      sample: combinedResults.slice(0, 5).map((item) => ({
        title: item.title,
        price: item.price,
        source: item.source,
        domain: item.domain,
        trustScore: item.trustScore,
      })),
    });
    return combinedResults;
  }

  if (strictComparableResults.length === 0) {
    logInfo(requestId, 'No strict comparable results after relevance filters', {
      mergedCount: mergedResults.length,
      isAccessoryQuery,
      query,
    });
  }

  logError(requestId, 'No results from local or Google Shopping. Returning empty result set.', {
    normalizedQuery: query,
    queryCandidates,
  });
  return [] as PriceComparisonProduct[];
}

export async function scrapePriceComparissonProducts(productTitle: string, productPrice: number) {
  const user = await getCurrentUser();
  const country = (user?.country as Country) || 'argentina';
  const query = cleanSearchQuery(productTitle);
  const normalizedPrice = Math.max(1, Math.round(Number(productPrice) || 0));

  if (!query || normalizedPrice <= 0) {
    return [] as PriceComparisonProduct[];
  }

  const requester = await resolveSearchRequester(user?.email || user?.id || null);

  return runCachedSearch({
    namespace: 'price-comparison',
    params: {
      query: query.toLowerCase(),
      country,
      productPrice: normalizedPrice,
    },
    ttlMs: 5 * 60 * 1000,
    emptyTtlMs: 60 * 1000,
    rateLimit: {
      identifier: requester,
      scope: 'price-comparison',
      limit: 10,
      windowMs: 60 * 1000,
    },
    execute: async () =>
      scrapePriceComparissonProductsUncached(query, normalizedPrice, country),
  });
}
