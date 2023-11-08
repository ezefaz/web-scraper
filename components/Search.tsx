'use client';

import React, { FormEvent, useState } from 'react';
import { TextInput } from '@tremor/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { getUserProducts, searchUserProducts } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import { SelectMenu } from './Select';

import { useRouter } from 'next/navigation';
import { Product } from '@/types';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const searchedProduct: Product = await searchUserProducts(searchTerm);
    } catch (error) {
      toast.error('No se ha podido buscar el producto.');
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
