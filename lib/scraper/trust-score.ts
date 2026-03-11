'use server';

export type TrustLabel = 'Alta' | 'Media' | 'Baja';

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

export const normalizeDomain = (domain: string) => domain.toLowerCase().replace(/^www\./, '').trim();

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
  if (score >= 80) return 'Alta';
  if (score >= 60) return 'Media';
  return 'Baja';
};

export const getDomainTrustIndex = (domain: string, source?: string) => {
  const normalized = normalizeDomain(domain);
  if (!normalized) return 50;

  let score = 55;

  if (normalized.endsWith('.gov') || normalized.endsWith('.edu')) score += 25;
  if (normalized.endsWith('.com.ar') || normalized.endsWith('.com') || normalized.endsWith('.com.br')) score += 5;

  if (source === 'mercadolibre') score += 20;
  if (source === 'google-shopping') score += 5;

  if (HIGH_TRUST_DOMAINS.has(normalized)) score += 25;
  if (MEDIUM_TRUST_DOMAINS.has(normalized)) score += 10;

  if (normalized.length <= 4 || normalized.includes('--')) score -= 15;
  if (SUSPICIOUS_TERMS.some((term) => normalized.includes(term))) score -= 15;

  return Math.max(20, Math.min(99, score));
};
