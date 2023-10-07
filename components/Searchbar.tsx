'use client';

import { scrapeAndStoreProducts } from '@/lib/actions';
import { FormEvent, useState } from 'react';

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const mercadolibreDomains = [
    'mercadolibre.com',
    'mercadolibre.com.ar', // Add other MercadoLibre country domains if needed
  ];

  const isValidMLProductUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;

      // Check if hostname is in the list of MercadoLibre domains
      return mercadolibreDomains.some((domain) => hostname.includes(domain));
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValidLink = isValidMLProductUrl(searchPrompt);

    if (!isValidLink) return alert('Please provide a valid link');
    setIsLoading(true);

    const product = await scrapeAndStoreProducts(searchPrompt);
    try {
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}>
      <input
        type='text'
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder='Enter product link'
        className='searchbar-input'
      />
      <button type='submit' className='searchbar-btn' disabled={searchPrompt === ''}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};

export default Searchbar;
