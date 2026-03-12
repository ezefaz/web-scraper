'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  Package,
  RotateCcw,
  ShoppingBag,
  Store,
  Truck,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { scrapeMLProductDetail } from '@/lib/scraper/mercadolibre-product-detail';
import ScraperButton from './ScraperButton';
import { createProduct } from '@/app/actions/create-product';
import { Button } from '@/components/pixel-perfect-page-main/button';

const mercadolibreDomains = [
  'mercadolibre.com',
  'mercadolibre.com.ar',
  'www.mercadolivre.com.br',
  'www.mercadolibre.cl',
  'www.mercadolibre.com.co',
  'www.mercadolibre.com.uy',
];

const isValidMLProductUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    return mercadolibreDomains.some((domain: string) => hostname.includes(domain));
  } catch {
    return false;
  }
};

const LocalProduct = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productURL = searchParams.get('productUrl') ?? '';
  const decodedProductURL = useMemo(() => {
    try {
      return decodeURIComponent(productURL).trim();
    } catch {
      return productURL.trim();
    }
  }, [productURL]);

  const [productData, setProductData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const url = decodedProductURL?.trim();
      if (!url || !isValidMLProductUrl(url)) {
        setProductData(null);
        setErrorMessage('Ingresá una URL válida de Mercado Libre para ver el detalle del producto.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage('');
      try {
        const data: any = await scrapeMLProductDetail(url);
        setProductData(data);
      } catch (error) {
        console.error('Error scraping product:', error);
        setErrorMessage('No pudimos obtener el detalle del producto en este momento.');
        setProductData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [decodedProductURL]);

  const handleSubmit = useCallback(
    async (productUrl: string) => {
      await createProduct(productUrl);
      router.push('/user-products');
    },
    [router]
  );

  const statCards = useMemo(() => {
    if (!productData) return [];
    const currency = productData.currency || '$';
    return [
      {
        label: 'Precio actual',
        value: `${currency} ${formatNumber(productData.currentPrice)}`,
      },
      {
        label: 'Precio promedio',
        value: `${currency} ${formatNumber(productData.averagePrice)}`,
      },
      {
        label: 'Precio más alto',
        value: `${currency} ${formatNumber(productData.highestPrice)}`,
      },
      {
        label: 'Precio más bajo',
        value: `${currency} ${formatNumber(productData.lowestPrice)}`,
      },
    ];
  }, [productData]);

  const hasDiscount = Boolean(
    productData &&
      Number(productData.currentPrice || 0) > 0 &&
      Number(productData.originalPrice || 0) > 0 &&
      Number(productData.currentPrice) < Number(productData.originalPrice),
  );

  return (
    <div className='py-12 lg:py-14'>
      {isLoading ? (
        <div className='border border-border/70 bg-section-grey p-8 lg:p-10'>
          <div className='flex items-center justify-center gap-3 text-muted-foreground'>
            <Loader2 className='h-5 w-5 animate-spin text-primary' />
            <p className='text-base'>Cargando detalle del producto...</p>
          </div>
        </div>
      ) : !productData ? (
        <div className='border border-border/70 bg-section-grey p-8 lg:p-10'>
          <p className='text-base text-muted-foreground'>{errorMessage}</p>
        </div>
      ) : (
        <>
          <div className='border border-border/70 bg-section-grey p-6 md:p-8 lg:p-10'>
            <div className='grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-8 lg:gap-10'>
              <div className='border border-border/70 bg-background p-4'>
                <div className='aspect-square w-full overflow-hidden bg-white'>
                  <img
                    src={productData.image}
                    alt={productData.title}
                    className='h-full w-full object-contain'
                  />
                </div>
              </div>

              <div className='min-w-0'>
                <div className='flex flex-wrap items-center gap-2 mb-3'>
                  <span className='inline-flex items-center gap-1 border border-border/70 px-2.5 py-1 text-xs text-muted-foreground bg-background'>
                    <Store className='h-3.5 w-3.5 text-primary' />
                    {extractSellerName(productData.storeName || 'Tienda oficial')}
                  </span>
                  {productData.isFreeShipping && (
                    <span className='inline-flex items-center gap-1 border border-border/70 px-2.5 py-1 text-xs text-muted-foreground bg-background'>
                      <Truck className='h-3.5 w-3.5 text-primary' />
                      Envío gratis
                    </span>
                  )}
                  {productData.isFreeReturning && (
                    <span className='inline-flex items-center gap-1 border border-border/70 px-2.5 py-1 text-xs text-muted-foreground bg-background'>
                      <RotateCcw className='h-3.5 w-3.5 text-primary' />
                      Devolución gratis
                    </span>
                  )}
                  {productData.status && (
                    <span className='inline-flex items-center gap-1 border border-border/70 px-2.5 py-1 text-xs text-muted-foreground bg-background'>
                      <CheckCircle2 className='h-3.5 w-3.5 text-primary' />
                      {productData.status}
                    </span>
                  )}
                </div>

                <h1 className='text-2xl md:text-3xl font-semibold leading-tight text-foreground max-w-4xl'>
                  {productData.title}
                </h1>

                <div className='mt-5 flex flex-wrap items-end gap-x-4 gap-y-2'>
                  <p className='text-3xl md:text-4xl font-semibold text-foreground'>
                    {productData.currency} {formatNumber(productData.currentPrice)}
                  </p>
                  {hasDiscount && (
                    <p className='text-lg text-muted-foreground line-through'>
                      {productData.currency} {formatNumber(productData.originalPrice)}
                    </p>
                  )}
                </div>

                <p className='mt-4 text-sm md:text-base text-muted-foreground max-w-3xl'>
                  {productData.refurbishedMessage ||
                    'Revisá el historial de precios y compará opciones antes de comprar.'}
                </p>

                <div className='mt-8 flex flex-wrap gap-3'>
                  <Button
                    variant='primary'
                    onClick={() => window.open(productData.url, '_blank')}
                  >
                    Comprar ahora
                    <ExternalLink className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='secondary'
                    onClick={() => handleSubmit(productData.url)}
                  >
                    Agregar a seguimiento
                    <ShoppingBag className='h-4 w-4' />
                  </Button>
                </div>

                <Link
                  href={decodedProductURL}
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
              <h2 className='text-lg md:text-xl font-medium text-foreground'>
                Resumen de precios
              </h2>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>
              {statCards.map((card) => (
                <div key={card.label} className='border border-border/70 bg-section-grey p-4'>
                  <p className='text-xs uppercase tracking-wide text-muted-foreground'>
                    {card.label}
                  </p>
                  <p className='mt-2 text-lg font-semibold text-foreground'>{card.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='mt-8 border border-border/70 bg-background p-6 md:p-8'>
            <div className='mb-6'>
              <p className='text-sm text-primary font-medium'>Comparación inteligente</p>
              <h2 className='mt-1 text-2xl md:text-3xl font-semibold text-foreground'>
                Alternativas más baratas para este producto
              </h2>
              <p className='mt-2 text-sm md:text-base text-muted-foreground'>
                SaveMelin busca opciones en múltiples sitios y destaca oportunidades de ahorro reales.
              </p>
            </div>
            <ScraperButton
              productTitle={productData.title}
              productPrice={Number(productData.currentPrice) || 0}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LocalProduct;

function extractSellerName(fullSellerInfo: string) {
  const startIdx = fullSellerInfo.indexOf('(');
  const endIdx = fullSellerInfo.indexOf(')');

  if (startIdx !== -1 && endIdx !== -1) {
    return fullSellerInfo.substring(startIdx + 1, endIdx);
  } else {
    return fullSellerInfo;
  }
}
