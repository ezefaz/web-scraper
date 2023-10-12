import Modal from '@/components/Modal';
import PriceInfoCard from '@/components/PriceInfoCard';
import ProductCard from '@/components/ProductCard';
import BarChart from '@/components/charts/BarChart';
import { getProductById, getSimilarProducts } from '@/lib/actions';
import { formatNumber, formatNumberWithCommas } from '@/lib/utils';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  params: { id: string };
};

const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product = await getProductById(id);

  const lastPrices: Array<Number> = [];
  const lastDates: Array<Date> = [];

  const productHistory = product.priceHistory;
  productHistory.map((p) => lastPrices.push(p.price));
  productHistory.map((p) => lastDates.push(p.date));

  if (!product) redirect('/');

  const similarProducts = await getSimilarProducts(id);

  return (
    <div className='product-container'>
      <div className='flex gap-28 xl:flex-row flex-col'>
        <div className='product-image'>
          <Image src={product.image} alt={product.title} width={500} height={400} className='mx-auto' />
        </div>
        <div className='flex-1 flex flex-col'>
          <div className='flex justify-between items-start gap-5 flex-wrap pt-6'>
            <div className='flex flex-col gap-3'>
              <p className='text-[28px]'>{product.title}</p>
              <Link href={product.url} target='_blank' className='text-base text-black opacity-50'>
                Visitar Producto
              </Link>
            </div>
            <div className='flex items-center gap-3'>
              <div className='product-hearts'>
                <Image src='/assets/icons/red-heart.svg' alt='heart' width={20} height={20} />

                <p className='text-base font-semibold text-[#D46F77]'>{product.reviewsCount}</p>
              </div>
              <div className='p-2 bg-white-200 rounded-10'>
                <Image src='/assets/icons/bookmark.svg' alt='bookmark' height={20} width={20} />
              </div>
              <div className='p-2 bg-white-200 rounded-10'>
                <Image src='/assets/icons/share.svg' alt='share' height={20} width={20} />
              </div>
            </div>
          </div>
          <div className='product-info'>
            <div className='flex flex-col gap-2'>
              <p className='text-[34px] text-secondary font-bold'>{`${product.currency} 
               ${formatNumberWithCommas(product.currentPrice)}
              `}</p>
              <p className='text-[21px] text-black opacity-50 line-through'>
                {`${formatNumber(product.highestPrice)}`}
              </p>
            </div>
            <div className='flex flex-col gap-4'>
              <div className='flex gap-3'>
                <div className='product-stars'>
                  <Image src='/assets/icons/star.svg' alt='star' width={16} height={16} />
                  <p className='text-sm text-primary-orange font-semibold'>{product.stars || '4.5'}</p>
                </div>
                <div className='product-reviews'>
                  <Image src='/assets/icons/comment.svg' alt='comment' width={16} height={16} />
                  <p className='text-sm text-secondary font-semibold'>{product.reviewsCount} Reviews</p>
                </div>
                <div className='product-stock'>
                  {/* <Image src='/assets/icons/comment.svg' alt='comment' width={16} height={16} /> */}
                  <p className='text-sm text-secondary font-semibold'>{product.stockAvailable || '0'}</p>
                </div>
              </div>
              <p className='text-sm text-black opacity-50'>
                <span className='text-primary-green font-semibold'>93%</span> de los compradores recomiendan esto.
              </p>
            </div>
          </div>
          <div className='my-7 flex flex-col gap-5'>
            <div className='flex gap-5 flex-wrap'>
              <PriceInfoCard
                title='Precio Actual'
                iconSrc='/assets/icons/price-tag.svg'
                value={`${product.currency} ${formatNumberWithCommas(product.currentPrice)}`}
                borderColor='#b6dbff'
              />
              <PriceInfoCard
                title='Precio Promedio'
                iconSrc='/assets/icons/chart.svg'
                value={` ${formatNumber(product.averagePrice)}`}
                borderColor='#b6dbff'
              />
              <PriceInfoCard
                title='Precio Mayor'
                iconSrc='/assets/icons/arrow-up.svg'
                value={` ${formatNumber(product.highestPrice)}`}
                borderColor='#b6dbff'
              />
              <PriceInfoCard
                title='Precio Menor'
                iconSrc='/assets/icons/arrow-down.svg'
                value={` ${formatNumber(product.lowestPrice)}`}
                borderColor='#B3FFC5'
              />
            </div>
          </div>
          <Modal productId={id} />
        </div>
      </div>
      <div>
        <BarChart productTitle={product.title} priceHistory={lastPrices} dateHistory={lastDates} />
      </div>
      <div className='flex flex-col gap-16'>
        <div className='flex flex-col gap-5'>
          <h3 className='text-2xl text-secondary font-semibold'>Descripción</h3>
          <div className='flex flex-col gap-4'>{product?.description?.split('/n')}</div>
        </div>
        <button className='btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]'>
          <Image src='/assets/icons/bag.svg' alt='check' width={22} height={22} />
          <Link href='/' className='text-base'>
            Comprar Ahora
          </Link>
        </button>
      </div>
      {similarProducts && similarProducts?.length > 0 && (
        <div className='py-14 flex flex-col gap-2 w-full'>
          <p className='section-text'>Trending</p>
          <div className='flex flex-wrap gap-10 mt-7 w-full'>
            {similarProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
