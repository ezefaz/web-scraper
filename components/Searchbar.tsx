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

    if (!isValidLink) return toast.error('Porfavor inserte un link de mercadolibre válido.');
    setIsLoading(true);
    try {
      const productId: any = await scrapeAndStoreProducts(searchPrompt);

      router.push(`/products/${productId}`);
    } catch (error) {
      toast.error(
        'No se ha podido agregar el producto. Revisa que el enlace sea correcto o que la publicacion este activa.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className='flex flex-wrap gap-4 mt-20 sm:flex-col w-full' onSubmit={handleSubmit}>
      <div className='flex items-center'>
        <input
          type='text'
          value={searchPrompt}
          onChange={(e) => setSearchPrompt(e.target.value)}
          placeholder='Ingrese link del producto y comience a seguirlo!'
          className='searchbar-input'
        />
        <button type='submit' className='searchbar-btn ml-3 md:w-auto px-4 py-2 ' disabled={searchPrompt === ''}>
          {isLoading ? <SyncLoader color='white' size={3} /> : <AiOutlineSearch size={20} />}
        </button>
      </div>
    </form>
  );
};

export default Searchbar;
