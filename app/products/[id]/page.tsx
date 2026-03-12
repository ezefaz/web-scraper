import Link from 'next/link';
import { redirect } from 'next/navigation';
import PixelPerfectNavbar from '@/components/pixel-perfect-page-main/Navbar';
import PixelPerfectFooter from '@/components/pixel-perfect-page-main/Footer';
import Searchbar from '@/components/Searchbar';
import BarChart from '@/components/charts/BarChart';
import DolarBasedChart from '@/components/charts/LineChart';
import ScraperButton from '@/components/ScraperButton';
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
import { getCurrentUser, getProductById, getProductByURL, getSimilarProducts } from '@/lib/actions';
import { ProductType } from '@/types';
import { Button } from '@/components/pixel-perfect-page-main/button';
import { ExternalLink, History, Package, Sparkles } from 'lucide-react';

type Props = {
  params: { id: string };
};

const ProductDetailsPage = async ({ params: { id } }: Props) => {
  const currentUser = await getCurrentUser();
  const foundedProduct = await getProductById(id);
  const userProduct = currentUser?.products?.find((product: any) => product._id.toString() === id);

  const productUrl = foundedProduct?.url || userProduct?.url;
  if (!productUrl) redirect('/');

  const product: ProductType = await getProductByURL(productUrl);
  if (!product) redirect('/');

  const {
    currentDolar,
    priceHistory = [],
    currentPrice,
    dolarHistory = [],
    originalPrice,
    currency,
    title,
    image,
    storeName,
    status,
    isFreeShipping,
    isFreeReturning,
    category,
    averagePrice,
    highestPrice,
    lowestPrice,
  } = product;

  const dolarValue = Number(currentDolar?.value || 0);
  const scrapedDolarDate = currentDolar?.date;
  const priceBasedOnDolar = dolarValue > 0 ? currentPrice / dolarValue : 0;

  const lastPrices = priceHistory.map((item: any) => item?.price).filter((price: any) => typeof price === 'number');
  const lastDates = priceHistory.map((item: any) => item?.date).filter(Boolean);
  const uniquePrices = Array.from(new Set(lastPrices));
  const uniqueDolarValues = Array.from(
    new Set(dolarHistory.map((item: any) => Number(item?.value || 0)).filter((value: number) => value > 0)),
  );
  const uniqueDolarDatesArray = Array.from(new Set(dolarHistory.map((item: any) => item?.date).filter(Boolean)));

  const monthlyData = getMonthlyData(priceHistory, currency);
  const weeklyData = getWeeklyData(priceHistory);
  const productAnualData = getAnnualMonthlyData(priceHistory, currency);
  const dolarWeeklyData = getCurrentWeekDolarData(dolarHistory, currentPrice);
  const dolarMonthlyData = getCurrentMonthlyDolarData(dolarHistory, currentPrice);
  const dolarAnualData = getAnnualDolarData(currentPrice, dolarHistory);

  const similarProducts = await getSimilarProducts(id);
  const hasDiscount = Number(originalPrice || 0) > Number(currentPrice || 0);

  return (
    <div className='pixel-perfect-home relative min-h-screen bg-background text-foreground'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-y-0 z-[60] border-l border-border/50'
        style={{ left: 'max(calc((100vw - 94rem) / 2 + 2.5rem), 2.5rem)' }}
      />
      <div
        aria-hidden
        className='pointer-events-none absolute inset-y-0 z-[60] border-r border-border/50'
        style={{ right: 'max(calc((100vw - 94rem) / 2 + 2.5rem), 2.5rem)' }}
      />

      <PixelPerfectNavbar />

      <section className='border-y border-border/70'>
        <div className='max-w-[94rem] mx-auto padding-global border-x border-border/70 py-6 lg:py-7'>
          <div className='grid grid-cols-1 px-12 gap-6 items-end'>
            <Searchbar initialValue={title} />
          </div>
        </div>
      </section>

      <section>
        <div className='max-w-[94rem] mx-auto padding-global border-x border-border/70'>
          <div className='py-12 lg:py-14'>
            <div id='information' className='border border-border/70 bg-section-grey p-6 md:p-8 lg:p-10'>
              <div className='grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-8 lg:gap-10'>
                <div className='border border-border/70 bg-background p-4'>
                  <div className='aspect-square w-full overflow-hidden bg-white'>
                    <img src={image} alt={title} className='h-full w-full object-contain' />
                  </div>
                </div>

                <div className='min-w-0'>
                  <div className='flex flex-wrap items-center gap-2 mb-3'>
                    <span className='inline-flex items-center border border-border/70 px-2.5 py-1 text-xs text-muted-foreground bg-background'>
                      {storeName || 'Marketplace'}
                    </span>
                    {category && (
                      <span className='inline-flex items-center border border-border/70 px-2.5 py-1 text-xs text-muted-foreground bg-background'>
                        {category}
                      </span>
                    )}
                    {status && (
                      <span className='inline-flex items-center border border-border/70 px-2.5 py-1 text-xs text-muted-foreground bg-background'>
                        {status}
                      </span>
                    )}
                    {isFreeShipping && (
                      <span className='inline-flex items-center border border-border/70 px-2.5 py-1 text-xs text-muted-foreground bg-background'>
                        Envío gratis
                      </span>
                    )}
                    {isFreeReturning && (
                      <span className='inline-flex items-center border border-border/70 px-2.5 py-1 text-xs text-muted-foreground bg-background'>
                        Devolución gratis
                      </span>
                    )}
                  </div>

                  <h1 className='text-2xl md:text-3xl font-semibold leading-tight text-foreground max-w-4xl'>
                    {title}
                  </h1>

                  <div className='mt-5 flex flex-wrap items-end gap-x-4 gap-y-2'>
                    <p className='text-3xl md:text-4xl font-semibold text-foreground'>
                      {currency} {formatNumber(currentPrice)}
                    </p>
                    {hasDiscount && (
                      <p className='text-lg text-muted-foreground line-through'>
                        {currency} {formatNumber(originalPrice)}
                      </p>
                    )}
                  </div>

                  <div className='mt-8 flex flex-wrap gap-3'>
                    <Link href={product.url} target='_blank'>
                      <Button variant='primary'>
                        <span className='inline-flex items-center gap-2'>
                          Comprar ahora
                          <ExternalLink className='h-4 w-4' />
                        </span>
                      </Button>
                    </Link>
                    <Link href='/user-products'>
                      <Button variant='secondary'>
                        <span className='inline-flex items-center gap-2'>Ver mis productos</span>
                      </Button>
                    </Link>
                  </div>

                  <Link
                    href={product.url}
                    target='_blank'
                    className='mt-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors'
                  >
                    Ver publicación original
                    <ExternalLink className='h-3.5 w-3.5' />
                  </Link>
                </div>
              </div>
            </div>

            <div className='mt-8 border border-border/70 bg-background p-6 md:p-8'>
              <div className='mb-5 flex items-center gap-2'>
                <Package className='h-4 w-4 text-primary' />
                <h2 className='text-lg md:text-xl font-medium text-foreground'>Resumen de precios</h2>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4'>
                <div className='border border-border/70 bg-section-grey p-4'>
                  <p className='text-xs uppercase tracking-wide text-muted-foreground'>Precio actual</p>
                  <p className='mt-2 text-lg font-semibold text-foreground'>
                    {currency} {formatNumber(currentPrice)}
                  </p>
                </div>
                <div className='border border-border/70 bg-section-grey p-4'>
                  <p className='text-xs uppercase tracking-wide text-muted-foreground'>Precio promedio</p>
                  <p className='mt-2 text-lg font-semibold text-foreground'>
                    {currency} {formatNumber(averagePrice)}
                  </p>
                </div>
                <div className='border border-border/70 bg-section-grey p-4'>
                  <p className='text-xs uppercase tracking-wide text-muted-foreground'>Precio más alto</p>
                  <p className='mt-2 text-lg font-semibold text-foreground'>
                    {currency} {formatNumber(highestPrice)}
                  </p>
                </div>
                <div className='border border-border/70 bg-section-grey p-4'>
                  <p className='text-xs uppercase tracking-wide text-muted-foreground'>Precio más bajo</p>
                  <p className='mt-2 text-lg font-semibold text-foreground'>
                    {currency} {formatNumber(lowestPrice)}
                  </p>
                </div>
                <div className='border border-border/70 bg-section-grey p-4'>
                  <p className='text-xs uppercase tracking-wide text-muted-foreground'>Valor en USD</p>
                  <p className='mt-2 text-lg font-semibold text-foreground'>
                    {priceBasedOnDolar > 0 ? formatUSD(priceBasedOnDolar) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div id='history' className='mt-8 border border-border/70 bg-background p-6 md:p-8'>
              <div className='mb-6 flex items-center gap-2'>
                <History className='h-4 w-4 text-primary' />
                <h2 className='text-2xl md:text-3xl font-semibold text-foreground'>Historial de precios</h2>
              </div>
              <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
                <BarChart
                  productTitle={title}
                  priceHistory={uniquePrices}
                  dateHistory={lastDates}
                  lowestPrice={lowestPrice}
                  highestPrice={highestPrice}
                  monthlyData={monthlyData}
                  weeklyData={weeklyData}
                  anualData={productAnualData}
                  currency={currency}
                />
                {currentUser?.country === 'argentina' ? (
                  <DolarBasedChart
                    currentPrice={currentPrice}
                    dolarValue={dolarValue}
                    dolarDate={scrapedDolarDate}
                    dolarDates={uniqueDolarDatesArray as Array<Date>}
                    dolarValues={uniqueDolarValues}
                    weeklyData={dolarWeeklyData}
                    monthlyData={dolarMonthlyData}
                    anualData={dolarAnualData}
                  />
                ) : (
                  <div className='border border-border/70 bg-section-grey p-6 text-sm text-muted-foreground'>
                    El análisis en dólar está disponible para usuarios con perfil de Argentina.
                  </div>
                )}
              </div>
            </div>

            <div id='priceCompare' className='mt-8 border border-border/70 bg-background p-6 md:p-8'>
              <div className='mb-6'>
                <p className='text-sm text-primary font-medium'>Comparación inteligente</p>
                <h2 className='mt-1 text-2xl md:text-3xl font-semibold text-foreground'>
                  Alternativas más baratas para este producto
                </h2>
                <p className='mt-2 text-sm md:text-base text-muted-foreground'>
                  Comparamos precios locales y de otros sitios para mostrarte oportunidades reales de ahorro.
                </p>
              </div>
              <ScraperButton productTitle={title} productPrice={currentPrice} />
            </div>

            {similarProducts && similarProducts.length > 0 && (
              <div className='mt-8 border border-border/70 bg-background p-6 md:p-8' id='trending'>
                <div className='mb-6 flex items-center gap-2'>
                  <Sparkles className='h-4 w-4 text-primary' />
                  <h2 className='text-2xl md:text-3xl font-semibold text-foreground'>Otros productos relacionados</h2>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                  {similarProducts.map((item: any) => (
                    <Link
                      key={item._id?.toString()}
                      href={`/products/${item._id}`}
                      className='group border border-border/70 bg-section-grey p-4 flex flex-col gap-3 hover:bg-background transition-colors'
                    >
                      <div className='h-40 bg-background border border-border/70 overflow-hidden'>
                        <img src={item.image} alt={item.title} className='h-full w-full object-contain p-2' />
                      </div>
                      <p className='text-sm text-muted-foreground'>{item.category || 'Producto'}</p>
                      <p className='text-base font-medium text-foreground line-clamp-2'>{item.title}</p>
                      <p className='text-lg font-semibold text-foreground'>
                        {item.currency} {formatNumber(item.currentPrice)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <PixelPerfectFooter />
    </div>
  );
};

export default ProductDetailsPage;
