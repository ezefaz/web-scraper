'use client';
import React, { useEffect, useState } from 'react';
import { scrapeInternationalValue } from '@/lib/scraper/tiendamia';
import InternationalPriceComparisson from './InternationalPriceComparisson';

interface ScraperButtonProps {
  productTitle: string;
  productPrice: number;
}

const InternationalScraperButton = ({ productTitle, productPrice }: ScraperButtonProps) => {
  const [scrapingInProgress, setScrapingInProgress] = useState(false);
  const [scrapedData, setScrapedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setScrapingInProgress(true);
      try {
        const formattedProductTitle = productTitle.replace(/['"]/g, '').replace(/\s/g, '-');
        const limitedTitle = formattedProductTitle.slice(0, 30);

        const data: any = await scrapeInternationalValue(limitedTitle);
        setScrapedData(data);
      } catch (error) {
        console.error('Error Comparing prices:', error);
      } finally {
        setScrapingInProgress(false);
      }
    };

    fetchData();
  }, [productTitle]);

  return (
    <div className='flex flex-col items-center justify-center space-y-4 w-full'>
      <div className='w-full'>
        <InternationalPriceComparisson scrapedData={scrapedData} productPrice={Number(productPrice)} />
      </div>
    </div>
  );
};

export default InternationalScraperButton;
