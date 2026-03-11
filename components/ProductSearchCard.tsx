'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatNumber, getDiscountPercentage } from '@/lib/utils';
import { Badge } from '@tremor/react';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { FaHotjar } from 'react-icons/fa';
import { IoBagCheckSharp } from 'react-icons/io5';

interface Props {
  product: any;
}

const ProductSearchCard = ({ product }: Props) => {
  const imageSrc = product?.image || '/assets/images/hero-1.svg';
  const currentPrice = Number(product?.currentPrice) || 0;
  const originalPrice = Number(product?.originalPrice) || 0;
  const hasDiscount = originalPrice > 0 && originalPrice > currentPrice;
  const currency = product?.currency || '$';

  return (
    <Link href={`/products/local?productUrl=${product.url}`} className='group block h-full'>
      <article className='h-full rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950'>
        <div className='mb-3 flex items-center justify-between gap-3'>
          <span className='text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400'>
            Mercado Libre
          </span>
          {hasDiscount ? (
            <span className='rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'>
              {getDiscountPercentage(currentPrice, originalPrice)}% OFF
            </span>
          ) : null}
        </div>

        <div className='overflow-hidden rounded-xl bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'>
          <div className='aspect-[4/3] w-full'>
            <Image
              src={imageSrc}
              alt={product.title}
              width={300}
              height={300}
              className='h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105'
            />
          </div>
        </div>

        <div className='mt-4 min-h-[3.5rem]'>
          <h2 className='text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100'>{product.title}</h2>
        </div>

        <div className='mt-3 flex flex-col'>
          {hasDiscount ? (
            <span className='text-xs text-slate-400 line-through dark:text-slate-500'>
              {currency} {formatNumber(originalPrice)}
            </span>
          ) : null}
          <span className='text-2xl font-bold leading-tight text-slate-900 dark:text-slate-100'>
            {currency} {formatNumber(currentPrice)}
          </span>
        </div>

        <div className='mt-3 flex flex-wrap gap-2'>
          {product.freeShipping ? (
            <Badge icon={LiaShippingFastSolid} size='xs' color='green'>
              Envío gratis
            </Badge>
          ) : null}
          {product.features ? (
            <Badge icon={IoBagCheckSharp} size='xs' color='lime'>
              {String(product.features).slice(0, 40)}
            </Badge>
          ) : null}
          {product.isBestSeller ? (
            <Badge icon={FaHotjar} size='xs' color='orange'>
              Destacado
            </Badge>
          ) : null}
        </div>
      </article>
    </Link>
  );
};

export default ProductSearchCard;
