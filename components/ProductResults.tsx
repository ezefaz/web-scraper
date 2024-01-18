'use client';

import { formatNumber, getDiscountPercentage } from '@/lib/utils';
import { Button, Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import Image from 'next/image';
import ProductSearchCard from './ProductSearchCard';

export default function ProductResults({ data }: any) {
  return (
    <div className='bg-white dark:bg-black'>
      <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-12xl lg:px-8'>
        <h2 className='sr-only'>Products</h2>
        <div className='grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xl:gap-x-8'>
          {data.map((product: any, index: number) => (
            <ProductSearchCard key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
