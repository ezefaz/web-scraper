'use client';
import { scrapeGoogleShopping } from '@/lib/scraper/google';
import React, { useState } from 'react';
import PriceComparisson from './PriceComparisson';

interface ScraperButtonProps {
  productTitle: string;
  productPrice: number;
}

const ScraperButton = ({ productTitle, productPrice }: ScraperButtonProps) => {
  const [scrapingInProgress, setScrapingInProgress] = useState(false);
  const [scrapedData, setScrapedData] = useState([]);

  const handleScrapeClick = async () => {
    setScrapingInProgress(true);
    try {
      const formattedProductTitle = productTitle.replace(/\s/g, '-');

      const data = await scrapeGoogleShopping(formattedProductTitle);
      setScrapedData(data);
      console.log('Scraped Data:', scrapedData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setScrapingInProgress(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center space-y-4'>
      <button
        onClick={handleScrapeClick}
        disabled={scrapingInProgress}
        className='px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-300'
      >
        {scrapingInProgress ? 'Comparando...' : 'Inciar Comparación de Precios'}
      </button>
      <div className='flex justify-center m-auto'>
        <PriceComparisson scrapedData={scrapedData} productPrice={productPrice} />
      </div>
    </div>
  );
};

export default ScraperButton;
