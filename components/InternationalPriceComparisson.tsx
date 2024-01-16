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

import { Skeleton } from '@nextui-org/react';
import { formatNumber } from '@/lib/utils';
import { HiClipboard, HiClipboardCheck } from 'react-icons/hi';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { BsArrowBarRight } from 'react-icons/bs';
import Link from 'next/link';

interface Product {
  url: string;
  title: string;
  currentPrice: string;
  image: string;
  currentDollarPrice: string;
}

interface Props {
  scrapedData: Product[];
  productPrice: number;
}

const InternationalPriceComparisson = ({ scrapedData, productPrice }: Props) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <>
      {scrapedData.length > 0 ? (
        <Card className='relative  mx-auto h-96 overflow-hidden w-full'>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell className='bg-white'>Imagen</TableHeaderCell>
                <TableHeaderCell className='bg-white'>Titulo</TableHeaderCell>
                <TableHeaderCell className='bg-white text-center'>Precio con Descuento</TableHeaderCell>
                <TableHeaderCell className='bg-white text-center '>Diferencia de Precio</TableHeaderCell>
                <TableHeaderCell className='bg-white text-center '>Precio (USD)</TableHeaderCell>
                <TableHeaderCell className='bg-white text-center'>Acciones</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scrapedData.map((product, index) => {
                const itemPrice = parseFloat(product.currentPrice.replace(/[^\d.]/g, ''));

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
                    <TableCell className='max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap'>
                      {product.title}
                    </TableCell>
                    {/* <TableCell className='text-right'>
                              <Text>{product.country}</Text>
                            </TableCell> */}
                    <TableCell className='text-left'>
                      <Text className='text-center'>{product.currentPrice}</Text>
                    </TableCell>
                    <TableCell className='m-auto text-center sm:w-auto '>
                      {' '}
                      <BadgeDelta
                        deltaType={deltaType}
                        isIncreasePositive={true}
                        size='xs'
                        className='text-sm text-center'
                      >
                        {`$${formatNumber(priceDifference)}`}{' '}
                      </BadgeDelta>{' '}
                    </TableCell>
                    <TableCell className='text-center'>
                      <Text>{product.currentDollarPrice}</Text>
                    </TableCell>
                    <TableCell className='w-1/6 text-center m-auto sm:w-auto'>
                      <div className='flex gap-2'>
                        {/* <TableCell>
                                    <Button size='xs' variant='secondary' color='gray'>
                                      Acción
                                    </Button>
                                  </TableCell> */}
                        <a
                          className='text-sm text-primary text-center m-auto hover:underline focus:outline-none'
                          href={product.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          aria-label={`Visitar ${product.title}`}
                        >
                          Visitar
                        </a>
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
                          <TableHeaderCell className='bg-white text-center m-auto'>Precio</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center '>Diferencia de Precio</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center'>Precio (USD)</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center'>Acciones</TableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {scrapedData.map((product, index) => {
                          const itemPrice = parseFloat(product.currentPrice.replace(/[^\d.]/g, ''));

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
                              <TableCell className='max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap'>
                                {product.title}
                              </TableCell>
                              {/* <TableCell className='text-right'>
                              <Text>{product.country}</Text>
                            </TableCell> */}
                              <TableCell className='text-right'>
                                <Text className='text-center'>{product.currentPrice}</Text>
                              </TableCell>
                              <TableCell className='m-auto text-center sm:w-auto '>
                                {' '}
                                <BadgeDelta
                                  deltaType={deltaType}
                                  isIncreasePositive={true}
                                  size='xs'
                                  className='text-sm text-center'
                                >
                                  {`$${formatNumber(priceDifference)}`}{' '}
                                </BadgeDelta>{' '}
                              </TableCell>
                              <TableCell className='text-center'>
                                <Text>{product.currentDollarPrice}</Text>
                              </TableCell>

                              <TableCell className='text-center m-auto sm:w-auto '>
                                <div className='flex gap-2'>
                                  <a
                                    className='text-sm text-primary text-center m-auto hover:underline focus:outline-none'
                                    href={product.url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    aria-label={`Visitar ${product.title}`}
                                  >
                                    Visitar
                                  </a>
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

export default InternationalPriceComparisson;
