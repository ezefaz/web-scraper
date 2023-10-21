import Image from 'next/image';
import React from 'react';

import { Card, Text } from '@tremor/react';

interface Props {
  title: string;
  iconSrc: string;
  value: string;
  borderColor: any;
}

const PriceInfoCard = ({ title, iconSrc, value, borderColor }: Props) => {
  return (
    <>
      <Card className='max-w-xs mx-2 m-auto' decoration='top' decorationColor={borderColor}>
        <Text>{title}</Text>
        <div className='flex gap-1'>
          <Image src={iconSrc} alt={title} width={24} height={24} />
          <p className='text-2xl ml-1 font-bold text-secondary'>{value}</p>{' '}
        </div>
      </Card>
    </>
  );
};

export default PriceInfoCard;
