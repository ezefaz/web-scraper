'use client';

import { Card } from '@tremor/react';
import Link from 'next/link';

interface CardWrapperProps {
  children: React.ReactNode;
  HeaderLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

const CardWrapper = ({ children, HeaderLabel, backButtonHref, backButtonLabel, showSocial }: CardWrapperProps) => {
  return (
    <Card className='w-[400px] shadow-md p-6 rounded-lg'>
      <div className='mb-4'>
        <h2 className='text-xl font-bold dark:text-black'>{HeaderLabel}</h2>
      </div>
      {children}
      <div className='mt-4 flex justify-between items-center'>
        <Link href={backButtonHref} className='text-sm text-primary hover:underline'>
          {backButtonLabel}
        </Link>
        {showSocial && (
          <div className='flex items-center space-x-3'>{/* Include social icons/buttons here if needed */}</div>
        )}
      </div>
    </Card>
  );
};

export default CardWrapper;
