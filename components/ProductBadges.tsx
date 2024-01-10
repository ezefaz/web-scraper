'use client';

import { Badge } from '@tremor/react';
import Image from 'next/image';

import { IoIosStarOutline } from 'react-icons/io';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { IoChatboxEllipsesOutline, IoCartOutline } from 'react-icons/io5';
import { PiKeyReturn } from 'react-icons/pi';

import { MdOutlineProductionQuantityLimits } from 'react-icons/md';

interface ProductBadgesProps {
  stars: string | number;
  reviewsCount: string | number;
  stockAvailable: string | undefined;
  isFreeShipping?: boolean | undefined;
  isFreeReturning?: boolean | undefined;
  status: string;
}

const ProductBadges = ({
  stars,
  reviewsCount,
  stockAvailable,
  isFreeReturning,
  isFreeShipping,
  status,
}: ProductBadgesProps) => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-3 md:flex-row md:gap-4'>
        <Badge icon={IoCartOutline} color={status.toLowerCase() == 'nuevo' ? 'green' : 'orange'}>
          {status}
        </Badge>
        <Badge icon={IoIosStarOutline} color='amber'>
          {stars || '4.5'}
        </Badge>
        <Badge icon={IoChatboxEllipsesOutline} color='stone'>
          {reviewsCount} Reseñas
        </Badge>
        <Badge
          icon={MdOutlineProductionQuantityLimits}
          color={stockAvailable && stockAvailable.length > 0 ? 'green' : 'red'}
        >
          {stockAvailable == '1' ? `${stockAvailable} disponible` : stockAvailable}
        </Badge>
        <Badge icon={LiaShippingFastSolid} color={isFreeShipping ? 'green' : 'red'}>
          {isFreeShipping ? 'Envio Gratis' : 'Envio con Cargo'}
        </Badge>
        <Badge icon={PiKeyReturn} color={isFreeReturning ? 'green' : 'red'}>
          {isFreeReturning ? 'Devolución Gratis' : 'Devolución con Cargo'}
        </Badge>
      </div>
      <p className='text-sm text-black opacity-50'>
        <span className='text-primary-green font-semibold'>
          {stars ? ((Number(stars) / 5) * 100).toFixed(2) : '95.00'}%
        </span>{' '}
        de los compradores recomiendan esto.
      </p>
    </div>
  );
};

export default ProductBadges;
