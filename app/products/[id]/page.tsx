import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Modal from '@/components/Modal';
import PriceInfoCard from '@/components/PriceInfoCard';
import ProductCard from '@/components/ProductCard';
import BarChart from '@/components/charts/BarChart';

import { getProductById, getSimilarProducts } from '@/lib/actions';
import { formatNumber, formatUSD, getMonthlyData, getWeeklyData } from '@/lib/utils';
import { DolarHistoryItem, Product } from '@/types';
import DolarBasedChart from '@/components/charts/LineChart';
import { Card } from '@tremor/react';

type Props = {
  params: { id: string };
};

const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product = await getProductById(id);

  const { currentDolar, priceHistory, currentPrice, dolarHistory } = product;

  const dolarValue = Number(currentDolar.value);
  const scrapedDolarDate = currentDolar.date;

  const priceBasedOnDolar = currentPrice / dolarValue;

  const productHistory = priceHistory;

  const lastDolarValue: Array<Number> = [];
  const lastDolarDates: Array<Date> = [];

  dolarHistory.forEach((p) => {
    if (p.value) {
      lastDolarValue.push(p.value);
      lastDolarDates.push(p.date);
    }
  });

  const dolarSet = new Set();
  const uniqueDolarValue: Array<number | Number> = [];

  for (const price of lastDolarValue) {
    if (!dolarSet.has(price)) {
      dolarSet.add(price);
      uniqueDolarValue.push(price);
    }
  }

  const uniqueDolarDatesSet = new Set(lastDolarDates);

  const uniqueDolarDatesArray = Array.from(uniqueDolarDatesSet);

  // Inicializa los arreglos lastPrices y lastDates
  const lastPrices: Array<Number> = [];
  const lastDates: Array<Date> = [];

  // Extrae los precios y fechas de updatedPriceHistory
  productHistory.forEach((p) => {
    lastPrices.push(p.price);
    lastDates.push(p.date);
  });

  // Filter the dates that are equal, removing the hours.

  const priceSet = new Set();
  const uniquePrices = [];

  for (const price of lastPrices) {
    if (!priceSet.has(price)) {
      priceSet.add(price);
      uniquePrices.push(price);
    }
  }

  const formattedDates = lastDates.map((date) => date.toISOString().slice(0, 10));
  const uniqueDatesSet = new Set(formattedDates);

  const uniqueDatesArray: Array<string | Date> = Array.from(uniqueDatesSet);

  const weeklyData = getWeeklyData(priceHistory, currentPrice, product.originalPrice);
  const monthlyData = getMonthlyData(priceHistory, currentPrice, product.originalPrice);

  if (!product) redirect('/');

  const similarProducts = await getSimilarProducts(id);

  return (
    <div className='product-container mt-16'>
      {' '}
      <div className='flex gap-28 xl:flex-row flex-col'>
        <div className='flex gap-28 xl:flex-row flex-col h-[max-content]'>
          <Card decoration='bottom' decorationColor='orange'>
            <Image src={product.image} alt={product.title} width={450} height={450} className='m-4' />
          </Card>
        </div>
        <div className='flex-1 flex flex-col'>
          <div className='flex justify-between items-start gap-5 flex-wrap pt-6'>
            <div className='flex flex-col gap-3'>
              <p className='text-[28px] hover:text-primary transition-colors duration-300'>{product.title}</p>
              <Link
                href={product.url}
                target='_blank'
                className='text-base text-black opacity-50 hover:opacity-75 transition-opacity duration-300'
              >
                Visitar Producto
              </Link>
            </div>

            <div className='flex items-center gap-3 py-3'>
              <div className='flex items-center gap-1 text-[#D46F77]'>
                <Image src='/assets/icons/red-heart.svg' alt='heart' width={20} height={20} />
                <p className='text-base font-semibold'>{product.reviewsCount}</p>
              </div>
              <div className='p-2 bg-white-200 rounded-full'>
                <Image src='/assets/icons/bookmark.svg' alt='bookmark' height={20} width={20} />
              </div>
              <div className='p-2 bg-white-200 rounded-full'>
                <Image src='/assets/icons/share.svg' alt='share' height={20} width={20} />
              </div>
            </div>
          </div>
          <div className='product-info'>
            <div className='flex flex-col gap-2'>
              <p className='text-[34px] text-secondary font-bold hover:text-primary'>{`${
                product.currency
              } ${formatNumber(currentPrice)}`}</p>
              <p className='text-[21px] text-black opacity-50 line-through '>
                {`${product.currency} ${formatNumber(product.originalPrice)}`}
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
          <div className='my-7 w-full flex flex-col-2 gap-5'>
            <div className='flex m-auto gap-6 flex-wrap'>
              <PriceInfoCard
                title='Precio Actual'
                iconSrc='/assets/icons/price-tag.svg'
                value={` ${product.currency} ${formatNumber(currentPrice)}`}
                borderColor='neutral'
              />
              <PriceInfoCard
                title='Precio Promedio'
                iconSrc='/assets/icons/chart.svg'
                value={`${product.currency} ${formatNumber(product.averagePrice)}`}
                borderColor='blue'
              />
              <PriceInfoCard
                title='Precio Mayor'
                iconSrc='/assets/icons/arrow-up.svg'
                value={`${product.currency} ${formatNumber(product.highestPrice)}`}
                borderColor='red'
              />
              <PriceInfoCard
                title='Precio Menor'
                iconSrc='/assets/icons/arrow-down.svg'
                value={`${product.currency} ${formatNumber(product.lowestPrice)}`}
                borderColor='green'
              />
              <PriceInfoCard
                title='Valor Actual en Dolar'
                iconSrc='/assets/icons/arrow-down.svg'
                value={`${formatUSD(priceBasedOnDolar)}`}
                borderColor='red'
              />
            </div>
          </div>

          <Modal productId={id} />
        </div>
      </div>
      <div className='flex flex-col lg:flex-row gap-5 m-auto'>
        <div className='w-full m-auto lg:w-[50%]'>
          <BarChart
            productTitle={product.title}
            priceHistory={uniquePrices}
            dateHistory={uniqueDatesArray}
            currentPrice={currentPrice}
            originalPrice={product.originalPrice}
            weeklyData={weeklyData}
          />
        </div>
        <div className='w-full lg:w-[50%]'>
          <DolarBasedChart
            currentPrice={currentPrice}
            dolarValue={dolarValue}
            dolarDate={scrapedDolarDate}
            dolarDates={uniqueDolarDatesArray}
            dolarValues={uniqueDolarValue}
          />
        </div>
      </div>
      <div className='flex flex-col gap-16'>
        <div className='flex flex-col gap-5'>
          {product.description.length > 2 && (
            <>
              <h3 className='text-2xl text-secondary font-semibold'>Descripción</h3>
              <div className='flex flex-col gap-4'>{product?.description?.split('/n')}</div>
            </>
          )}
        </div>
        <button className='btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]'>
          <Image src='/assets/icons/bag.svg' alt='check' width={22} height={22} />
          <Link href='/' className='text-base'>
            Comprar Ahora
          </Link>
        </button>
      </div>
      {similarProducts && similarProducts?.length > 0 && (
        <div className='py-14 flex flex-col gap-2 w-full' id='trending'>
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
