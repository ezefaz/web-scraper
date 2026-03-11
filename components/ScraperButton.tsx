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
}

interface ScraperButtonProps {
  productTitle: string;
  productPrice: number;
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

    const fetchData = async () => {
      setScrapingInProgress(true);
      setError('');
      setHasLoaded(false);

      try {
        const data = await scrapePriceComparissonProducts(productTitle, productPrice);
        setScrapedData(data as ComparedProduct[]);
      } catch {
        setError('No pudimos obtener comparación de precios en este momento.');
      } finally {
        setScrapingInProgress(false);
        setHasLoaded(true);
      }
    };

    fetchData();
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
