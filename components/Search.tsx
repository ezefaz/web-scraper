'use client';

import React, { FormEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { TextInput } from '@tremor/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { toast } from 'react-hot-toast';
import { SelectMenu } from './Select';

import { useRouter } from 'next/navigation';
import { ProductType } from '@/types';
import { getUserProducts, searchUserProducts } from '@/lib/actions';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const searchedProduct: ProductType | any = await searchUserProducts(searchTerm);

      const params = new URLSearchParams(searchParams);
      params.set('search', searchTerm);
      router.push(`?${params.toString()}`);
    } catch (error) {
      toast.error(
        'No se ha podido agregar el producto. Revisa que el enlace sea correcto o que la publicacion este activa.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={onSearch} className='flex justify-start'>
        <div className='max-w-xs'>
          <TextInput
            type='text'
            icon={AiOutlineSearch}
            placeholder='Buscar...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </form>
      <SelectMenu />
    </>
  );
};

export default Search;
