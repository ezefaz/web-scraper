'use client';

import React, { useEffect, useState } from 'react';
import { ProductType } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { formatNumber, formatNumberWithCommas, getDiscountPercentage } from '@/lib/utils';
import { Badge, BadgeDelta, Metric, Text } from '@tremor/react';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { FaHotjar } from 'react-icons/fa';
import { IoBagCheckSharp } from 'react-icons/io5';
import { Skeleton } from '@nextui-org/react';

interface Props {
  product: any;
}

const ProductSearchCard = ({ product }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <Skeleton className='product-card '>
          <Skeleton className='product-card  shadow-lg rounded-lg p-6 transition duration-300 ease-in-out transform hover:scale-105'>
            <div className='flex justify-between'>
              <p className='text-gray-500 text-lg capitalize'>{product.category}</p>
              {product.originalPrice > product.currentPrice ? (
                <Metric>
                  <BadgeDelta deltaType='moderateIncrease' isIncreasePositive={true} size='xs'>
                    {getDiscountPercentage(product.currentPrice, product.originalPrice)}% OFF
                  </BadgeDelta>
                </Metric>
              ) : null}
            </div>

            <Skeleton className='product-card_img-container'>
              <Image src={product.image} alt={product.title} width={200} height={200} className='product-card_img' />
            </Skeleton>

            <div className='flex flex-col gap-3'>
              <h2 className='product-title dark:text-white'>{product.title}</h2>
              <div className='flex justify-between items-center p-2'>
                <Text className='text-black text-lg p-2 w-full font-semibold dark:text-white'>
                  {product.originalPrice ? (
                    <span className='line-through text-gray-500 dark:text-gray-300'>
                      {`${product.currency} ${formatNumber(product.originalPrice)}`}
                    </span>
                  ) : null}
                  <span className='ml-2'>{`${product.currency} ${formatNumber(product.currentPrice)}`}</span>
                </Text>
              </div>{' '}
              {product.freeShipping ? (
                <Badge icon={LiaShippingFastSolid} size='xs' color='green'>
                  {product.freeShipping}
                </Badge>
              ) : null}
              {product.features ? (
                <Badge icon={IoBagCheckSharp} size='xs' color='lime'>
                  {product.features}
                </Badge>
              ) : null}
              {product.isBestSeller ? (
                <Badge icon={FaHotjar} size='xs' color='orange'>
                  {product.isBestSeller}!
                </Badge>
              ) : null}
            </div>
          </Skeleton>
        </Skeleton>
      ) : (
        <Link href={`/products/local?productUrl=${product.url}`} className='product-card '>
          <div className='product-card  shadow-lg rounded-lg p-6 transition duration-300 ease-in-out transform hover:scale-105'>
            <div className='flex justify-between'>
              <p className='text-gray-500 text-lg capitalize'>{product.category}</p>
              {product.originalPrice > product.currentPrice ? (
                <Metric>
                  <BadgeDelta deltaType='moderateIncrease' isIncreasePositive={true} size='xs'>
                    {getDiscountPercentage(product.currentPrice, product.originalPrice)}% OFF
                  </BadgeDelta>
                </Metric>
              ) : null}
            </div>

            <div className='product-card_img-container'>
              <Image src={product.image} alt={product.title} width={200} height={200} className='product-card_img' />
            </div>

            <div className='flex flex-col gap-3'>
              <h2 className='product-title dark:text-white'>{product.title}</h2>
              <div className='flex justify-between items-center p-2'>
                <Text className='text-black text-lg p-2 w-full font-semibold dark:text-white'>
                  {product.originalPrice ? (
                    <span className='line-through text-gray-500 dark:text-gray-300'>
                      {`${product.currency} ${formatNumber(product.originalPrice)}`}
                    </span>
                  ) : null}
                  {product.currentPrice ? (
                    <span className='ml-2'>{`${product.currency} ${formatNumber(product.currentPrice)}`}</span>
                  ) : null}
                </Text>
              </div>{' '}
              {product.freeShipping ? (
                <Badge icon={LiaShippingFastSolid} size='xs' color='green'>
                  {product.freeShipping}
                </Badge>
              ) : null}
              {product.features ? (
                <Badge icon={IoBagCheckSharp} size='xs' color='lime'>
                  {product.features}
                </Badge>
              ) : null}
              {product.isBestSeller ? (
                <Badge icon={FaHotjar} size='xs' color='orange'>
                  {product.isBestSeller}!
                </Badge>
              ) : null}
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default ProductSearchCard;
