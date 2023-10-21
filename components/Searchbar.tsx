'use client';

import { scrapeAndStoreProducts } from '@/lib/actions';
import { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const mercadolibreDomains = ['mercadolibre.com', 'mercadolibre.com.ar'];

  const isValidMLProductUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;

      return mercadolibreDomains.some((domain) => hostname.includes(domain));
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValidLink = isValidMLProductUrl(searchPrompt);

    if (!isValidLink) return toast.error('Porfavor inserte un link de mercadolibre válido.');
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
        placeholder='Ingrese link del producto y comience a seguirlo!'
        className='searchbar-input'
      />
      <button type='submit' className='searchbar-btn md:w-auto px-4 py-2' disabled={searchPrompt === ''}>
        {isLoading ? 'Buscando...' : 'Buscar'}
      </button>
    </form>
  );
};

export default Searchbar;
