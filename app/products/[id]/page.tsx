import React from 'react';
// import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Modal from '@/components/Modal';
import PriceInfoCard from '@/components/PriceInfoCard';
import ProductCard from '@/components/ProductCard';
import BarChart from '@/components/charts/BarChart';

import { getCurrentUser, getProductById, getProductByURL, getSimilarProducts } from '@/lib/actions';
import {
  formatNumber,
  formatUSD,
  getAnnualDolarData,
  getAnnualMonthlyData,
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

import { Image, Popover, PopoverContent, PopoverTrigger, Skeleton } from '@nextui-org/react';
import ProductBadges from '@/components/ProductBadges';
import InternationalScraperButton from '@/components/InternationalScraperButton';
import { IoMdInformationCircleOutline } from 'react-icons/io';

type Props = {
  params: { id: string };
};

const ProductDetails = async ({ params: { id } }: Props) => {
  const currentUser = await getCurrentUser();
  const foundedProduct = await getProductById(id);

  const userProduct = currentUser.products.find((product: any) => product._id.toString() === id);

  const productUrl = foundedProduct?.url || userProduct?.url;

  const product: ProductType = await getProductByURL(productUrl);
  // const product: ProductType = await getProductById(id);

  const isFollowing = currentUser.products?.some(
    (product: ProductType) => product.url === productUrl && product.isFollowing
  );

  const { currentDolar, priceHistory, currentPrice, dolarHistory, originalPrice, currency } = product;

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

  // const formattedDates = lastDates.map((date) => date.toISOString().slice(0, 10));
  // const uniqueDatesSet = new Set(formattedDates);

  // const uniqueDatesArray: Array<string | Date> = Array.from(uniqueDatesSet);

  // const weeklyData = getWeeklyData(priceHistory, currentPrice, originalPrice);
  const monthlyData = getMonthlyData(priceHistory, currency);

  const weeklyData = getWeeklyData(priceHistory);

  const dolarWeeklyData = getCurrentWeekDolarData(dolarHistory, currentPrice);
  const dolarMonthlyData = getCurrentMonthlyDolarData(dolarHistory, currentPrice);

  const dolarAnualData = getAnnualDolarData(currentPrice, dolarHistory);

  const productAnualData = getAnnualMonthlyData(priceHistory, currency);

  if (!product) redirect('/');

  const similarProducts = await getSimilarProducts(id);

  return (
    <div className='product-container mt-16' id='information'>
      {' '}
      <ProductTabs />
      <div className='flex gap-10 sm:cap-5 xl:flex-row flex-col'>
        <div className='flex flex-row mr-8 h-[max-content]'>
          {product.image ? (
            <Card
              decoration='bottom'
              decorationColor='orange'
              className='md:w-[50%] flex justify-center m-auto ml-4 lg:w-full'
            >
              <Image src={product.image} isZoomed alt={product.title} width={450} height={450} />
            </Card>
          ) : (
            <Skeleton>
              {' '}
              <Card decoration='bottom' decorationColor='orange'></Card>
            </Skeleton>
          )}
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
              <p>Vendido por: {product.storeName ? product.storeName : ''}</p>
            </div>
          </div>
          <div className='product-info'>
            <div className='flex flex-col gap-2'>
              <p className='text-[34px] text-secondary font-bold dark:text-white hover:text-primary  '>{`${
                product.currency
              } ${formatNumber(currentPrice)}`}</p>
              <p className='text-[21px] text-black opacity-50 line-through dark:text-white'>
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
            dateHistory={lastDates}
            lowestPrice={product.lowestPrice}
            highestPrice={product.highestPrice}
            monthlyData={monthlyData}
            weeklyData={weeklyData}
            anualData={productAnualData}
            currency={currency}
          />
        </div>
        {currentUser?.country === 'argentina' ? (
          <div className='w-full lg:w-[50%]'>
            <DolarBasedChart
              currentPrice={currentPrice}
              dolarValue={dolarValue}
              dolarDate={scrapedDolarDate}
              dolarDates={uniqueDolarDatesArray}
              dolarValues={uniqueDolarValue}
              weeklyData={dolarWeeklyData}
              monthlyData={dolarMonthlyData}
              anualData={dolarAnualData}
            />
          </div>
        ) : null}
      </div>
      <div className='mx-auto max-w-[510px] text-center mb-2'>
        <div id='priceCompare'></div>
        <span className='block text-lg font-semibold text-primary'>Precios</span>
        <h1 className=' text-3xl font-bold head-text sm:text-1xl  md:text-[40px] dark:text-white'>
          Comparación de Precios
        </h1>

        <p className='pt-2 text-muted'>Te mostramos productos de al menos un 10% menor al valor.</p>
      </div>
      <div className='flex justify-center m-auto gap-10 xl:flex-row flex-row w-full'>
        <ScraperButton productTitle={product.title} productPrice={product.currentPrice} />
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
                Ten en consideración las distintas normativas de aduana en tu país. Además considera gastos de envío e
                impuestos.
              </div>
            </div>
          </PopoverContent>
        </Popover>
        {/* <p className='pt-2 text-muted'>Considera tambien el costo de impuestos y envío.</p> */}
      </div>
      <div className='flex justify-center m-auto gap-10 xl:flex-row flex-row w-full'>
        <InternationalScraperButton productTitle={product.title} productPrice={Number(product.currentPrice)} />
      </div>
      {similarProducts && similarProducts?.length > 0 && (
        <div className='py-14 flex flex-col gap-2 w-full' id='trending'>
          <div className='mx-auto max-w-[510px] text-center mb-2'>
            {/* <span className='block text-lg font-semibold text-primary'>Graficos</span> */}
            <h1 className=' text-3xl font-bold head-text sm:text-1xl md:text-[40px] dark:text-white'>
              Otros Productos
            </h1>
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
