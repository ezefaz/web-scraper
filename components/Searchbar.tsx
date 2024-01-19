'use client';

import { scrapeAndStoreProducts } from '@/lib/actions';
import { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { SyncLoader } from 'react-spinners';
import { AiOutlineSearch } from 'react-icons/ai';

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const mercadolibreDomains = [
    'mercadolibre.com',
    'mercadolibre.com.ar',
    'www.mercadolivre.com.br',
    'www.mercadolibre.cl',
    'www.mercadolibre.com.co',
    'www.mercadolibre.com.uy',
  ];

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

    setIsLoading(true);

    try {
      if (isValidLink) {
        const productId: any = await scrapeAndStoreProducts(searchPrompt);

        router.push(`/products/${productId}`);
      } else {
        const formattedSearchQuery = encodeURIComponent(searchPrompt.replace(/\s+/g, '-'));
        router.push(`/products?search=${formattedSearchQuery}`);
      }
    } catch (error) {
      toast.error('Ha ocurrido un error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className='flex flex-wrap gap-4 mt-5 sm:flex-col w-full' onSubmit={handleSubmit}>
      <div className='flex items-center'>
        <input
          type='text'
          value={searchPrompt}
          onChange={(e) => setSearchPrompt(e.target.value)}
          placeholder='Busque un producto o ingrese link del producto y comience a seguirlo!'
          className='searchbar-input'
        />
        <button type='submit' className='searchbar-btn   lg:ml-3 md:w-auto px-4 py-2 ' disabled={searchPrompt === ''}>
          {isLoading ? <SyncLoader color='white' size={3} /> : <AiOutlineSearch size={20} />}
        </button>
      </div>
    </form>
  );
};

export default Searchbar;
