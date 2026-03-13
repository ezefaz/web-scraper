'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  Package,
  RotateCcw,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { formatNumber, formatUSD } from '@/lib/utils';
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

const formatSellerDisplayName = (value?: string) => {
  const normalized = (value || '')
    .replace(/\s+/g, ' ')
    .replace(/^vendido\s*por\s*/i, '')
    .replace(/\|.*$/, '')
    .trim();

  if (!normalized) return 'Marketplace';

  return normalized
    .replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, '$1 $2')
    .replace(/([A-ZÁÉÍÓÚÑ]{2,})([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)/g, '$1 $2')
    .trim();
};

const LocalProduct = () => {
  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();
  const productURL = searchParams.get('productUrl') ?? '';
  const autoSave = searchParams.get('autoSave') === '1';
  const decodedProductURL = useMemo(() => {
    try {
      return decodeURIComponent(productURL).trim();
    } catch {
      return productURL.trim();
    }
  }, [productURL]);

  const [productData, setProductData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveAttempted, setAutoSaveAttempted] = useState(false);
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

  useEffect(() => {
    setAutoSaveAttempted(false);
  }, [decodedProductURL, autoSave]);

  const handleSubmit = useCallback(
    async (productUrl: string) => {
      const normalizedUrl = productUrl?.trim();
      if (!normalizedUrl) return;

      const callbackUrl = `/products/local?productUrl=${encodeURIComponent(
        normalizedUrl,
      )}&autoSave=1`;

      if (status !== 'authenticated') {
        router.push(`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}&saveProductUrl=${encodeURIComponent(normalizedUrl)}`);
        return;
      }

      setIsSaving(true);
      setErrorMessage('');
      try {
        const result: any = await createProduct(normalizedUrl);

        if (result?.requiresAuth) {
          router.push(`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}&saveProductUrl=${encodeURIComponent(normalizedUrl)}`);
          return;
        }

        if (result?.success || result?.alreadySaved) {
          router.push('/dashboard');
          return;
        }

        setErrorMessage(
          result?.error ?? 'No pudimos guardar el producto en este momento.',
        );
      } catch (error) {
        console.error('[SAVE_PRODUCT_FROM_LOCAL_PAGE]', error);
        setErrorMessage('No pudimos guardar el producto en este momento.');
      } finally {
        setIsSaving(false);
      }
    },
    [router, status],
  );

  useEffect(() => {
    if (!autoSave || autoSaveAttempted || status !== 'authenticated' || !productData?.url || isSaving) return;

    setAutoSaveAttempted(true);
    handleSubmit(productData.url);
  }, [autoSave, autoSaveAttempted, handleSubmit, isSaving, productData?.url, status]);

  const statCards = useMemo(() => {
    if (!productData) return [];
    const currency = productData.currency || '$';
    const rawDolarValue = Number(productData.currentDolar?.value || 0);
    const dolarValue =
      rawDolarValue > 0 && rawDolarValue < 20
        ? rawDolarValue * 1000
        : rawDolarValue;
    const usdPrice =
      Number(productData.currentPrice || 0) > 0 && dolarValue > 0
        ? Number(productData.currentPrice) / dolarValue
        : null;
    const dolarDate = productData.currentDolar?.date
      ? new Date(productData.currentDolar.date)
      : null;
    const dolarDateLabel =
      dolarDate && !Number.isNaN(dolarDate.getTime())
        ? dolarDate.toLocaleDateString('es-AR')
        : null;

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
      {
        label: 'Valor en USD',
        value: usdPrice ? formatUSD(usdPrice) : 'N/A',
        helperText:
          dolarValue > 0
            ? `Cotización tomada: $${formatNumber(dolarValue)}${dolarDateLabel ? ` (${dolarDateLabel})` : ''}`
            : 'Cotización no disponible',
      },
    ];
  }, [productData]);

  const hasDiscount = Boolean(
    productData &&
      Number(productData.currentPrice || 0) > 0 &&
      Number(productData.originalPrice || 0) > 0 &&
      Number(productData.currentPrice) < Number(productData.originalPrice),
  );
  const sellerDisplayName = formatSellerDisplayName(
    productData?.sellerName || productData?.storeName,
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
                  <span
                    className={`inline-flex items-center gap-1 border px-2.5 py-1 text-xs ${
                      productData.isFreeShipping
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-red-200 bg-red-50 text-red-700'
                    }`}
                  >
                    <Truck
                      className={`h-3.5 w-3.5 ${
                        productData.isFreeShipping ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    />
                    {productData.isFreeShipping ? 'Envío gratis' : 'Envío con cargo'}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 border px-2.5 py-1 text-xs ${
                      productData.isFreeReturning
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-red-200 bg-red-50 text-red-700'
                    }`}
                  >
                    <RotateCcw
                      className={`h-3.5 w-3.5 ${
                        productData.isFreeReturning ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    />
                    {productData.isFreeReturning
                      ? 'Devolución gratis'
                      : 'Devolución con cargo'}
                  </span>
                  {productData.status && (
                    <span className='inline-flex items-center gap-1 border border-border/70 px-2.5 py-1 text-xs text-muted-foreground bg-background'>
                      <CheckCircle2 className='h-3.5 w-3.5 text-primary' />
                      {productData.status}
                    </span>
                  )}
                  {productData.sellerIsOfficialStore && (
                    <span className='inline-flex items-center gap-1 border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700'>
                      <CheckCircle2 className='h-3.5 w-3.5 text-emerald-600' />
                      Tienda oficial
                    </span>
                  )}
                </div>

                <div className='mb-4 border border-border/70 bg-background p-3 text-xs text-muted-foreground'>
                  <div className='flex flex-wrap items-center gap-x-4 gap-y-2 mb-2'>
                    <p>
                      Vendedor:{' '}
                      {productData.sellerProfileUrl ? (
                        <Link
                          href={productData.sellerProfileUrl}
                          target='_blank'
                          className='font-medium text-foreground hover:text-primary transition-colors'
                        >
                          {sellerDisplayName}
                        </Link>
                      ) : (
                        <span className='font-medium text-foreground'>
                          {sellerDisplayName}
                        </span>
                      )}
                    </p>
                    {productData.sellerReputation ? (
                      <p>
                        Reputación:{' '}
                        <span className='font-medium text-foreground'>
                          {productData.sellerReputation}
                        </span>
                      </p>
                    ) : null}
                    {productData.sellerSales ? (
                      <p>
                        Ventas:{' '}
                        <span className='font-medium text-foreground'>
                          {productData.sellerSales}
                        </span>
                      </p>
                    ) : null}
                    {productData.sellerWarranty ? (
                      <p>
                        Garantía:{' '}
                        <span className='font-medium text-foreground'>
                          {productData.sellerWarranty}
                        </span>
                      </p>
                    ) : null}
                  </div>
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
                    disabled={isSaving || status === 'loading'}
                    onClick={() => handleSubmit(productData.url)}
                  >
                    {isSaving
                      ? 'Guardando...'
                      : status === 'authenticated'
                        ? 'Guardar producto'
                        : 'Crear cuenta y guardar'}
                    <ShoppingBag className='h-4 w-4' />
                  </Button>
                </div>
                {status !== 'authenticated' && (
                  <p className='mt-3 text-xs text-muted-foreground'>
                    Para guardar este producto en tu lista, crea tu cuenta o inicia sesión.
                  </p>
                )}

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
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4'>
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className={`border p-4 ${
                    card.label === 'Precio promedio'
                      ? 'border-orange-200 bg-orange-50'
                      : card.label === 'Precio más alto'
                        ? 'border-red-200 bg-red-50'
                        : card.label === 'Precio más bajo'
                          ? 'border-emerald-200 bg-emerald-50'
                          : 'border-border/70 bg-section-grey'
                  }`}
                >
                  <p
                    className={`text-xs uppercase tracking-wide ${
                      card.label === 'Precio promedio'
                        ? 'text-[#c46a1b]'
                        : card.label === 'Precio más alto'
                          ? 'text-[#dc2626]'
                          : card.label === 'Precio más bajo'
                            ? 'text-[#16a34a]'
                            : 'text-muted-foreground'
                    }`}
                  >
                    {card.label}
                  </p>
                  <p
                    className={`mt-2 text-lg font-semibold ${
                      card.label === 'Precio promedio'
                        ? 'text-[#c46a1b]'
                        : card.label === 'Precio más alto'
                          ? 'text-[#dc2626]'
                          : card.label === 'Precio más bajo'
                            ? 'text-[#16a34a]'
                            : 'text-foreground'
                    }`}
                  >
                    {card.value}
                  </p>
                  {'helperText' in card && card.helperText ? (
                    <p className='mt-1 text-xs text-muted-foreground'>{card.helperText}</p>
                  ) : null}
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
