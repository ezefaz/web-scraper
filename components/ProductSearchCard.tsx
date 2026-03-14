'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatNumber, getDiscountPercentage } from '@/lib/utils';
import { Badge } from '@tremor/react';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { FaHotjar } from 'react-icons/fa';
import { IoBagCheckSharp } from 'react-icons/io5';

interface Props {
  product: any;
}

const ProductSearchCard = ({ product }: Props) => {
  const rawImageSrc = typeof product?.image === 'string' ? product.image.trim() : '';
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = !!rawImageSrc && !imageFailed;
  const currentPrice = Number(product?.currentPrice) || 0;
  const originalPrice = Number(product?.originalPrice) || 0;
  const hasDiscount = originalPrice > 0 && originalPrice > currentPrice;
  const currency = product?.currency || '$';
  const source = product?.source === 'google-shopping' ? 'google-shopping' : 'mercadolibre';
  const sourceLabel = source === 'google-shopping' ? 'Otras tiendas' : 'Mercado Libre';
  const productUrl = String(product?.url || '');
  const isMercadoLibreUrl =
    /mercadolibre\.com|mercadolivre\.com|mercadolibre\.com\.ar|mercadolibre\.com\.co|mercadolibre\.com\.uy|mercadolibre\.cl/i.test(
      productUrl,
    );
  const shouldUseLocalDetail = source === 'mercadolibre' || isMercadoLibreUrl;
  const domain = product?.domain || '';
  const storeName = product?.storeName || '';
  const trustScore = Number(product?.trustScore) || 0;
  const trustLabel = product?.trustLabel || (trustScore >= 75 ? 'Alta' : trustScore >= 50 ? 'Media' : 'Baja');
  const showTrustBadge = source === 'google-shopping' && !isMercadoLibreUrl && trustScore > 0;

  const cardContent = (
    <article className='h-full border border-border/70 bg-section-grey p-4 transition duration-200 hover:border-foreground/30'>
      <div className='mb-3 flex items-center justify-between gap-3'>
        <div className='flex flex-col'>
          <span className='text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground'>
            {sourceLabel}
          </span>
          {storeName ? (
            <span className='text-[11px] text-muted-foreground/80'>{storeName}</span>
          ) : domain ? (
            <span className='text-[11px] text-muted-foreground/80'>{domain}</span>
          ) : null}
        </div>
        {hasDiscount ? (
          <span className='px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground'>
            {getDiscountPercentage(currentPrice, originalPrice)}% OFF
          </span>
        ) : null}
      </div>

      <div className='overflow-hidden border border-border/70 bg-background'>
        <div className='aspect-[4/3] w-full'>
          {hasImage ? (
            <img
              src={rawImageSrc}
              alt={product.title}
              className='h-full w-full object-contain p-4 transition duration-200 group-hover:scale-[1.02]'
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#ffffff_0%,#fafafa_100%)] p-3 text-center'>
              <div>
                <p className='text-[11px] uppercase tracking-[0.12em] text-muted-foreground'>Sin imagen</p>
                <p className='mt-1 text-xs font-medium text-foreground'>
                  {storeName || domain || sourceLabel}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='mt-4 min-h-[3.5rem]'>
        <h2 className='text-sm font-semibold leading-5 text-foreground'>{product.title}</h2>
      </div>

      <div className='mt-3 flex flex-col'>
        {hasDiscount ? (
          <span className='text-xs text-muted-foreground line-through'>
            {currency} {formatNumber(originalPrice)}
          </span>
        ) : null}
        <span className='text-2xl font-bold leading-tight text-foreground'>
          {currency} {formatNumber(currentPrice)}
        </span>
      </div>

      <div className='mt-3 flex flex-wrap gap-2'>
        {showTrustBadge ? (
          <Badge size='xs' color={trustScore >= 75 ? 'emerald' : trustScore >= 50 ? 'amber' : 'rose'}>
            Confiabilidad: {trustLabel} ({trustScore})
          </Badge>
        ) : null}
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
  );

  if (!shouldUseLocalDetail) {
    return (
      <a href={productUrl} target='_blank' rel='noopener noreferrer' className='group block h-full'>
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={`/products/local?productUrl=${encodeURIComponent(productUrl)}`} className='group block h-full'>
      {cardContent}
    </Link>
  );
};

export default ProductSearchCard;
