'use client';

import { scrapeAndStoreProducts } from '@/lib/actions';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Loader2, Search } from 'lucide-react';

type SearchbarProps = {
  initialValue?: string;
  className?: string;
  placeholder?: string;
};

const Searchbar = ({
  initialValue = '',
  className = '',
  placeholder = 'Ingrese un producto o link, y comience a seguirlo!',
}: SearchbarProps) => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const normalizedInitialValue = useMemo(() => initialValue.trim(), [initialValue]);

  useEffect(() => {
    if (normalizedInitialValue) {
      setSearchPrompt(normalizedInitialValue);
    }
  }, [normalizedInitialValue]);

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
    <form className={`w-full ${className}`} onSubmit={handleSubmit}>
      <label htmlFor='global-search-input' className='text-sm text-muted-foreground'>
        Búsqueda
      </label>
      <div className='mt-1.5 h-14 border border-border bg-section-grey px-3 flex items-center gap-2'>
        <input
          id='global-search-input'
          type='text'
          value={searchPrompt}
          onChange={(e) => setSearchPrompt(e.target.value)}
          placeholder={placeholder}
          className='flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground/80 outline-none'
        />
        <button
          type='submit'
          className='inline-flex h-9 w-9 items-center justify-center border border-border bg-background text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50'
          disabled={searchPrompt.trim() === '' || isLoading}
          aria-label='Buscar producto'
        >
          {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Search className='h-4 w-4' />}
        </button>
      </div>
    </form>
  );
};

export default Searchbar;
