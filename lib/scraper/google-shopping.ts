'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';
import { getCurrentUser } from '../actions';
import { getDomainFromUrl, getDomainTrustIndex, getTrustLabel, TrustLabel } from './trust-score';

type Country = 'argentina' | 'brasil' | 'colombia' | 'uruguay';

export interface GoogleShoppingComparisonProduct {
  url: string;
  title: string;
  price: number;
  image: string;
  dolarPrice: number;
  source: 'google-shopping';
  domain: string;
  trustScore: number;
  trustLabel: TrustLabel;
}

export interface GoogleShoppingSearchProduct {
  url: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  image: string;
  freeShipping: string;
  currency: string;
  features: string;
  isBestSeller: string;
  source: 'google-shopping';
  domain: string;
  trustScore: number;
  trustLabel: TrustLabel;
}

const LOG_TAG = '[GOOGLE_SHOPPING]';
const GOOGLE_SHOPPING_DEBUG = process.env.PRICE_COMPARISON_DEBUG === 'true' || process.env.GOOGLE_SHOPPING_DEBUG === 'true';

const logInfo = (requestId: string, message: string, meta?: Record<string, unknown>) => {
  if (!GOOGLE_SHOPPING_DEBUG) return;
  if (meta) {
    console.log(`${LOG_TAG}[${requestId}] ${message}`, meta);
    return;
  }
  console.log(`${LOG_TAG}[${requestId}] ${message}`);
};

const logError = (requestId: string, message: string, meta?: Record<string, unknown>) => {
  if (!GOOGLE_SHOPPING_DEBUG) return;
  if (meta) {
    console.error(`${LOG_TAG}[${requestId}] ${message}`, meta);
    return;
  }
  console.error(`${LOG_TAG}[${requestId}] ${message}`);
};

const GOOGLE_GL_BY_COUNTRY: Record<Country, string> = {
  argentina: 'ar',
  brasil: 'br',
  colombia: 'co',
  uruguay: 'uy',
};

const CURRENCY_BY_COUNTRY: Record<Country, string> = {
  argentina: '$',
  brasil: 'R$',
  colombia: '$',
  uruguay: '$U',
};

const REQUEST_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
  Referer: 'https://www.google.com/',
};

const GOOGLE_SEARCH_URL = (gl: string, candidate: string) =>
  `https://www.google.com/search?tbm=shop&hl=es&gl=${gl}&q=${encodeURIComponent(candidate)}`;

const GOOGLE_SHOPPING_URL = (gl: string, candidate: string) =>
  `https://www.google.com/shopping?hl=es&gl=${gl}&q=${encodeURIComponent(candidate)}`;

const getBrightDataOptions = () => {
  const username = String(process.env.BRIGHT_DATA_USERNAME || '');
  const password = String(process.env.BRIGHT_DATA_PASSWORD || '');
  if (!username || !password) return null;

  const sessionId = (1000000 * Math.random()) | 0;
  return {
    proxy: {
      protocol: 'http' as const,
      host: 'brd.superproxy.io',
      port: 22225,
      auth: {
        username: `${username}-session-${sessionId}`,
        password,
      },
    },
  };
};

const toHttps = (value?: string) => {
  if (!value) return '';
  if (value.startsWith('http://')) return value.replace('http://', 'https://');
  if (value.startsWith('//')) return `https:${value}`;
  return value;
};

const normalizeUrl = (value?: string) => {
  if (!value) return '';

  const raw = value.trim();
  if (!raw) return '';

  const decodeGoogleRedirect = (candidate: string) => {
    const redirectKeys = ['q', 'url', 'adurl', 'imgurl', 'rdct_url', 'dest', 'target', 'u'];
    let current = candidate;

    // Follow nested Google redirects up to a safe depth.
    for (let i = 0; i < 3; i += 1) {
      let parsed: URL;
      try {
        const withBase = current.startsWith('http') ? current : `https://www.google.com${current}`;
        parsed = new URL(withBase);
      } catch {
        break;
      }

      const nextTarget = redirectKeys
        .map((key) => parsed.searchParams.get(key) || '')
        .map((candidateValue) => {
          try {
            return decodeURIComponent(candidateValue);
          } catch {
            return candidateValue;
          }
        })
        .find((candidateValue) => /^https?:\/\//i.test(candidateValue));

      if (!nextTarget) {
        current = parsed.toString();
        break;
      }

      current = nextTarget;
    }

    return current;
  };

  const shouldDecodeGoogleRedirect = (candidate: string) => {
    try {
      const withBase = candidate.startsWith('http') ? candidate : `https://www.google.com${candidate}`;
      const parsed = new URL(withBase);
      const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
      const path = parsed.pathname.toLowerCase();
      const hasRedirectParams = ['q', 'url', 'adurl', 'imgurl', 'rdct_url', 'dest', 'target', 'u'].some((key) =>
        parsed.searchParams.has(key),
      );
      return (
        host.endsWith('google.com')
        || host.endsWith('google.com.ar')
        || path.startsWith('/url')
        || path.startsWith('/aclk')
        || hasRedirectParams
      );
    } catch {
      return candidate.startsWith('/url?') || candidate.startsWith('/aclk?');
    }
  };

  const resolved = shouldDecodeGoogleRedirect(raw) ? decodeGoogleRedirect(raw) : raw;

  try {
    const parsed = new URL(resolved.startsWith('http') ? resolved : `https://www.google.com${resolved}`);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    parsed.hash = '';
    // Keep query params for non-Google URLs to preserve direct product links.
    if (host.endsWith('google.com') || host.endsWith('google.com.ar')) {
      parsed.search = '';
    }
    return parsed.toString();
  } catch {
    return resolved.split('#')[0].split('?')[0];
  }
};

const GOOGLE_OWNED_DOMAINS = [
  'google.com',
  'google.com.ar',
  'googleusercontent.com',
  'gstatic.com',
  'googleadservices.com',
  'doubleclick.net',
];

const MERCADOLIBRE_DOMAINS = [
  'mercadolibre.com',
  'mercadolibre.com.ar',
  'mercadolivre.com.br',
  'mercadolibre.com.uy',
  'mercadolibre.com.co',
  'mercadolibre.cl',
];

const LOCAL_DOMAINS = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];

const domainMatches = (domain: string, allowedDomains: string[]) =>
  allowedDomains.some((item) => domain === item || domain.endsWith(`.${item}`));

const isGoogleOwnedDomain = (domain: string) => domainMatches(domain, GOOGLE_OWNED_DOMAINS);
const isMercadoLibreDomain = (domain: string) => domainMatches(domain, MERCADOLIBRE_DOMAINS);
const isLocalDomain = (domain: string) =>
  domainMatches(domain, LOCAL_DOMAINS) || /^(\d{1,3}\.){3}\d{1,3}$/.test(domain);
const isLikelyPublicStoreDomain = (domain: string) =>
  !!domain && domain.includes('.') && !isGoogleOwnedDomain(domain) && !isLocalDomain(domain);
const isAllowedOtherStoreDomain = (domain: string) =>
  !!domain && domain.includes('.') && !isLocalDomain(domain) && !isMercadoLibreDomain(domain);

const parsePrice = (value: string) => {
  if (!value) return NaN;
  const raw = String(value)
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[^\d.,]/g, '');
  if (!raw) return NaN;

  const hasDot = raw.includes('.');
  const hasComma = raw.includes(',');

  if (hasDot && hasComma) {
    if (/,\d{2}$/.test(raw) && raw.lastIndexOf(',') > raw.lastIndexOf('.')) {
      const normalized = raw.replace(/\./g, '').replace(/,\d{2}$/, '');
      return Number(normalized);
    }
    if (/\.\d{2}$/.test(raw) && raw.lastIndexOf('.') > raw.lastIndexOf(',')) {
      const normalized = raw.replace(/,/g, '').replace(/\.\d{2}$/, '');
      return Number(normalized);
    }
    return Number(raw.replace(/[.,]/g, ''));
  }

  if (hasComma) {
    if (/,\d{2}$/.test(raw)) return Number(raw.replace(/,\d{2}$/, '').replace(/,/g, ''));
    return Number(raw.replace(/,/g, ''));
  }

  if (hasDot) {
    if (/\.\d{2}$/.test(raw) && raw.split('.').length > 1) {
      return Number(raw.replace(/\.\d{2}$/, '').replace(/\./g, ''));
    }
    return Number(raw.replace(/\./g, ''));
  }

  return Number(raw);
};

const getImageFromSrcset = (srcset?: string) => {
  if (!srcset) return '';
  const first = srcset
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)[0];
  if (!first) return '';
  return first.split(' ')[0] || '';
};

const cleanQuery = (title: string) =>
  title
    .replace(/[-_]+/g, ' ')
    .replace(/['"`]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);

const getTitleSimilarity = (query: string, candidate: string) => {
  const queryTokens = new Set(tokenize(query));
  const candidateTokens = new Set(tokenize(candidate));
  if (queryTokens.size === 0 || candidateTokens.size === 0) return 0;

  let common = 0;
  queryTokens.forEach((token) => {
    if (candidateTokens.has(token)) common += 1;
  });

  return common / queryTokens.size;
};

const parseGoogleShoppingFromMarkdown = (
  markdown: string,
  query: string,
  maxPrice: number,
  dolarValue: number,
) => {
  const items: GoogleShoppingComparisonProduct[] = [];
  const seen = new Set<string>();
  const validDolarValue = Number.isFinite(dolarValue) && dolarValue > 0 ? dolarValue : 1;
  const lines = markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('*') && line.includes('$'));

  for (const line of lines) {
    const imageMatches: string[] = [];
    const imageRegex = /!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/ig;
    let imageMatchExec: RegExpExecArray | null = imageRegex.exec(line);
    while (imageMatchExec) {
      imageMatches.push(imageMatchExec[1]);
      imageMatchExec = imageRegex.exec(line);
    }
    const imageUrl =
      imageMatches.find((url) => /^https?:\/\//i.test(url) && !url.startsWith('blob:') && /shopping\?q=tbn/i.test(url))
      || imageMatches.find((url) => /^https?:\/\//i.test(url) && !/favicon/i.test(url) && !url.startsWith('blob:'))
      || imageMatches.find((url) => /^https?:\/\//i.test(url) && !url.startsWith('blob:'))
      || '';
    const priceMatch = line.match(/((?:R\$|USD|EUR|\$U|\$)\s?\d[\d.,]*)/i);
    if (!priceMatch) continue;

    const price = parsePrice(priceMatch[1]);
    if (!Number.isFinite(price) || price <= 0) continue;
    if (price > maxPrice * 1.8) continue;

    const firstImageToken = line.match(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/i)?.[0] || '';
    const afterImage = firstImageToken ? line.slice(line.indexOf(firstImageToken) + firstImageToken.length) : line;
    const titleRaw = afterImage.split(priceMatch[1])[0].replace(/\s+/g, ' ').trim();
    const title = titleRaw
      .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
      .replace(/\[[^\]]+\]\([^)]+\)/g, ' ')
      .replace(/About this result.*$/i, '')
      .replace(/Report a violation.*$/i, '')
      .replace(/^(\*|OFERTA|DESCUENTO|PRECIO BAJO)\s*/i, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    if (!title) continue;

    const similarity = getTitleSimilarity(query, title);
    if (similarity < 0.2) continue;

    const linkCandidates: string[] = [];
    const markdownLinkRegex = /\[[^\]]+\]\(([^)\s]+)\)/ig;
    let linkMatch: RegExpExecArray | null = markdownLinkRegex.exec(line);
    while (linkMatch) {
      linkCandidates.push(linkMatch[1]);
      linkMatch = markdownLinkRegex.exec(line);
    }
    const rawUrlRegex = /(https?:\/\/[^\s)]+)/ig;
    let rawUrlMatch: RegExpExecArray | null = rawUrlRegex.exec(line);
    while (rawUrlMatch) {
      linkCandidates.push(rawUrlMatch[1]);
      rawUrlMatch = rawUrlRegex.exec(line);
    }

    const imageSet = new Set(imageMatches.map((img) => normalizeUrl(img)));
    const normalizedCandidates = linkCandidates
      .map((candidate) => normalizeUrl(candidate))
      .filter(Boolean)
      .filter((candidate) => !imageSet.has(candidate));

    const url = normalizedCandidates.find((candidate) => {
      const domain = getDomainFromUrl(candidate);
      if (!domain) return false;
      return isAllowedOtherStoreDomain(domain);
    }) || '';
    const domain = getDomainFromUrl(url);
    if (!url || !domain) continue;
    if (!isAllowedOtherStoreDomain(domain)) continue;

    if (seen.has(url)) continue;
    seen.add(url);

    const trustScore = getDomainTrustIndex(domain, 'google-shopping');
    items.push({
      url,
      title,
      price,
      image: toHttps(imageUrl),
      dolarPrice: price / validDolarValue,
      source: 'google-shopping',
      domain,
      trustScore,
      trustLabel: getTrustLabel(trustScore),
    });
  }

  return items.sort((a, b) => a.price - b.price).slice(0, 30);
};

const parseGoogleShoppingDom = (
  $: any,
  originalQuery: string,
  dolarValue: number,
  maxPrice: number,
  requestId?: string,
) => {
  const items: GoogleShoppingComparisonProduct[] = [];
  const seen = new Set<string>();
  const validDolarValue = Number.isFinite(dolarValue) && dolarValue > 0 ? dolarValue : 1;

  const cardSelectors = [
    '.sh-dgr__grid-result',
    '.sh-dlr__list-result',
    '.i0X6df',
    '.KZmu8e',
    'div[data-docid]',
    '.sh-dgr__content',
    '.pla-unit-container',
  ];
  if (requestId) {
    const selectorStats = cardSelectors.map((selector) => ({ selector, count: $(selector).length }));
    logInfo(requestId, 'DOM selector scan', { selectorStats });
  }
  const selected = cardSelectors.find((selector) => $(selector).length > 0);
  if (!selected) return items;

  $(selected).each((_: any, element: any) => {
    const card = $(element);

    const title =
      card.find('.tAxDx').first().text().trim()
      || card.find('.Xjkr3b').first().text().trim()
      || card.find('h3').first().text().trim()
      || card.find('a[role="link"]').first().text().trim()
      || '';

    const rawUrl =
      card.find('a.shntl').first().attr('href')
      || card.find('a.Lq5OHe').first().attr('href')
      || card.find('a[href]').first().attr('href')
      || '';
    const url = normalizeUrl(String(rawUrl));
    const domain = getDomainFromUrl(url);

    const priceText =
      card.find('.a8Pemb').first().text().trim()
      || card.find('.e10twf').first().text().trim()
      || card.find('.kHxwFf').first().text().trim()
      || card.find('[class*="T14wmb"]').first().text().trim()
      || card.find('[aria-label*="$"]').first().attr('aria-label')
      || '';
    const price = parsePrice(String(priceText));

    const imageNode = card.find('img').first();
    const image = toHttps(
      imageNode.attr('src')
      || imageNode.attr('data-src')
      || getImageFromSrcset(imageNode.attr('srcset'))
      || '',
    );

    if (!title || !url || !domain || !Number.isFinite(price) || price <= 0) return;
    if (!isAllowedOtherStoreDomain(domain)) return;
    if (price > maxPrice * 1.8) return;

    const similarity = getTitleSimilarity(originalQuery, title);
    if (similarity < 0.35) return;
    if (seen.has(url)) return;
    seen.add(url);

    const trustScore = getDomainTrustIndex(domain, 'google-shopping');

    items.push({
      url,
      title,
      price,
      image,
      dolarPrice: price / validDolarValue,
      source: 'google-shopping',
      domain,
      trustScore,
      trustLabel: getTrustLabel(trustScore),
    });
  });

  return items;
};

export async function scrapeGoogleShoppingProducts(
  productTitle: string,
  productPrice: number,
  country: Country,
  dolarValue: number,
): Promise<GoogleShoppingComparisonProduct[]> {
  const requestId = Math.random().toString(36).slice(2, 10);
  const query = cleanQuery(productTitle);
  if (!query || !Number.isFinite(productPrice) || productPrice <= 0) {
    logInfo(requestId, 'Invalid input for Google Shopping scraper', { productTitle, productPrice });
    return [];
  }

  const gl = GOOGLE_GL_BY_COUNTRY[country] || 'ar';
  const queryWithHyphen = query.replace(/\s+/g, '-').trim();
  const queryWithSpaces = queryWithHyphen.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  const queryCandidates = Array.from(
    new Set([
      query,
      queryWithSpaces,
      queryWithHyphen,
      queryWithSpaces.split(' ').slice(0, 8).join(' '),
      queryWithSpaces.split(' ').slice(0, 6).join(' '),
    ].filter(Boolean)),
  );
  const brightDataOptions = getBrightDataOptions();
  const requestStrategies = [
    { name: 'direct', config: { headers: REQUEST_HEADERS, timeout: 12000 } },
    ...(brightDataOptions
      ? [{ name: 'proxy', config: { headers: REQUEST_HEADERS, timeout: 12000, ...brightDataOptions } }]
      : []),
  ];

  logInfo(requestId, 'Starting Google Shopping scrape', {
    country,
    gl,
    query,
    queryCandidates,
  });

  for (const candidate of queryCandidates) {
    const urls = [GOOGLE_SEARCH_URL(gl, candidate), GOOGLE_SHOPPING_URL(gl, candidate)];
    for (const strategy of requestStrategies) {
      for (const searchUrl of urls) {
        try {
          logInfo(requestId, 'Trying Google Shopping request', {
            strategy: strategy.name,
            candidate,
            searchUrl,
          });

          const response = await axios.get(searchUrl, strategy.config);
          const html = String(response.data || '');
          const $ = cheerio.load(html);
          const items = parseGoogleShoppingDom($, query, dolarValue, productPrice, requestId);

          logInfo(requestId, 'Google Shopping response parsed', {
            status: response.status,
            candidate,
            strategy: strategy.name,
            searchUrl,
            totalResults: items.length,
            pageTitle: $('title').text().trim().slice(0, 120),
            htmlLength: html.length,
            hasEnableJs: /enablejs|httpservice\/retry\/enablejs/i.test(html),
          });

          if (items.length > 0) {
            return items.sort((a, b) => a.price - b.price).slice(0, 30);
          }
        } catch (error: any) {
          logError(requestId, 'Google Shopping request failed', {
            strategy: strategy.name,
            candidate,
            searchUrl,
            status: error?.response?.status,
            message: error?.message,
          });
        }
      }
    }
  }

  // Fallback for JS-only responses: fetch rendered markdown mirror and parse card lines.
  for (const candidate of queryCandidates) {
    const renderedUrl = `https://r.jina.ai/http://www.google.com/search?tbm=shop&hl=es&gl=${gl}&q=${encodeURIComponent(candidate)}`;
    try {
      logInfo(requestId, 'Trying rendered fallback (r.jina.ai)', { candidate, renderedUrl });
      const response = await axios.get(renderedUrl, {
        headers: REQUEST_HEADERS,
        timeout: 15000,
      });
      const markdown = String(response.data || '');
      const fallbackItems = parseGoogleShoppingFromMarkdown(markdown, query, productPrice, dolarValue);

      logInfo(requestId, 'Rendered fallback parsed', {
        candidate,
        status: response.status,
        totalResults: fallbackItems.length,
      });

      if (fallbackItems.length > 0) return fallbackItems;
    } catch (error: any) {
      logError(requestId, 'Rendered fallback failed', {
        candidate,
        status: error?.response?.status,
        message: error?.message,
      });
    }
  }

  logError(requestId, 'No Google Shopping results after direct + fallback attempts', {
    query,
    queryCandidates,
  });
  return [];
}

export async function scrapeGoogleShoppingSearchProducts(productTitle: any): Promise<GoogleShoppingSearchProduct[]> {
  const user = await getCurrentUser();
  const country = (user?.country as Country) || 'argentina';
  const query = decodeURIComponent(String(productTitle || '')).trim();
  if (!query) return [];

  const comparisonItems = await scrapeGoogleShoppingProducts(
    query,
    Number.MAX_SAFE_INTEGER / 1000,
    country,
    1,
  );

  const sanitized = comparisonItems.filter((item) => {
    const domain = getDomainFromUrl(item.url) || item.domain;
    if (!domain) return false;
    return isAllowedOtherStoreDomain(domain);
  });

  const strict = sanitized.filter((item) => {
    const domain = getDomainFromUrl(item.url) || item.domain;
    return isLikelyPublicStoreDomain(domain);
  });

  const selected = strict.length > 0 ? strict : sanitized;

  return selected.map((item) => {
    const domain = getDomainFromUrl(item.url) || item.domain;
    const trustScore = getDomainTrustIndex(domain, 'google-shopping');
    return {
      url: item.url,
      title: item.title,
      currentPrice: item.price,
      originalPrice: 0,
      image: item.image,
      freeShipping: '',
      currency: CURRENCY_BY_COUNTRY[country] || '$',
      features: '',
      isBestSeller: '',
      source: 'google-shopping' as const,
      domain,
      trustScore,
      trustLabel: getTrustLabel(trustScore),
    };
  });
}
