'use client';
import React, { useEffect, useState } from 'react';
import { scrapeInternationalValue } from '@/lib/scraper/tiendamia';
import InternationalPriceComparisson from './InternationalPriceComparisson';
import { scrapePriceComparissonProducts } from '@/lib/scraper/price-comparisson';

interface ScraperButtonProps {
  productTitle: string;
  productPrice: number;
}

const InternationalScraperButton = ({ productTitle, productPrice }: ScraperButtonProps) => {
  const [scrapingInProgress, setScrapingInProgress] = useState(false);
  const [scrapedData, setScrapedData] = useState([]);

  // const handleScrapeClick = async () => {
  //   setScrapingInProgress(true);
  //   try {
  //     console.log(productTitle);

  //     const formattedProductTitle = productTitle.replace(/\s/g, '%20');
  //     const data: any = await scrapeInternationalValue(formattedProductTitle);

  //     setScrapedData(data);
  //   } catch (error) {
  //     console.error('Error Comparing prices:', error);
  //   } finally {
  //     setScrapingInProgress(false);
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      setScrapingInProgress(true);
      try {
        const formattedProductTitle = productTitle.replace(/\s/g, '-');
        const data: any = await scrapeInternationalValue(formattedProductTitle);
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
      {/* <button
        className='btn text-white flex items-center justify-center p-2'
        onClick={handleScrapeClick}
        disabled={scrapingInProgress}
      >
        {scrapingInProgress ? 'Comparando...' : 'Comparación Internacional'}
      </button> */}
      {/* <button
        onClick={handleScrapeClick}
        disabled={scrapingInProgress}
        className='px-4 py-2 bg-primary text-white rounded-md shadow-md hover:bg-primary-200 transition duration-300'
      >
        {scrapingInProgress ? 'Comparando...' : 'Inciar Comparación de Precios'}
      </button> */}
      <div className='w-full'>
        <InternationalPriceComparisson scrapedData={scrapedData} productPrice={Number(productPrice)} />
      </div>
    </div>
  );
};

export default InternationalScraperButton;
