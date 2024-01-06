'use client';

import { Badge } from '@tremor/react';
import Image from 'next/image';

import { IoIosStarOutline } from 'react-icons/io';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';

interface ProductBadgesProps {
  stars: string;
  reviewsCount: string;
  stockAvailable: string;
}

const ProductBadges = ({ stars, reviewsCount, stockAvailable }: ProductBadgesProps) => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex gap-3'>
        <Badge icon={IoIosStarOutline} color='amber'>
          {stars || '4.5'}
        </Badge>
        <Badge icon={IoChatboxEllipsesOutline} color='stone'>
          {reviewsCount} Reseñas
        </Badge>
        <Badge icon={MdOutlineProductionQuantityLimits} color='green'>
          {stockAvailable == '1' ? `${stockAvailable} disponible` : stockAvailable}
        </Badge>
      </div>
      <p className='text-sm text-black opacity-50'>
        <span className='text-primary-green font-semibold'>{stars ? (Number(stars) / 5) * 100 : '95'}%</span> de los
        compradores recomiendan esto.
      </p>
    </div>
  );
};

export default ProductBadges;
