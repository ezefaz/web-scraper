import React, { Fragment, useState } from 'react';
import {
  Badge,
  BadgeDelta,
  Button,
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
import { Dialog, Transition } from '@headlessui/react';
import { BsArrowBarRight } from 'react-icons/bs';
import { Skeleton } from '@nextui-org/react';

interface Product {
  url: string;
  title: string;
  price: string;
  image: string;
  dolarPrice: number;
}

interface Props {
  scrapedData: Product[];
  productPrice: number;
}

const PriceComparisson = ({ scrapedData, productPrice }: Props) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const sortedData = scrapedData.sort((a, b) => Number(a.price) - Number(b.price));

  return (
    <>
      {sortedData.length > 0 ? (
        <Card className='relative  mx-auto h-96 overflow-hidden w-full'>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell className='bg-white'>Imagen</TableHeaderCell>
                <TableHeaderCell className='bg-white text-center'>Titulo</TableHeaderCell>
                <TableHeaderCell className='bg-white text-center'>Precio</TableHeaderCell>
                <TableHeaderCell className='bg-white text-center '>Diferencia de Precio</TableHeaderCell>
                <TableHeaderCell className='bg-white text-center'>Precio (USD)</TableHeaderCell>
                <TableHeaderCell className='bg-white text-center'>Acciones</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((product, index) => {
                const itemPrice = Number(product.price);

                const deltaType =
                  productPrice === itemPrice
                    ? 'unchanged'
                    : productPrice > itemPrice
                    ? 'moderateIncrease'
                    : 'moderateDecrease';
                const priceDifference = productPrice - itemPrice;

                return (
                  <TableRow key={index}>
                    <TableCell className='w-1/6 sm:w-auto'>
                      <Image src={product.image} alt={product.title} width={60} height={60} />
                    </TableCell>
                    <TableCell className='text-left'>{product.title}</TableCell>
                    {/* <TableCell className='text-right'>
                              <Text>{product.country}</Text>
                            </TableCell> */}
                    <TableCell className='text-center'>
                      <Text>${formatNumber(itemPrice)}</Text>
                    </TableCell>
                    <TableCell className='w-1/6 text-center m-auto sm:w-auto'>
                      {' '}
                      <BadgeDelta deltaType={deltaType} isIncreasePositive={true} size='xs' className='text-sm'>
                        {`$${formatNumber(priceDifference)}`}{' '}
                      </BadgeDelta>{' '}
                    </TableCell>
                    <TableCell className='text-center'>
                      <Text>${formatNumber(product.dolarPrice)}</Text>
                    </TableCell>
                    <TableCell className='w-1/6 sm:w-auto'>
                      <div className='flex gap-2'>
                        <button
                          className='text-sm text-primary text-center m-auto hover:underline focus:outline-none'
                          onClick={() => window.open(product.url, '_blank')}
                          aria-label={`Visitar ${product.title}`}
                        >
                          Visitar
                        </button>
                        <div
                          className='cursor-pointer text-gray-500 hover:text-blue-500'
                          onClick={() => copyToClipboard(product.url)}
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

          <div className='inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-white pt-12 pb-8 absolute rounded-b-lg w-full'>
            {scrapedData.length > 0 ? (
              <Button
                icon={BsArrowBarRight}
                className='bg-white shadow-md border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                onClick={openModal}
              >
                Mostrar Más
              </Button>
            ) : null}
          </div>
        </Card>
      ) : (
        <Skeleton>
          <Card className='relative  mx-auto h-96 overflow-hidden w-full'></Card>
        </Skeleton>
      )}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-900 bg-opacity-25' />
          </Transition.Child>
          <div className='fixed inset-0 overflow-y-auto w-ful'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel
                  className='w-full w-[60%] transform overflow-hidden ring-tremor bg-white
                                  p-6 text-left align-middle shadow-tremor transition-all rounded-xl'
                >
                  <div className='relative mt-3'>
                    <Table className='h-[450px]'>
                      <TableHead>
                        <TableRow>
                          <TableHeaderCell className='bg-white'>Imagen</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center'>Titulo</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center'>Precio</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center '>Diferencia de Precio</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center'>Precio (USD)</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center'>Acciones</TableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {scrapedData.map((product, index) => {
                          const itemPrice = Number(product.price);

                          const deltaType =
                            productPrice === itemPrice
                              ? 'unchanged'
                              : productPrice > itemPrice
                              ? 'moderateIncrease'
                              : 'moderateDecrease';
                          const priceDifference = productPrice - itemPrice;

                          return (
                            <TableRow key={index}>
                              <TableCell className='w-1/6 sm:w-auto'>
                                <Image src={product.image} alt={product.title} width={60} height={60} />
                              </TableCell>
                              <TableCell>{product.title}</TableCell>
                              {/* <TableCell className='text-right'>
                              <Text>{product.country}</Text>
                            </TableCell> */}
                              <TableCell className='text-center'>
                                <Text>${formatNumber(itemPrice)}</Text>
                              </TableCell>
                              <TableCell className='w-1/6 text-center m-auto sm:w-auto'>
                                {' '}
                                <BadgeDelta
                                  deltaType={deltaType}
                                  isIncreasePositive={true}
                                  size='xs'
                                  className='text-sm text-center m-auto'
                                >
                                  {`$${formatNumber(priceDifference)}`}{' '}
                                </BadgeDelta>{' '}
                              </TableCell>
                              <TableCell className='text-center'>
                                <Text>${formatNumber(product.dolarPrice)}</Text>
                              </TableCell>

                              <TableCell className='w-1/6 text-center m-auto sm:w-auto'>
                                <div className='flex gap-2'>
                                  {/* <TableCell>
                                    <Button size='xs' variant='secondary' color='gray'>
                                      Acción
                                    </Button>
                                  </TableCell> */}
                                  <button
                                    className='text-sm text-primary text-center m-auto hover:underline focus:outline-none'
                                    onClick={() => window.open(product.url, '_blank')}
                                    aria-label={`Visitar ${product.title}`}
                                  >
                                    Visitar
                                  </button>
                                  <div
                                    className='cursor-pointer text-gray-500 hover:text-blue-500'
                                    onClick={() => copyToClipboard(product.url)}
                                  >
                                    {!copySuccess ? (
                                      <Icon icon={HiClipboard} variant='simple' size='sm' tooltip='Copiar link' />
                                    ) : (
                                      <Icon icon={HiClipboardCheck} variant='simple' size='sm' tooltip='Copiado!' />
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                      <div className='absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-white z-0 h-20 w-full' />
                    </Table>
                  </div>
                  <Button
                    className='mt-5 w-full bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                    onClick={closeModal}
                  >
                    Volver
                  </Button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default PriceComparisson;
