import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Modal from '@/components/Modal';
import PriceInfoCard from '@/components/PriceInfoCard';
import ProductCard from '@/components/ProductCard';
import BarChart from '@/components/charts/BarChart';

import { getCurrentUser, getProductByURL, getSimilarProducts } from '@/lib/actions';
import {
  formatNumber,
  formatUSD,
  getCurrentMonthlyDolarData,
  getCurrentWeekDolarData,
  getMonthlyData,
  getWeeklyData,
} from '@/lib/utils';
import { ProductType, UserType } from '@/types';
import DolarBasedChart from '@/components/charts/LineChart';
import { Badge, Card, Tab, TabGroup, TabList } from '@tremor/react';
import ScraperButton from '@/components/ScraperButton';
import ProductTabs from '@/components/ProductTabs';

import { IoIosStarOutline } from 'react-icons/io';
import ProductBadges from '@/components/ProductBadges';

type Props = {
  params: { id: string };
};

const ProductDetails = async ({ params: { id } }: Props) => {
  const currentUser = await getCurrentUser();

  const userProduct = currentUser.products.find((product: any) => product._id.toString() === id);

  const productUrl = userProduct.url;

  const product: ProductType = await getProductByURL(productUrl);

  const isFollowing = currentUser.products?.some(
    (product: ProductType) => product.url === productUrl && product.isFollowing
  );

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

  const dolarWeeklyData = getCurrentWeekDolarData(dolarHistory, currentPrice);
  const dolarMonthlyData = getCurrentMonthlyDolarData(dolarHistory, currentPrice);

  if (!product) redirect('/');

  const similarProducts = await getSimilarProducts(id);

  return (
    <div className='product-container mt-16' id='information'>
      {' '}
      <ProductTabs />
      <div className='flex gap-10 sm:cap-5 xl:flex-row flex-col'>
        <div className='flex flex-row flex-col mr-8 h-[max-content]'>
          <Card decoration='bottom' decorationColor='orange'>
            <Image src={product.image} alt={product.title} width={450} height={450} />
          </Card>
        </div>
        <div className='flex-1 flex flex-col'>
          <div className='flex justify-between items-start gap-5 flex-wrap pt-6'>
            <div className='flex flex-col gap-3'>
              <p className='text-[28px] hover:text-primary transition-colors duration-300'>{product.title}</p>
              <Link
                href={product.url}
                target='_blank'
                className='text-base text-black opacity-50 hover:opacity-75 transition-opacity duration-300 dark:text-white'
              >
                Visitar Producto
              </Link>
              <p>Tienda {product.storeName ? product.storeName : ''}</p>
            </div>

            {/* <div className='flex items-center gap-3 py-3'>
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
            </div> */}
          </div>
          <div className='product-info'>
            <div className='flex flex-col gap-2'>
              <p className='text-[34px] text-secondary font-bold dark:text-white hover:text-primary  '>{`${
                product.currency
              } ${formatNumber(currentPrice)}`}</p>
              <p className='text-[21px] text-black opacity-50 line-through '>
                {product.currentPrice !== product.originalPrice
                  ? `${product.currency} ${formatNumber(product.originalPrice)}`
                  : ''}
              </p>
            </div>
            <ProductBadges
              stars={product.stars}
              reviewsCount={product.reviewsCount}
              stockAvailable={product.stockAvailable}
              isFreeReturning={product.isFreeReturning}
              isFreeShipping={product.isFreeShipping}
              status={product.status}
            />
            <div className='flex flex-col gap-10 m-auto'>
              {/* <div className='flex flex-col gap-5'>
                {product.description.length > 2 && (
                  <>
                    <h3 className='text-2xl text-secondary font-semibold'>Descripción</h3>
                    <div className='flex flex-col gap-4'>{product?.description?.split('/n')}</div>
                  </>
                )}
              </div> */}
              <button className='btn w-fit m-auto flex items-center justify-center gap-2 min-w-[200px]'>
                <Image src='/assets/icons/bag.svg' alt='check' width={22} height={22} />
                <Link href={product.url} target='_blank' className='text-base text-white'>
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

          {currentUser && !isFollowing && <Modal productUrl={product.url} />}
        </div>
      </div>
      <div id='history'></div>
      <div className='mx-auto max-w-[510px] text-center mb-2'>
        <div id='comparisson'></div>
        <span className='block text-lg font-semibold text-primary'>Graficos</span>
        <h1 className=' text-3xl mr-3 font-bold head-text  sm:text-1xl md:text-[40px] dark:text-white'>
          Historial de Precios
        </h1>
      </div>
      <div className='flex flex-col lg:flex-row  gap-20 mt-10 w-full'>
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
            weeklyData={dolarWeeklyData}
            monthlyData={dolarMonthlyData}
          />
        </div>
      </div>
      <div className='mx-auto max-w-[510px] text-center mb-2'>
        <div id='comparisson'></div>
        <span className='block text-lg font-semibold text-primary'>Precios</span>
        <h1 className=' text-3xl font-bold head-text sm:text-1xl  md:text-[40px] dark:text-white'>
          Comparación de Precios
        </h1>
      </div>
      <div className='flex justify-center m-auto gap-10 xl:flex-row flex-row w-20 w-full'>
        <ScraperButton productTitle={product.title} productPrice={product.currentPrice} />
      </div>
      {similarProducts && similarProducts?.length > 0 && (
        <div className='py-14 flex flex-col gap-2 w-full' id='trending'>
          <div className='mx-auto max-w-[510px] text-center mb-2'>
            {/* <span className='block text-lg font-semibold text-primary'>Graficos</span> */}
            <h1 className=' text-3xl font-bold head-text sm:text-1xl md:text-[40px]'>Otros Productos</h1>
          </div>
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
