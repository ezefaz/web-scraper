export type TrustLabel = 'Alta' | 'Media' | 'Baja';

type TrustSource = 'mercadolibre' | 'google-shopping' | string;

export type TrustSignals = {
  source?: TrustSource;
  storeName?: string;
  rating?: number;
  ratingCount?: number;
  price?: number;
  referencePrice?: number;
  freeShipping?: boolean;
  freeReturns?: boolean;
  warranty?: boolean;
};

const HIGH_TRUST_DOMAINS = new Set([
  'mercadolibre.com',
  'mercadolibre.com.ar',
  'mercadolivre.com.br',
  'amazon.com',
  'amazon.com.br',
  'tiendamia.com',
  'fravega.com',
  'musimundo.com',
  'garbarino.com',
  'cetrogar.com.ar',
  'falabella.com',
  'carrefour.com.ar',
  'samsung.com',
  'apple.com',
  'fravega.com.ar',
  'cetrogar.com',
  'easy.com.ar',
  'casaideas.com.ar',
]);

const MEDIUM_TRUST_DOMAINS = new Set([
  'ebay.com',
  'walmart.com',
  'bestbuy.com',
  'newegg.com',
  'aliexpress.com',
  'linio.com',
  'ripley.com',
]);

const SUSPICIOUS_TERMS = ['gratis', 'baratisimo', 'superoferta', 'coupon', 'cupon', 'deal', 'promo', 'winner'];

const TRUSTED_STORE_TERMS = [
  'mercado libre',
  'mercadolibre',
  'mercado livre',
  'fravega',
  'cetrogar',
  'musimundo',
  'garbarino',
  'carrefour',
  'falabella',
  'easy',
  'samsung',
  'apple',
  'amazon',
  'ebay',
  'walmart',
  'best buy',
  'bestbuy',
];

const SUSPICIOUS_STORE_TERMS = [
  'winner',
  'promo',
  'super oferta',
  'baratisimo',
  'gratis',
  'descuento total',
];

export const normalizeDomain = (domain: string) => domain.toLowerCase().replace(/^www\./, '').trim();

const normalizeStore = (storeName?: string) =>
  String(storeName || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const getDomainFromUrl = (url: string) => {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    return normalizeDomain(parsed.hostname);
  } catch {
    return '';
  }
};

export const getTrustLabel = (score: number): TrustLabel => {
  if (score >= 75) return 'Alta';
  if (score >= 50) return 'Media';
  return 'Baja';
};

const asSignals = (sourceOrSignals?: string | TrustSignals): TrustSignals => {
  if (!sourceOrSignals) return {};
  if (typeof sourceOrSignals === 'string') return { source: sourceOrSignals };
  return sourceOrSignals;
};

const getPriceAnomalyPenalty = (price?: number, referencePrice?: number) => {
  if (!Number.isFinite(price) || !Number.isFinite(referencePrice) || !price || !referencePrice || referencePrice <= 0) {
    return 0;
  }

  const ratio = price / referencePrice;
  if (ratio <= 0.15) return -28;
  if (ratio <= 0.25) return -20;
  if (ratio <= 0.4) return -10;
  if (ratio >= 2.5) return -4;
  return 0;
};

const getDomainPatternPenalty = (domain: string) => {
  let penalty = 0;
  if (domain.includes('--')) penalty -= 12;
  if (domain.length <= 4) penalty -= 10;
  if ((domain.match(/\d/g) || []).length >= 5) penalty -= 8;
  if (domain.endsWith('.store')) penalty -= 14;
  return penalty;
};

const hasAnyTerm = (value: string, terms: string[]) => terms.some((term) => value.includes(term));

export const getDomainTrustIndex = (domain: string, sourceOrSignals?: string | TrustSignals) => {
  const normalized = normalizeDomain(domain);
  if (!normalized) return 50;
  const signals = asSignals(sourceOrSignals);
  const source = String(signals.source || '').toLowerCase();
  const store = normalizeStore(signals.storeName);

  let score = 50;

  if (normalized.endsWith('.gov') || normalized.endsWith('.edu')) score += 30;
  if (normalized.endsWith('.com.ar') || normalized.endsWith('.com') || normalized.endsWith('.com.br')) score += 6;

  if (source === 'mercadolibre') score += 18;
  if (source === 'google-shopping') score += 0;

  if (HIGH_TRUST_DOMAINS.has(normalized)) score += 30;
  if (MEDIUM_TRUST_DOMAINS.has(normalized)) score += 15;

  if (hasAnyTerm(normalized, SUSPICIOUS_TERMS)) score -= 18;
  score += getDomainPatternPenalty(normalized);

  if (store) {
    if (hasAnyTerm(store, TRUSTED_STORE_TERMS)) score += 18;
    if (hasAnyTerm(store, SUSPICIOUS_STORE_TERMS)) score -= 16;
  }

  const rating = Number(signals.rating);
  if (Number.isFinite(rating)) {
    if (rating >= 4.7) score += 12;
    else if (rating >= 4.3) score += 8;
    else if (rating >= 4.0) score += 5;
    else if (rating <= 3.0) score -= 12;
    else if (rating <= 3.5) score -= 7;
  }

  const ratingCount = Number(signals.ratingCount);
  if (Number.isFinite(ratingCount)) {
    if (ratingCount >= 200) score += 12;
    else if (ratingCount >= 50) score += 8;
    else if (ratingCount >= 10) score += 4;
    else if (ratingCount <= 2) score -= 5;
  }

  score += getPriceAnomalyPenalty(signals.price, signals.referencePrice);

  if (signals.freeShipping) score += 3;
  if (signals.freeReturns) score += 4;
  if (signals.warranty) score += 4;

  return Math.max(10, Math.min(99, Math.round(score)));
};
