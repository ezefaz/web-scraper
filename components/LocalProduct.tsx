'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { scrapeTiendamiaProduct } from '@/lib/scraper/tiendiamia-product';
import PriceInfoCard from './PriceInfoCard';
import Link from 'next/link';
import { Image, Skeleton } from '@nextui-org/react';
import { Badge, Card } from '@tremor/react';
import { ProductType, TiendamiaProduct } from '@/types';
import { PiKeyReturn } from 'react-icons/pi';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { scrapePriceComparissonProducts } from '@/lib/scraper/price-comparisson';
import { scrapeMLProductDetail } from '@/lib/scraper/mercadolibre-product-detail';
import { scrapeMLProduct } from '@/lib/scraper';
import { formatNumber } from '@/lib/utils';
import ProductBadges from './ProductBadges';

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
        const data: any = await scrapeMLProduct(url);

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
    <div className='mt-20'>
      {productData ? (
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
                  {productData.currency}{' '}
                  {productData.currentPrice !== productData.originalPrice
                    ? formatNumber(productData.originalPrice)
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

            {/* <div className='my-7 w-full flex flex-col-2 gap-5'>
              <div className='flex mr-5 m-auto gap-6 flex-wrap'>
                <PriceInfoCard
                  title='Precio Actual'
                  iconSrc='/assets/icons/price-tag.svg'
                  value={productData[0].currentPrice}
                  borderColor='neutral'
                />
                <PriceInfoCard
                  title='Valor Actual en Dolar'
                  iconSrc='/assets/icons/arrow-down.svg'
                  value={productData[0].currentDollarPrice}
                  borderColor='red'
                />

                <PriceInfoCard
                  title='Precio Mayor'
                  iconSrc='/assets/icons/arrow-up.svg'
                  value={productData[0].originalPrice}
                  borderColor='red'
                />
                <PriceInfoCard
                  title='Precio Mayor Dolar'
                  iconSrc='/assets/icons/arrow-down.svg'
                  value={productData[0].originalDollarPrice}
                  borderColor='blue'
                />
              </div>
            </div> */}

            {/* {currentUser && !isFollowing && <Modal productUrl={productData[0].url} />} */}
          </div>
        </div>
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
