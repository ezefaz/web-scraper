'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';
import { getCurrentUser } from '../actions';
import { resolveSearchRequester, runCachedSearch } from '../search/query-cache';
import { getDomainFromUrl, getDomainTrustIndex, getTrustLabel, TrustLabel } from './trust-score';
import {
  fetchSerperShoppingRaw,
  SerperShoppingItem,
} from './serper-shopping';

type Country = 'argentina' | 'brasil' | 'colombia' | 'uruguay';

export interface GoogleShoppingComparisonProduct {
  url: string;
  title: string;
  price: number;
  image: string;
  dolarPrice: number;
  source: 'google-shopping';
  domain: string;
  storeName: string;
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
  storeName: string;
  trustScore: number;
  trustLabel: TrustLabel;
}

const LOG_TAG = '[GOOGLE_SHOPPING]';
const GOOGLE_SHOPPING_DEBUG = process.env.PRICE_COMPARISON_DEBUG === 'true' || process.env.GOOGLE_SHOPPING_DEBUG === 'true';
const GOOGLE_SHOPPING_PARSER_VERSION = 'serper-shopping-v6';

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

const GOOGLE_UDM_SHOPPING_URL = (gl: string, candidate: string) =>
  `https://www.google.com/search?udm=28&hl=es&gl=${gl}&q=${encodeURIComponent(candidate)}`;

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
    // Keep query params, including Google Shopping ibp/prds links.
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

const parseSerperPrice = (item: SerperShoppingItem) => {
  const extracted =
    item.extracted_price
    ?? item.extractedPrice
    ?? item.priceValue
    ?? null;

  if (typeof extracted === 'number' && Number.isFinite(extracted)) {
    return Math.round(extracted);
  }

  const priceText = String(item.price ?? '').trim();
  const parsed = parsePrice(priceText);
  return Number.isFinite(parsed) ? Math.round(parsed) : NaN;
};

const buildSerperQuery = (query: string) => {
  return query.trim();
};

const extractSerperItems = (response: any) => {
  const candidates: Array<[string, unknown]> = [
    ['shopping', response?.shopping],
    ['shoppingResults', response?.shoppingResults],
    ['shopping_results', response?.shopping_results],
    ['results', response?.results],
  ];

  for (const [key, value] of candidates) {
    if (Array.isArray(value)) return { key, items: value as SerperShoppingItem[] };
  }

  return { key: '', items: [] as SerperShoppingItem[] };
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

const cleanStoreName = (value: string) =>
  value
    .replace(/\s+/g, ' ')
    .replace(/^(Desde|From)\s+/i, '')
    .replace(/^[·\-:]+\s*/g, '')
    .trim();

const extractDomainHint = (value: string) => {
  const match = String(value || '')
    .toLowerCase()
    .match(/\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}\b/);
  return match?.[0] || '';
};

const isMercadoLibreStoreName = (value: string) =>
  /mercado\s*libre|mercadolibre|mercado\s*livre/i.test(String(value || ''));

const buildSyntheticStoreDomain = (storeName: string) => {
  const normalized = String(storeName || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

  return normalized ? `${normalized}.store` : '';
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
  requestId?: string,
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

    const trustScore = getDomainTrustIndex(domain, {
      source: 'google-shopping',
      storeName: domain,
      price,
      referencePrice: maxPrice,
    });
    items.push({
      url,
      title,
      price,
      image: toHttps(imageUrl),
      dolarPrice: price / validDolarValue,
      source: 'google-shopping',
      domain,
      storeName: domain,
      trustScore,
      trustLabel: getTrustLabel(trustScore),
    });
  }

  const sorted = items.sort((a, b) => a.price - b.price).slice(0, 30);
  if (requestId) {
    logInfo(requestId, 'Markdown parse summary', {
      totalLines: lines.length,
      totalResults: sorted.length,
      sample: sorted.slice(0, 3).map((item) => ({
        title: item.title,
        price: item.price,
        domain: item.domain,
        url: item.url,
      })),
    });
  }
  return sorted;
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
    'div.wOPJ9c[id^="pve_"]',
    'product-viewer-entrypoint > div.wOPJ9c',
    'li.I8iMf > div[jsname="dQK82e"]',
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

  const stats = {
    totalCards: 0,
    missingTitle: 0,
    missingUrl: 0,
    invalidDomain: 0,
    invalidPrice: 0,
    overMaxPrice: 0,
    lowSimilarity: 0,
    duplicate: 0,
    accepted: 0,
  };

  const extractStoreName = (card: any) => {
    const storeText =
      card.find('.WJMUdc').first().text().trim()
      || card.find('.rw5ecc').first().text().trim()
      || card.find('.aULzUe').first().text().trim()
      || card.find('.IuHnof').first().text().trim()
      || card.find('.E5ocAb').first().text().trim()
      || card.find('[data-merchant-name]').first().attr('data-merchant-name')
      || card.find('[data-merchant]').first().attr('data-merchant')
      || '';
    const ariaLabel =
      card.find('[aria-label*="Desde"]').first().attr('aria-label')
      || card.find('[aria-label*="From"]').first().attr('aria-label')
      || '';
    const fromMatch = ariaLabel ? ariaLabel.match(/(?:Desde|From)\s+([^·,]+)/i) : null;
    const merged = cleanStoreName(String(fromMatch?.[1] || storeText || ''));
    return merged;
  };

  const collectUrlCandidates = (card: any) => {
    const candidates: string[] = [];
    const cardAttrs = [
      'data-href',
      'data-url',
      'data-merchant-url',
      'data-redirect',
      'data-share-url',
      'data-lpage',
      'data-offer-url',
      'data-shop-url',
      'data-destination-url',
      'data-merchant-link-url',
    ];
    cardAttrs.forEach((attr) => {
      const value = card.attr(attr);
      if (value) candidates.push(String(value));
    });

    card.find('a[href]').each((_: any, el: any) => {
      const value = $(el).attr('href');
      if (value) candidates.push(String(value));
    });

    card.find('[data-href]').each((_: any, el: any) => {
      const value = $(el).attr('data-href');
      if (value) candidates.push(String(value));
    });

    card.find('[data-url], [data-merchant-url], [data-lpage], [data-offer-url], [data-shop-url]').each((_: any, el: any) => {
      cardAttrs.forEach((attr) => {
        const value = $(el).attr(attr);
        if (value) candidates.push(String(value));
      });
    });

    const rawCardUrls = String(card.html() || '').match(/https?:\/\/[^"'\\\s<>)]+/g) || [];
    candidates.push(...rawCardUrls);

    return candidates
      .map((candidate) => normalizeUrl(String(candidate)))
      .filter(Boolean);
  };

  const collectImageCandidates = (card: any) => {
    const candidates: string[] = [];

    card.find('img').each((_: any, element: any) => {
      const imageNode = $(element);
      const values = [
        imageNode.attr('src'),
        imageNode.attr('data-src'),
        imageNode.attr('data-lzy_src'),
        getImageFromSrcset(imageNode.attr('srcset')),
      ];

      values.forEach((value) => {
        const normalized = toHttps(String(value || ''));
        if (!normalized) return;
        candidates.push(normalized);
      });
    });

    return candidates.filter(Boolean);
  };

  $(selected).each((_: any, element: any) => {
    stats.totalCards += 1;
    const card = $(element);
    const storeName = extractStoreName(card);
    const accessibleLabel = card.find('[aria-label]').first().attr('aria-label') || '';

    const title =
      card.find('.gkQHve').first().text().trim()
      || card.find('[title]').first().attr('title')
      || card.find('.SsM98d').first().text().trim()
      || card.find('.tAxDx').first().text().trim()
      || card.find('.Xjkr3b').first().text().trim()
      || card.find('h3').first().text().trim()
      || card.find('a[role="link"]').first().text().trim()
      || '';

    const urlCandidates = collectUrlCandidates(card);
    const inferredDomain =
      extractDomainHint(storeName)
      || extractDomainHint(accessibleLabel)
      || extractDomainHint(card.text());
    const inferredUrl = inferredDomain ? `https://${inferredDomain}` : '';
    const preferredUrl = urlCandidates.find((candidate) => {
      const domain = getDomainFromUrl(candidate);
      return !!domain && isAllowedOtherStoreDomain(domain);
    }) || '';
    const fallbackUrl = preferredUrl
      || urlCandidates.find((candidate) => {
        const domain = getDomainFromUrl(candidate);
        return !!domain && !isGoogleOwnedDomain(domain) && !isLocalDomain(domain);
      })
      || inferredUrl
      || '';
    const url = fallbackUrl;
    const domain = getDomainFromUrl(url);

    const priceText =
      card.find('.zxVpA .lmQWe').first().text().trim()
      || card.find('.lmQWe').first().text().trim()
      || card.find('.FG68Ac').first().attr('aria-label')
      || card.find('.a8Pemb').first().text().trim()
      || card.find('.e10twf').first().text().trim()
      || card.find('.kHxwFf').first().text().trim()
      || card.find('[class*="T14wmb"]').first().text().trim()
      || card.find('[aria-label*="$"]').first().attr('aria-label')
      || '';
    const price = parsePrice(String(priceText));

    const imageCandidates = collectImageCandidates(card);
    const image =
      imageCandidates.find((candidate) => /^https?:\/\//i.test(candidate) && !/favicon/i.test(candidate) && !candidate.startsWith('blob:'))
      || imageCandidates.find((candidate) => !candidate.startsWith('data:') && !/favicon/i.test(candidate))
      || imageCandidates[0]
      || '';

    if (!title) {
      stats.missingTitle += 1;
      return;
    }
    if (!url) {
      stats.missingUrl += 1;
      return;
    }
    if (!domain || !isAllowedOtherStoreDomain(domain)) {
      stats.invalidDomain += 1;
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      stats.invalidPrice += 1;
      return;
    }
    if (price > maxPrice * 1.8) {
      stats.overMaxPrice += 1;
      return;
    }

    const similarity = getTitleSimilarity(originalQuery, title);
    if (similarity < 0.2) {
      stats.lowSimilarity += 1;
      return;
    }
    if (seen.has(url)) {
      stats.duplicate += 1;
      return;
    }
    seen.add(url);

    const trustScore = getDomainTrustIndex(domain, {
      source: 'google-shopping',
      storeName,
      price,
      referencePrice: maxPrice,
    });

    items.push({
      url,
      title,
      price,
      image,
      dolarPrice: price / validDolarValue,
      source: 'google-shopping',
      domain,
      storeName,
      trustScore,
      trustLabel: getTrustLabel(trustScore),
    });
    stats.accepted += 1;
  });

  if (requestId) {
    logInfo(requestId, 'DOM parse summary', stats);
  }

  return items;
};

const parseSerperShoppingItems = (
  rawItems: SerperShoppingItem[],
  originalQuery: string,
  dolarValue: number,
  referencePrice: number,
  requestId?: string,
) => {
  const validDolarValue = Number.isFinite(dolarValue) && dolarValue > 0 ? dolarValue : 1;
  const items: GoogleShoppingComparisonProduct[] = [];
  const seen = new Set<string>();
  const excludedDomains: Record<string, number> = {};

  const stats = {
    total: rawItems.length,
    missingTitle: 0,
    missingUrl: 0,
    invalidDomain: 0,
    invalidPrice: 0,
    overMaxPrice: 0,
    lowSimilarity: 0,
    duplicate: 0,
    accepted: 0,
  };

  const maxPrice = Math.max(1, referencePrice);

  const cleanText = (value: unknown) =>
    String(value || '')
      .replace(/\s+/g, ' ')
      .trim();

  const extractSerperImage = (rawItem: SerperShoppingItem) => {
    const fromObject = (value: unknown) => {
      if (!value || typeof value !== 'object') return '';
      const candidate = (value as any).url || (value as any).link || '';
      return cleanText(candidate);
    };

    const candidateValues: unknown[] = [
      rawItem.imageUrl,
      (rawItem as any).image_url,
      rawItem.thumbnailUrl,
      (rawItem as any).thumbnail_url,
      rawItem.thumbnail,
      rawItem.image,
      (rawItem as any).images?.[0],
      (rawItem as any).thumbnails?.[0],
    ];

    for (const candidate of candidateValues) {
      const textCandidate =
        typeof candidate === 'string'
          ? cleanText(candidate)
          : fromObject(candidate);
      const normalized = toHttps(textCandidate);
      const isHttpImage = /^https?:\/\//i.test(normalized);
      const isDataImage = /^data:image\//i.test(normalized);
      if (normalized && (isHttpImage || isDataImage) && !normalized.startsWith('blob:')) {
        return normalized;
      }
    }

    return '';
  };

  rawItems.forEach((rawItem) => {
    const title = cleanText(rawItem.title);
    const url = normalizeUrl(cleanText(rawItem.link || rawItem.url));
    const rawDomain = getDomainFromUrl(url);
    const price = parseSerperPrice(rawItem);
    const image = extractSerperImage(rawItem);
    const storeName = cleanStoreName(cleanText(rawItem.source || rawItem.merchant || rawItem.store || rawDomain));
    const storeLooksLikeMercadoLibre = isMercadoLibreStoreName(storeName);
    const isGoogleRedirect = !!rawDomain && isGoogleOwnedDomain(rawDomain);
    const domain = (!rawDomain || isGoogleRedirect) && storeName
      ? buildSyntheticStoreDomain(storeName)
      : rawDomain;
    const domainAccepted = (() => {
      if (storeLooksLikeMercadoLibre) return false;
      if (rawDomain && !isGoogleOwnedDomain(rawDomain)) {
        return isAllowedOtherStoreDomain(rawDomain);
      }
      return !!domain && domain.includes('.') && !isLocalDomain(domain);
    })();
    const dedupeKey = `${cleanText(rawItem.productId || '')}:${storeName || domain || url}`.toLowerCase() || url;

    if (!title) {
      stats.missingTitle += 1;
      return;
    }
    if (!url) {
      stats.missingUrl += 1;
      return;
    }
    if (!domain || !domainAccepted) {
      stats.invalidDomain += 1;
      excludedDomains[rawDomain || domain || '(none)'] = (excludedDomains[rawDomain || domain || '(none)'] || 0) + 1;
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      stats.invalidPrice += 1;
      return;
    }
    if (price > maxPrice * 1.8) {
      stats.overMaxPrice += 1;
      return;
    }

    const similarity = getTitleSimilarity(originalQuery, title);
    if (similarity < 0.35) {
      stats.lowSimilarity += 1;
      return;
    }
    if (seen.has(dedupeKey)) {
      stats.duplicate += 1;
      return;
    }
    seen.add(dedupeKey);

    const rating = Number((rawItem as any)?.rating);
    const ratingCount = Number((rawItem as any)?.ratingCount);
    const deliveryText = String((rawItem as any)?.delivery || '').toLowerCase();
    const returnPolicyText = String((rawItem as any)?.returnPolicy || '').toLowerCase();
    const trustScore = getDomainTrustIndex(domain, {
      source: 'google-shopping',
      storeName: storeName || domain,
      rating: Number.isFinite(rating) ? rating : undefined,
      ratingCount: Number.isFinite(ratingCount) ? ratingCount : undefined,
      price,
      referencePrice: maxPrice,
      freeShipping: /gratis|free\s+shipping|env[ií]o\s+gratis/.test(deliveryText),
      freeReturns: /devolucion|devolución|free\s+return/.test(returnPolicyText),
    });

    items.push({
      url,
      title,
      price,
      image,
      dolarPrice: price / validDolarValue,
      source: 'google-shopping',
      domain,
      storeName: storeName || domain,
      trustScore,
      trustLabel: getTrustLabel(trustScore),
    });
    stats.accepted += 1;
  });

  if (requestId) {
    logInfo(requestId, 'Serper parse summary', stats);
    const topExcluded = Object.entries(excludedDomains)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    if (topExcluded.length > 0) {
      logInfo(requestId, 'Serper excluded domains', { top: topExcluded });
    }
  }

  return items;
};

async function scrapeGoogleShoppingProductsUncached(
  productTitle: string,
  productPrice: number,
  country: Country,
  dolarValue: number,
  resultLimit = 5,
): Promise<GoogleShoppingComparisonProduct[]> {
  const requestId = Math.random().toString(36).slice(2, 10);
  console.log(`${LOG_TAG}[${requestId}] Start shopping scrape`, {
    productTitle,
    productPrice,
    country,
    resultLimit,
    provider: String(process.env.GOOGLE_SHOPPING_PROVIDER || '').trim().toLowerCase() || 'default',
    parserVersion: GOOGLE_SHOPPING_PARSER_VERSION,
  });
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

  const serperEnabled = Boolean(String(process.env.SERPER_API_KEY || '').trim());
  const provider = String(process.env.GOOGLE_SHOPPING_PROVIDER || '').trim().toLowerCase();
  const serperNum = Math.max(1, Math.min(40, Number(process.env.SERPER_MAX_NUM || 40) || 40));
  const maxResults = Math.max(1, Math.min(40, Number(resultLimit) || 5));
  const serperLogRaw = String(process.env.SERPER_LOG_RAW || '').trim().toLowerCase() === 'true';

  if (serperEnabled && provider !== 'html') {
    try {
      const serperQuery = buildSerperQuery(query);
      logInfo(requestId, 'Trying Serper shopping provider', {
        gl,
        hl: 'es-419',
        num: serperNum,
        query: serperQuery,
      });
      console.log(`${LOG_TAG}[${requestId}] Serper shopping request`, {
        query: serperQuery,
        gl,
        hl: 'es-419',
        num: serperNum,
      });
      const serperResponse = await fetchSerperShoppingRaw(
        { q: serperQuery, gl, hl: 'es-419', num: serperNum },
        { timeoutMs: 12000 },
      );

      if (serperLogRaw) {
        try {
          const preview = JSON.stringify(serperResponse).slice(0, 3000);
          logInfo(requestId, 'Serper raw response preview', { preview });
        } catch {
          // ignore serialization errors
        }
      }

      const { key: serperKey, items: rawItems } = extractSerperItems(serperResponse);

      logInfo(requestId, 'Serper response meta', {
        keys: Object.keys(serperResponse || {}).slice(0, 40),
        usedKey: serperKey || '(none)',
        itemCount: rawItems.length,
      });

      console.log(`${LOG_TAG}[${requestId}] Serper shopping raw results`, {
        usedKey: serperKey || '(none)',
        total: rawItems.length,
        sample: rawItems.slice(0, 5).map((item) => ({
          title: item?.title,
          source: item?.source || item?.merchant || item?.store,
          price: item?.price,
          hasImageUrl: Boolean((item as any)?.imageUrl || (item as any)?.image_url),
          productId: (item as any)?.productId,
          link: item?.link || item?.url,
        })),
      });

      if (requestId && rawItems.length > 0) {
        logInfo(requestId, 'Serper raw sample', {
          total: rawItems.length,
          sampleKeys: Object.keys(rawItems[0] || {}).slice(0, 24),
          sample: rawItems.slice(0, 2).map((item) => ({
            title: item?.title,
            link: item?.link || item?.url,
            price: item?.price,
            extracted_price:
              (item as any)?.extracted_price
              ?? (item as any)?.extractedPrice
              ?? (item as any)?.priceValue,
            source: item?.source || item?.merchant || item?.store,
          })),
        });
      }
      const finalSerperResults = parseSerperShoppingItems(rawItems, query, dolarValue, productPrice, requestId)
        .sort((a, b) => a.price - b.price)
        .slice(0, maxResults);

      console.log(`${LOG_TAG}[${requestId}] Serper shopping parsed results`, {
        count: finalSerperResults.length,
        sample: finalSerperResults.slice(0, 8).map((item) => ({
          title: item.title,
          price: item.price,
          storeName: item.storeName,
          domain: item.domain,
          image: Boolean(item.image),
          trustScore: item.trustScore,
          trustLabel: item.trustLabel,
          url: item.url,
        })),
      });

      if (finalSerperResults.length > 0) {
        return finalSerperResults;
      }
    } catch (error: any) {
      console.error(`${LOG_TAG}[${requestId}] Serper shopping provider failed`, {
        status: error?.status || error?.response?.status,
        message: error?.message,
        data: error?.data || error?.response?.data,
      });
      logError(requestId, 'Serper shopping provider failed', {
        status: error?.status || error?.response?.status,
        message: error?.message,
      });
    }
  }

  for (const candidate of queryCandidates) {
    const urls = [
      GOOGLE_UDM_SHOPPING_URL(gl, candidate),
      GOOGLE_SEARCH_URL(gl, candidate),
      GOOGLE_SHOPPING_URL(gl, candidate),
    ];
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
            hasCaptcha: /captcha|unusual traffic|verify you are a human/i.test(html),
          });

          if (items.length > 0) {
            return items.sort((a, b) => a.price - b.price).slice(0, maxResults);
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

  // Fallback for JS-only responses: fetch rendered markdown mirrors from Google endpoints.
  for (const candidate of queryCandidates) {
    const renderedCandidates = [
      `https://r.jina.ai/http://www.google.com/search?tbm=shop&hl=es&gl=${gl}&q=${encodeURIComponent(candidate)}`,
      `https://r.jina.ai/http://www.google.com/search?udm=28&hl=es&gl=${gl}&q=${encodeURIComponent(candidate)}`,
      `https://r.jina.ai/http://www.google.com/shopping/search?hl=es&gl=${gl}&q=${encodeURIComponent(candidate)}`,
      `https://r.jina.ai/http://shopping.google.com/search?hl=es&gl=${gl}&q=${encodeURIComponent(candidate)}`,
    ];

    for (const renderedUrl of renderedCandidates) {
      try {
        logInfo(requestId, 'Trying rendered Google fallback (r.jina.ai)', { candidate, renderedUrl });
        const response = await axios.get(renderedUrl, {
          headers: REQUEST_HEADERS,
          timeout: 15000,
        });
        const markdown = String(response.data || '');
        const fallbackItems = parseGoogleShoppingFromMarkdown(markdown, query, productPrice, dolarValue, requestId);

        logInfo(requestId, 'Rendered Google fallback parsed', {
          candidate,
          renderedUrl,
          status: response.status,
          totalResults: fallbackItems.length,
        });

        if (fallbackItems.length > 0) {
          return fallbackItems.sort((a, b) => a.price - b.price).slice(0, maxResults);
        }
      } catch (error: any) {
        logError(requestId, 'Rendered Google fallback failed', {
          candidate,
          renderedUrl,
          status: error?.response?.status,
          message: error?.message,
        });
      }
    }
  }

  logError(requestId, 'No Google Shopping results after direct + Google fallback attempts', {
    query,
    queryCandidates,
  });
  return [];
}

export async function scrapeGoogleShoppingProducts(
  productTitle: string,
  productPrice: number,
  country: Country,
  dolarValue: number,
): Promise<GoogleShoppingComparisonProduct[]> {
  const user = await getCurrentUser();
  const requester = await resolveSearchRequester(user?.email || user?.id || null);

  const query = cleanQuery(productTitle);
  const normalizedPrice = Math.max(1, Math.round(Number(productPrice) || 0));
  const normalizedDolarValue = Number.isFinite(dolarValue) && dolarValue > 0
    ? Number(dolarValue.toFixed(4))
    : 1;

  if (!query || normalizedPrice <= 0) {
    return [];
  }

  const comparisonMaxResults = Math.max(1, Math.min(5, Number(process.env.SERPER_MAX_RESULTS || 5) || 5));

  return runCachedSearch({
    namespace: 'google-shopping-products',
    params: {
      query: query.toLowerCase(),
      productPrice: normalizedPrice,
      country,
      dolarValue: normalizedDolarValue,
      parserVersion: GOOGLE_SHOPPING_PARSER_VERSION,
    },
    ttlMs: 30 * 60 * 1000,
    emptyTtlMs: 5 * 60 * 1000,
    rateLimit: {
      identifier: requester,
      scope: 'google-shopping-products',
      limit: 10,
      windowMs: 60 * 1000,
    },
    execute: async () =>
      scrapeGoogleShoppingProductsUncached(query, normalizedPrice, country, normalizedDolarValue, comparisonMaxResults),
  });
}

export async function scrapeGoogleShoppingSearchProducts(productTitle: any): Promise<GoogleShoppingSearchProduct[]> {
  const user = await getCurrentUser();
  const country = (user?.country as Country) || 'argentina';
  const query = decodeURIComponent(String(productTitle || '')).trim();
  if (!query) return [];

  const requestId = Math.random().toString(36).slice(2, 10);
  logInfo(requestId, 'Starting Google Shopping search scrape', { query, country });
  console.log(`${LOG_TAG}[${requestId}] Start search-page scrape`, {
    query,
    normalizedQuery: cleanQuery(query),
    country,
    parserVersion: GOOGLE_SHOPPING_PARSER_VERSION,
  });
  const requester = await resolveSearchRequester(user?.email || user?.id || null);

  return runCachedSearch({
    namespace: 'google-shopping-search-page',
    params: {
      query: query.toLowerCase(),
      country,
      parserVersion: GOOGLE_SHOPPING_PARSER_VERSION,
    },
    ttlMs: 20 * 60 * 1000,
    emptyTtlMs: 5 * 60 * 1000,
    rateLimit: {
      identifier: requester,
      scope: 'google-shopping-search-page',
      limit: 20,
      windowMs: 60 * 1000,
    },
    execute: async () => {
      const searchMaxResults = Math.max(10, Math.min(40, Number(process.env.SERPER_MAX_NUM || 40) || 40));
      const comparisonItems = await scrapeGoogleShoppingProductsUncached(
        query,
        Number.MAX_SAFE_INTEGER / 1000,
        country,
        1,
        searchMaxResults,
      );

      logInfo(requestId, 'Raw Google Shopping search items', {
        totalResults: comparisonItems.length,
        sample: comparisonItems.slice(0, 3).map((item) => ({
          title: item.title,
          price: item.price,
          domain: item.domain,
          url: item.url,
        })),
      });

      const sanitized = comparisonItems.filter((item) => {
        const domain = item.domain || getDomainFromUrl(item.url);
        if (!domain) return false;
        if (isMercadoLibreStoreName(item.storeName || '')) return false;
        if (isMercadoLibreDomain(domain)) return false;
        if (isLocalDomain(domain)) return false;
        return true;
      });

      const strict = sanitized.filter((item) => {
        const domain = item.domain || getDomainFromUrl(item.url);
        return isLikelyPublicStoreDomain(domain);
      });

      const selected = strict.length > 0 ? strict : sanitized;

      logInfo(requestId, 'Filtered Google Shopping search items', {
        sanitizedCount: sanitized.length,
        strictCount: strict.length,
        selectedCount: selected.length,
        sample: selected.slice(0, 3).map((item) => ({
          title: item.title,
          price: item.price,
          domain: item.domain,
        })),
      });

      return selected.map((item) => {
        const domain = item.domain || getDomainFromUrl(item.url);
        const trustScore = getDomainTrustIndex(domain, {
          source: 'google-shopping',
          storeName: item.storeName || domain,
          price: item.price,
        });
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
          storeName: item.storeName || domain,
          trustScore,
          trustLabel: getTrustLabel(trustScore),
        };
      });
    },
  });
}
