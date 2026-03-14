import React, { Fragment, useEffect, useMemo, useState } from 'react';
import {
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
} from '@tremor/react';

import { formatNumber } from '@/lib/utils';
import { HiClipboard, HiClipboardCheck } from 'react-icons/hi';
import { Dialog, Transition } from '@headlessui/react';
import { BsArrowBarRight } from 'react-icons/bs';
import { Skeleton } from '@nextui-org/react';

interface Product {
  url: string;
  title: string;
  price: number;
  image: string;
  dolarPrice: number;
  source: 'mercadolibre' | 'google-shopping';
  domain: string;
  storeName?: string;
  trustScore: number;
  trustLabel: 'Alta' | 'Media' | 'Baja';
}

interface Props {
  scrapedData: Product[];
  productPrice: number;
}

const ResultThumb = ({ src, title, storeName }: { src?: string; title: string; storeName?: string }) => {
  const sanitizedSrc = typeof src === 'string' ? src.trim() : '';
  const [failed, setFailed] = useState(!sanitizedSrc);

  if (failed) {
    return (
      <div className='flex h-[60px] w-[60px] items-center justify-center rounded-md border border-border/70 bg-section-grey text-center'>
        <div>
          <p className='text-[9px] uppercase tracking-[0.12em] text-muted-foreground'>Sin</p>
          <p className='text-[9px] uppercase tracking-[0.12em] text-muted-foreground'>imagen</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={sanitizedSrc}
      alt={title}
      width={60}
      height={60}
      className='rounded-md object-contain'
      onError={() => setFailed(true)}
      title={storeName || title}
    />
  );
};

const PriceComparisson = ({ scrapedData, productPrice }: Props) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSource, setActiveSource] = useState<'mercadolibre' | 'google-shopping'>('mercadolibre');

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const sortedData = useMemo(() => [...scrapedData].sort((a, b) => a.price - b.price), [scrapedData]);
  const mercadolibreData = useMemo(
    () => sortedData.filter((item) => item.source === 'mercadolibre'),
    [sortedData],
  );
  const googleShoppingData = useMemo(
    () => sortedData.filter((item) => item.source === 'google-shopping'),
    [sortedData],
  );

  useEffect(() => {
    if (activeSource === 'mercadolibre' && mercadolibreData.length === 0 && googleShoppingData.length > 0) {
      setActiveSource('google-shopping');
      return;
    }
    if (activeSource === 'google-shopping' && googleShoppingData.length === 0 && mercadolibreData.length > 0) {
      setActiveSource('mercadolibre');
    }
  }, [activeSource, mercadolibreData.length, googleShoppingData.length]);

  const activeData = activeSource === 'mercadolibre' ? mercadolibreData : googleShoppingData;

  const trustDeltaType = (score: number) => {
    if (score >= 80) return 'moderateIncrease';
    if (score >= 60) return 'unchanged';
    return 'moderateDecrease';
  };

  const sourceLabel = activeSource === 'mercadolibre' ? 'MercadoLibre' : 'Otras tiendas';

  return (
    <>
      {sortedData.length > 0 ? (
        <Card className='relative mx-auto h-96 overflow-hidden w-full'>
          <div className='mb-4 flex items-center justify-between gap-4'>
            <div className='inline-flex rounded-lg border border-gray-200 p-1'>
              <button
                type='button'
                className={`rounded-md px-3 py-1.5 text-sm transition ${
                  activeSource === 'mercadolibre'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveSource('mercadolibre')}
              >
                MercadoLibre ({mercadolibreData.length})
              </button>
              <button
                type='button'
                className={`rounded-md px-3 py-1.5 text-sm transition ${
                  activeSource === 'google-shopping'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveSource('google-shopping')}
              >
                Otras tiendas ({googleShoppingData.length})
              </button>
            </div>
            <Text className='text-xs text-gray-500'>Fuente activa: {sourceLabel}</Text>
          </div>

          {activeData.length > 0 ? (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell className='bg-white'>Imagen</TableHeaderCell>
                    <TableHeaderCell className='bg-white text-center'>Titulo</TableHeaderCell>
                    <TableHeaderCell className='bg-white text-center'>Precio</TableHeaderCell>
                    <TableHeaderCell className='bg-white text-center '>Diferencia de Precio</TableHeaderCell>
                    <TableHeaderCell className='bg-white text-center'>Precio (USD)</TableHeaderCell>
                    <TableHeaderCell className='bg-white text-center'>Confiabilidad</TableHeaderCell>
                    <TableHeaderCell className='bg-white text-center'>Acciones</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeData.map((product, index) => {
                    const itemPrice = Number(product.price);
                    const isGoogleHostedLink = /(^https?:\/\/)?(www\.)?google\./i.test(
                      String(product.url || ''),
                    );

                    const deltaType =
                      productPrice === itemPrice
                        ? 'unchanged'
                        : productPrice > itemPrice
                        ? 'moderateIncrease'
                        : 'moderateDecrease';
                    const priceDifference = productPrice - itemPrice;

                    return (
                      <TableRow key={`${product.url}-${index}`}>
                        <TableCell className='w-1/6 sm:w-auto'>
                          <ResultThumb src={product.image} title={product.title} storeName={product.storeName} />
                        </TableCell>
                        <TableCell className='text-left'>
                          <Text>{product.title}</Text>
                          {product.storeName ? (
                            <Text className='text-xs text-gray-500'>{product.storeName}</Text>
                          ) : (
                            <Text className='text-xs text-gray-500'>{product.domain}</Text>
                          )}
                        </TableCell>
                        <TableCell className='text-center'>
                          <Text>${formatNumber(itemPrice)}</Text>
                        </TableCell>
                        <TableCell className='w-1/6 text-center m-auto sm:w-auto'>
                          <BadgeDelta deltaType={deltaType} isIncreasePositive={true} size='xs' className='text-sm'>
                            {`$${formatNumber(priceDifference)}`}
                          </BadgeDelta>
                        </TableCell>
                        <TableCell className='text-center'>
                          <Text>${formatNumber(product.dolarPrice)}</Text>
                        </TableCell>
                        <TableCell className='text-center'>
                          {product.source === 'google-shopping' ? (
                            <BadgeDelta
                              deltaType={trustDeltaType(product.trustScore)}
                              isIncreasePositive={true}
                              size='xs'
                              className='text-sm'
                            >
                              {`${product.trustLabel} (${product.trustScore})`}
                            </BadgeDelta>
                          ) : (
                            <Text className='text-xs text-gray-400'>Confiable</Text>
                          )}
                        </TableCell>
                        <TableCell className='w-1/6 sm:w-auto'>
                          <div className='flex gap-2'>
                            <button
                              className='text-sm text-primary text-center m-auto hover:underline focus:outline-none'
                              onClick={() => window.open(product.url, '_blank')}
                              aria-label={`Visitar ${product.title}`}
                            >
                              {isGoogleHostedLink ? 'Ver en Google Shopping' : 'Visitar'}
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
                <Button
                  icon={BsArrowBarRight}
                  className='bg-white shadow-md border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                  onClick={openModal}
                >
                  Mostrar Más
                </Button>
              </div>
            </>
          ) : (
            <div className='h-[260px] flex items-center justify-center'>
              <Text className='text-center text-gray-600 dark:text-gray-300'>
                No hay resultados para {sourceLabel} en este producto.
              </Text>
            </div>
          )}
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
                  <div className='mb-4 flex items-center justify-between gap-4'>
                    <div className='inline-flex rounded-lg border border-gray-200 p-1'>
                      <button
                        type='button'
                        className={`rounded-md px-3 py-1.5 text-sm transition ${
                          activeSource === 'mercadolibre'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveSource('mercadolibre')}
                      >
                        MercadoLibre ({mercadolibreData.length})
                      </button>
                      <button
                        type='button'
                        className={`rounded-md px-3 py-1.5 text-sm transition ${
                          activeSource === 'google-shopping'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveSource('google-shopping')}
                      >
                        Otras tiendas ({googleShoppingData.length})
                      </button>
                    </div>
                    <Text className='text-xs text-gray-500'>Fuente activa: {sourceLabel}</Text>
                  </div>
                  <div className='relative mt-3'>
                    <Table className='h-[450px]'>
                      <TableHead>
                        <TableRow>
                          <TableHeaderCell className='bg-white'>Imagen</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center'>Titulo</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center'>Precio</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center '>Diferencia de Precio</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center'>Precio (USD)</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center'>Confiabilidad</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center'>Acciones</TableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {activeData.map((product, index) => {
                          const itemPrice = Number(product.price);
                          const isGoogleHostedLink = /(^https?:\/\/)?(www\.)?google\./i.test(
                            String(product.url || ''),
                          );

                          const deltaType =
                            productPrice === itemPrice
                              ? 'unchanged'
                              : productPrice > itemPrice
                              ? 'moderateIncrease'
                              : 'moderateDecrease';
                          const priceDifference = productPrice - itemPrice;

                          return (
                            <TableRow key={`${product.url}-modal-${index}`}>
                              <TableCell className='w-1/6 sm:w-auto'>
                                <ResultThumb src={product.image} title={product.title} storeName={product.storeName} />
                              </TableCell>
                              <TableCell className='text-left'>
                                <Text>{product.title}</Text>
                                <Text className='text-xs text-gray-500'>{product.domain}</Text>
                              </TableCell>
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
                                  {`$${formatNumber(priceDifference)}`}
                                </BadgeDelta>
                              </TableCell>
                              <TableCell className='text-center'>
                                <Text>${formatNumber(product.dolarPrice)}</Text>
                              </TableCell>
                              <TableCell className='text-center'>
                                <BadgeDelta
                                  deltaType={trustDeltaType(product.trustScore)}
                                  isIncreasePositive={true}
                                  size='xs'
                                  className='text-sm text-center m-auto'
                                >
                                  {`${product.trustLabel} (${product.trustScore})`}
                                </BadgeDelta>
                              </TableCell>

                              <TableCell className='w-1/6 text-center m-auto sm:w-auto'>
                                <div className='flex gap-2'>
                                  <button
                                    className='text-sm text-primary text-center m-auto hover:underline focus:outline-none'
                                    onClick={() => window.open(product.url, '_blank')}
                                    aria-label={`Visitar ${product.title}`}
                                  >
                                    {isGoogleHostedLink ? 'Ver en Google Shopping' : 'Visitar'}
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
                        {activeData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className='text-center py-10'>
                              <Text className='text-gray-600 dark:text-gray-300'>
                                No hay resultados para {sourceLabel} en este producto.
                              </Text>
                            </TableCell>
                          </TableRow>
                        ) : null}
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
