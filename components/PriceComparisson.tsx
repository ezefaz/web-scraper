import React, { useState } from 'react';
import {
  Badge,
  BadgeDelta,
  Card,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Title,
} from '@tremor/react';

import { formatNumber } from '@/lib/utils';
import { HiClipboard, HiClipboardCheck } from 'react-icons/hi';
import Image from 'next/image';

interface Product {
  url: string;
  title: string;
  price: string;
  image: string;
}

interface Props {
  scrapedData: Product[];
  productPrice: number;
}

const SkeletonLoader = () => {
  return (
    <div className='animate-pulse flex space-x-4 py-4 border-b border-gray-200'>
      <div className='rounded-full bg-gray-300 h-12 w-12'></div>
      <div className='flex-1 space-y-4 py-1'>
        <div className='h-4 bg-gray-300 rounded w-3/4'></div>
        <div className='h-4 bg-gray-300 rounded w-1/4'></div>
      </div>
      <div className='h-4 bg-gray-300 rounded w-1/4'></div>
      <div className='h-4 bg-gray-300 rounded w-1/4'></div>
      <div className='h-4 bg-gray-300 rounded w-1/4'></div>
    </div>
  );
};

const PriceComparisson = ({ scrapedData, productPrice }: Props) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className='flex justify-center'>
      <Card>
        <Title>Comparación de precios para el producto</Title>
        <div className='overflow-x-auto'>
          <Table className='min-w-full'>
            <TableHead>
              <TableRow>
                <TableHeaderCell className='w-1/6 sm:w-auto'>Imagen</TableHeaderCell>
                <TableHeaderCell className='w-1/6 sm:w-auto'>Titulo</TableHeaderCell>
                <TableHeaderCell className='w-1/6 sm:w-auto'>Precio ($)</TableHeaderCell>
                <TableHeaderCell className='w-1/6 sm:w-auto'>Diferencia</TableHeaderCell>
                <TableHeaderCell className='w-1/6 sm:w-auto'>Acciones</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scrapedData.map((item, index) => {
                const itemPrice = Number(item.price);
                const priceDifference = productPrice - itemPrice;
                const deltaType =
                  productPrice === itemPrice
                    ? 'unchanged'
                    : productPrice > itemPrice
                    ? 'moderateIncrease'
                    : 'moderateDecrease';

                return (
                  <TableRow key={index}>
                    <TableCell className='w-1/6 sm:w-auto'>
                      <Image src={item.image} alt={item.title} width={50} height={50} />
                    </TableCell>
                    <TableCell className='w-1/6 sm:w-auto'>{item.title}</TableCell>
                    <TableCell className='w-1/6 sm:w-auto'>${formatNumber(itemPrice)}</TableCell>
                    <TableCell className='w-1/6 sm:w-auto'>
                      <BadgeDelta deltaType={deltaType} isIncreasePositive={true} size='xs' className='text-sm'>
                        {`$${formatNumber(priceDifference)}`}
                      </BadgeDelta>
                    </TableCell>
                    <TableCell className='w-1/6 sm:w-auto'>
                      <div className='flex gap-2'>
                        <button
                          className='text-sm text-primary hover:underline focus:outline-none'
                          onClick={() => window.open(item.url, '_blank')}
                          aria-label={`Visitar ${item.title}`}
                        >
                          Visitar
                        </button>
                        <div
                          className='cursor-pointer text-gray-500 hover:text-blue-500'
                          onClick={() => copyToClipboard(item.url)}
                        >
                          {!copySuccess ? (
                            <Icon icon={HiClipboard} variant='solid' size='sm' tooltip='Copiar link' />
                          ) : (
                            <Icon icon={HiClipboardCheck} variant='solid' size='sm' tooltip='Copiado!' />
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default PriceComparisson;
