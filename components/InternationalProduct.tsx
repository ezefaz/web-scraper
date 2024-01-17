'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { scrapeTiendamiaProduct } from '@/lib/scraper/tiendiamia-product';
import PriceInfoCard from './PriceInfoCard';
import Link from 'next/link';
import { Image, Skeleton } from '@nextui-org/react';
import { Badge, Card } from '@tremor/react';
import { TiendamiaProduct } from '@/types';
import { PiKeyReturn } from 'react-icons/pi';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';

const InternationalProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const productURL = searchParams.get('productUrl');
  const [productData, setProductData] = useState<TiendamiaProduct[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const url = productURL?.trim();
        const data: any = await scrapeTiendamiaProduct(url);

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

  console.log('DATTTTUN', productData);

  return (
    <div className='mt-20'>
      {productData[0] ? (
        <div className='flex gap-10  sm:cap-5 xl:flex-row flex-col'>
          <div className='flex flex-row flex-col m-8 h-[max-content]'>
            <Card decoration='bottom' decorationColor='orange'>
              <Image src={productData[0].image} isZoomed alt={productData[0].title} width={400} height={400} />
            </Card>
          </div>
          <div className='flex-1 flex flex-col'>
            <div className='flex justify-between items-start gap-5 flex-wrap pt-6'>
              <div className='flex flex-col gap-3'>
                <p className='text-[28px] hover:text-primary transition-colors duration-300'>{productData[0].title}</p>
                <Link
                  href={productURL}
                  target='_blank'
                  className='text-base text-black opacity-50 hover:opacity-75 transition-opacity duration-300 dark:text-white'
                >
                  Visitar Producto
                </Link>
                <p>Vendido por: {productData[0].brand ? productData[0].brand : ''}</p>
              </div>
            </div>

            <div className='product-info'>
              <div className='flex flex-col gap-2'>
                <p className='text-[34px] text-secondary font-bold dark:text-white hover:text-primary  '>
                  {productData[0].currentPrice}
                </p>
                <p className='text-[21px] text-black opacity-50 line-through dark:text-white'>
                  {productData[0].currentPrice !== productData[0].originalPrice ? productData[0].originalPrice : ''}
                </p>
              </div>
              <div className='flex mr-5 m-auto gap-6 flex-wrap'>
                <Badge icon={MdOutlineProductionQuantityLimits} color='green'>
                  {productData[0].availabilityMessage}
                </Badge>
                <Badge icon={PiKeyReturn} color='blue'>
                  {productData[0].returnMessage}
                </Badge>
              </div>
              <p className='text-sm md:text-base lg:text-sm w-[70%] m-2'>{productData[0].refurbishedMessage}</p>
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
                {/* <PriceInfoCard
                  title='Precio Menor'
                  iconSrc='/assets/icons/arrow-down.svg'
                  value={productData[0].lowestPrice}
                  borderColor='green'
                /> */}
              </div>
            </div>

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

export default InternationalProduct;
