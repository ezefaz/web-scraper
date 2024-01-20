'use client';

import { scrapeAndStoreProducts } from '@/lib/actions';
import { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { SyncLoader } from 'react-spinners';
import { AiOutlineSearch } from 'react-icons/ai';
import { Input } from '@nextui-org/react';
import { IoSearchCircleOutline } from 'react-icons/io5';

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

    setIsLoading(true);

    const isValidLink = isValidMLProductUrl(searchPrompt);

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
      <div className='flex items-center w-full'>
        {/* <input
          type='text'
          value={searchPrompt}
          onChange={(e) => setSearchPrompt(e.target.value)}
          placeholder='Busque un producto o ingrese link del producto y comience a seguirlo!'
          className='searchbar-input'
        /> */}
        {/* <button type='submit' className='searchbar-btn' disabled={searchPrompt === ''}> */}
        {/* {isLoading ? <SyncLoader color='white' size={3} /> : <AiOutlineSearch size={20} />} */}
        <Input
          label='Búsqueda'
          type='text'
          value={searchPrompt}
          onChange={(e) => setSearchPrompt(e.target.value)}
          placeholder='Busque un producto o ingrese link del producto y comience a seguirlo!'
          radius='lg'
          classNames={{
            label: 'text-black/50 dark:text-white/90',
            input: [
              'bg-transparent',
              'text-black/90 dark:text-white/90',
              'placeholder:text-default-700/50 dark:placeholder:text-white/60',
            ],
            innerWrapper: 'bg-transparent',
            inputWrapper: [
              'shadow-xl',
              'bg-default-200/50',
              'dark:bg-default/60',
              'backdrop-blur-sm',
              'backdrop-saturate-200',
              'hover:bg-default-200/70',
              'dark:hover:bg-default/70',
              'group-data-[focused=true]:bg-default-200/50',
              'dark:group-data-[focused=true]:bg-default/60',
              '!cursor-text',
              'w-full',
              'mx-auto',
            ],
          }}
          // startContent={
          //   <IoSearchCircleOutline className='text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0' />
          // }
          endContent={
            isLoading ? (
              <SyncLoader
                color='white'
                size={3}
                className='text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0'
              />
            ) : (
              <button type='submit' className='cursor-pointer' disabled={searchPrompt === ''}>
                <AiOutlineSearch
                  size={19}
                  className='text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0'
                />
              </button>
            )
          }
        />

        {/* </button> */}
      </div>
    </form>
  );
};

export default Searchbar;
