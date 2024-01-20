'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Badge, Card } from '@tremor/react';
import { Image, Popover, PopoverContent, PopoverTrigger, Skeleton } from '@nextui-org/react';
import { PiKeyReturn } from 'react-icons/pi';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';

import { scrapeMLProduct } from '@/lib/scraper';
import PriceInfoCard from './PriceInfoCard';
import { formatNumber } from '@/lib/utils';
import ProductBadges from './ProductBadges';
import { scrapeMLProductDetail } from '@/lib/scraper/mercadolibre-product-detail';
import InternationalScraperButton from './InternationalScraperButton';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import ScraperButton from './ScraperButton';

const LocalProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const productURL = searchParams.get('productUrl');
  const [productData, setProductData] = useState<any>();

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const url = productURL?.trim();
        const data: any = await scrapeMLProductDetail(url);

        setProductData(data);
      } catch (error) {
        console.error('Error scraping product:', error);
      }
    };

    if (productURL) {
      fetchData();
    }
    setIsLoading(false);
  }, [productURL]);

  return (
    <div className='mt-40'>
      {productData ? (
        <>
          <div className='flex gap-10  sm:cap-5 xl:flex-row flex-col'>
            <div className='flex flex-row flex-col m-8 h-[max-content]'>
              <Card decoration='bottom' decorationColor='orange'>
                <Image src={productData.image} isZoomed alt={productData.title} width={400} height={400} />
              </Card>
            </div>
            <div className='flex-1 flex flex-col'>
              <div className='flex justify-between items-start gap-5 flex-wrap pt-6'>
                <div className='flex flex-col gap-3'>
                  <p className='text-[28px] hover:text-primary transition-colors duration-300'>{productData.title}</p>
                  <Link
                    href={productURL}
                    target='_blank'
                    className='text-base text-black opacity-50 hover:opacity-75 transition-opacity duration-300 dark:text-white'
                  >
                    Visitar Producto
                  </Link>
                  <p>Vendido por: {productData.storeName ? productData.storeName : ''}</p>
                </div>
              </div>

              <div className='product-info'>
                <div className='flex flex-col gap-2'>
                  <p className='text-[34px] text-secondary font-bold dark:text-white hover:text-primary  '>
                    {productData.currency} {formatNumber(productData.currentPrice)}
                  </p>
                  <p className='text-[21px] text-black opacity-50 line-through dark:text-white'>
                    {productData.currentPrice !== productData.originalPrice
                      ? `${productData.currency} ${formatNumber(productData.originalPrice)}`
                      : ''}
                  </p>
                </div>
                <ProductBadges
                  stars={productData.stars}
                  reviewsCount={productData.reviewsCount}
                  stockAvailable={productData.stockAvailable}
                  isFreeReturning={productData.isFreeReturning}
                  isFreeShipping={productData.isFreeShipping}
                  status={productData.status}
                />
                <p className='text-sm md:text-base lg:text-sm w-[70%] m-2'>{productData.refurbishedMessage}</p>
                <div className='flex flex-col gap-10 m-auto'>
                  {/* <div className='flex flex-col gap-5'>
                      {productData[0].description.length > 2 && (
                        <>
                          <h3 className='text-2xl text-secondary font-semibold'>Descripción</h3>
                          <div className='flex flex-col gap-4'>{product?.description?.split('/n')}</div>
                        </>
                      )}
                    </div> */}
                  <button className='btn w-fit m-auto flex items-center justify-center gap-2 min-w-[200px]'>
                    <Image src='/assets/icons/bag.svg' alt='check' width={22} height={22} />
                    <Link href={productURL} target='_blank' className='text-base text-white'>
                      Comprar Ahora
                    </Link>
                  </button>
                </div>
              </div>

              <div className='my-7 w-full flex flex-col-2 gap-5'>
                <div className='flex mr-5 m-auto gap-6 flex-wrap'>
                  <PriceInfoCard
                    title='Precio Actual'
                    iconSrc='/assets/icons/price-tag.svg'
                    value={` ${productData.currency} ${formatNumber(productData.currentPrice)}`}
                    borderColor='neutral'
                  />
                  <PriceInfoCard
                    title='Precio Promedio'
                    iconSrc='/assets/icons/chart.svg'
                    value={`${productData.currency} ${formatNumber(productData.averagePrice)}`}
                    borderColor='blue'
                  />
                  <PriceInfoCard
                    title='Precio Mayor'
                    iconSrc='/assets/icons/arrow-up.svg'
                    value={`${productData.currency} ${formatNumber(productData.highestPrice)}`}
                    borderColor='red'
                  />
                  <PriceInfoCard
                    title='Precio Menor'
                    iconSrc='/assets/icons/arrow-down.svg'
                    value={`${productData.currency} ${formatNumber(productData.lowestPrice)}`}
                    borderColor='green'
                  />
                  {/* <PriceInfoCard
                  title='Valor Actual en Dolar'
                  iconSrc='/assets/icons/arrow-down.svg'
                  value={`${formatUSD(priceBasedOnDolar)}`}
                  borderColor='red'
                /> */}
                </div>
              </div>
              {/* {currentUser && !isFollowing && <Modal productUrl={productData[0].url} />} */}
            </div>
          </div>
          <div className='mx-auto max-w-[510px] text-center mb-2'>
            <div id='priceCompare'></div>
            <span className='block text-lg font-semibold text-primary'>Precios</span>
            <h1 className=' text-3xl font-bold head-text sm:text-1xl  md:text-[40px] dark:text-white'>
              Comparación de Precios
            </h1>

            <p className='pt-2 text-muted'>Te mostramos productos de al menos un 10% menor al valor.</p>
          </div>
          <div className='flex justify-center m-auto gap-10 xl:flex-row flex-row w-20 w-full'>
            <ScraperButton productTitle={productData.title} productPrice={productData.currentPrice} />
          </div>
          <div className='mx-auto max-w-[510px] text-center mb-2'>
            <div id='priceCompare'></div>
            <span className='block text-lg font-semibold text-primary'>Precios Internacionales</span>
            <h1 className=' text-3xl mb-3 font-bold head-text sm:text-1xl  md:text-[40px] dark:text-white'>
              Comparación de Precios Internacional
            </h1>
            <Popover placement='bottom'>
              <PopoverTrigger className='m-auto'>
                <IoMdInformationCircleOutline clasName='flex justify-center m-auto' size={30} />
              </PopoverTrigger>
              <PopoverContent>
                <div className='px-0 py-1 w-30'>
                  <div className='text-small font-bold'>Importante!</div>
                  <div className='text-tiny'>
                    Ten en consideración las distintas normativas de aduana en tu país. Además considera gastos de envío
                    e impuestos.
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {/* <p className='pt-2 text-muted'>Considera tambien el costo de impuestos y envío.</p> */}
          </div>
          <div className='flex justify-center m-auto gap-10 xl:flex-row flex-row w-20 w-full'>
            <InternationalScraperButton
              productTitle={productData.title}
              productPrice={Number(productData.currentPrice)}
            />
          </div>
        </>
      ) : (
        <div className='flex gap-10  sm:cap-5 xl:flex-row flex-col'>
          <div className='flex flex-row flex-col m-8 h-[max-content]'>
            <Skeleton className='rounded-lg'>
              <Card decoration='bottom' decorationColor='orange'>
                <Image src='' isZoomed width={400} height={400} />
              </Card>
            </Skeleton>
          </div>
          <div className='flex-1 flex flex-col'>
            <div className='flex justify-between items-start gap-5 flex-wrap pt-6'>
              <div className='flex flex-col gap-3'>
                <Skeleton className=' rounded-lg'>
                  <p className='text-[28px] hover:text-primary transition-colors duration-300'></p>
                </Skeleton>
                <Skeleton className='rounded-lg'>
                  <Link
                    href={'#'}
                    target='_blank'
                    className='text-base text-black opacity-50 hover:opacity-75 transition-opacity duration-300 dark:text-white'
                  >
                    Visitar Producto
                  </Link>
                </Skeleton>
                <Skeleton className=' rounded-lg'>
                  <p></p>
                </Skeleton>
              </div>
            </div>

            <div className='product-info'>
              <div className='flex flex-col gap-2'>
                <Skeleton className=' rounded-lg'>
                  <p className='text-[34px] text-secondary font-bold dark:text-white hover:text-primary  '></p>
                </Skeleton>
                <Skeleton className=' rounded-lg'>
                  <p className='text-[21px] text-black opacity-50 line-through dark:text-white'></p>
                </Skeleton>
              </div>
              <div className='flex mr-5 m-auto gap-6 flex-wrap'>
                <Skeleton className='rounded-lg'>
                  <Badge icon={MdOutlineProductionQuantityLimits} color='green'></Badge>
                </Skeleton>
                <Skeleton className='rounded-lg'>
                  <Badge icon={PiKeyReturn} color='blue'></Badge>
                </Skeleton>
              </div>
              <Skeleton className='rounded-lg'>
                <Skeleton className='text-sm md:text-base lg:text-sm w-[70%] m-2'></Skeleton>
              </Skeleton>
              <div className='flex flex-col gap-10 m-auto'>
                {/* <div className='flex flex-col gap-5'>
                      {productData[0].description.length > 2 && (
                        <>
                          <h3 className='text-2xl text-secondary font-semibold'>Descripción</h3>
                          <div className='flex flex-col gap-4'>{product?.description?.split('/n')}</div>
                        </>
                      )}
                    </div> */}
                {/* <Skeleton className=' rounded-lg'> */}
                <Skeleton className='btn w-fit m-auto flex items-center justify-center gap-2 min-w-[200px]'>
                  <Image src='/assets/icons/bag.svg' alt='check' width={22} height={22} />
                  <Link href='' target='_blank' className='text-base text-white'>
                    Comprar Ahora
                  </Link>
                </Skeleton>
                {/* </Skeleton> */}
              </div>
            </div>

            <div className='my-7 w-full flex flex-col-2 gap-5'>
              <div className='flex mr-5 m-auto gap-6 flex-wrap'>
                <Skeleton className=' rounded-lg'>
                  <PriceInfoCard
                    title='Precio Mayor'
                    iconSrc='/assets/icons/arrow-up.svg'
                    value={''}
                    borderColor='red'
                  />
                </Skeleton>
                <Skeleton className=' rounded-lg'>
                  <PriceInfoCard
                    title='Precio Mayor'
                    iconSrc='/assets/icons/arrow-up.svg'
                    value={''}
                    borderColor='red'
                  />
                </Skeleton>

                <Skeleton className=' rounded-lg'>
                  <PriceInfoCard
                    title='Precio Mayor'
                    iconSrc='/assets/icons/arrow-up.svg'
                    value={''}
                    borderColor='red'
                  />
                </Skeleton>
                <Skeleton className=' rounded-lg'>
                  <PriceInfoCard
                    title='Precio Mayor'
                    iconSrc='/assets/icons/arrow-up.svg'
                    value={''}
                    borderColor='red'
                  />
                </Skeleton>
              </div>
            </div>

            {/* {currentUser && !isFollowing && <Modal productUrl={productData[0].url} />} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalProduct;
