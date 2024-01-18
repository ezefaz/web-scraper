'use client';

import React from 'react';
import { ProductType } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { formatNumber, formatNumberWithCommas, getDiscountPercentage } from '@/lib/utils';
import { Badge, BadgeDelta, Metric, Text } from '@tremor/react';
import { LiaShippingFastSolid } from 'react-icons/lia';

interface Props {
  product: ProductType;
}

const ProductSearchCard = ({ product }: Props) => {
  return (
    <>
      <Link href={`/products/${product._id}`} className='product-card '>
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
                <span className='ml-2'>{`${product.currency} ${formatNumber(product.currentPrice)}`}</span>
              </Text>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default ProductSearchCard;
