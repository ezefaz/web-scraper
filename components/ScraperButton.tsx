'use client';
import { scrapePriceComparissonProducts } from '@/lib/scraper/price-comparisson';
import React, { useEffect, useState } from 'react';
import PriceComparisson from './PriceComparisson';
import { Card, Text } from '@tremor/react';

interface ComparedProduct {
  url: string;
  title: string;
  price: number;
  image: string;
  dolarPrice: number;
  source: 'mercadolibre' | 'google-shopping';
  domain: string;
  trustScore: number;
  trustLabel: 'Alta' | 'Media' | 'Baja';
}

interface ScraperButtonProps {
  productTitle: string;
  productPrice: number;
};

const CLIENT_CACHE_TTL_MS = 30 * 60 * 1000;
const CLIENT_CACHE_PREFIX = 'savemelin:price-comparison:v1:';

const normalizeCacheTitle = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

const buildClientCacheKey = (title: string, price: number) => {
  const normalizedTitle = normalizeCacheTitle(title);
  const normalizedPrice = Math.max(1, Math.round(Number(price) || 0));
  return `${CLIENT_CACHE_PREFIX}${normalizedTitle}:${normalizedPrice}`;
};

const readClientCache = (key: string): ComparedProduct[] | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts?: number; data?: ComparedProduct[] };
    const ts = Number(parsed?.ts || 0);
    if (!ts || Date.now() - ts > CLIENT_CACHE_TTL_MS) {
      window.sessionStorage.removeItem(key);
      return null;
    }
    return Array.isArray(parsed?.data) ? parsed.data : null;
  } catch {
    return null;
  }
};

const writeClientCache = (key: string, data: ComparedProduct[]) => {
  if (typeof window === 'undefined') return;
  try {
    const payload = JSON.stringify({
      ts: Date.now(),
      data,
    });
    window.sessionStorage.setItem(key, payload);
  } catch {
    // Ignore storage quota/parsing errors.
  }
};

const ScraperButton = ({ productTitle, productPrice }: ScraperButtonProps) => {
  const [scrapingInProgress, setScrapingInProgress] = useState(false);
  const [scrapedData, setScrapedData] = useState<ComparedProduct[]>([]);
  const [error, setError] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!productTitle || !Number.isFinite(productPrice) || productPrice <= 0) {
      setScrapedData([]);
      setHasLoaded(true);
      return;
    }
    const cacheKey = buildClientCacheKey(productTitle, productPrice);
    const cached = readClientCache(cacheKey);
    if (cached) {
      setScrapedData(cached);
      setError('');
      setScrapingInProgress(false);
      setHasLoaded(true);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setScrapingInProgress(true);
      setError('');
      setHasLoaded(false);

      try {
        const data = await scrapePriceComparissonProducts(productTitle, productPrice);
        if (cancelled) return;
        const normalizedData = data as ComparedProduct[];
        setScrapedData(normalizedData);
        writeClientCache(cacheKey, normalizedData);
      } catch {
        if (cancelled) return;
        setError('No pudimos obtener comparación de precios en este momento.');
      } finally {
        if (cancelled) return;
        setScrapingInProgress(false);
        setHasLoaded(true);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [productTitle, productPrice]);

  return (
    <div className='flex flex-col items-center justify-center space-y-4 w-full'>
      <div className='w-full'>
        {error ? (
          <Card className='mx-auto'>
            <Text className='text-center text-red-600'>{error}</Text>
          </Card>
        ) : hasLoaded && !scrapingInProgress && scrapedData.length === 0 ? (
          <Card className='mx-auto'>
            <Text className='text-center text-gray-600 dark:text-gray-300'>
              No encontramos productos más baratos por ahora para este artículo.
            </Text>
          </Card>
        ) : (
          <PriceComparisson scrapedData={scrapedData} productPrice={productPrice} />
        )}
      </div>
    </div>
  );
};

export default ScraperButton;
