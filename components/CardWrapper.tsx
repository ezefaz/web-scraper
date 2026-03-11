'use client';

import Link from 'next/link';
import Image from 'next/image';

interface CardWrapperProps {
  children: React.ReactNode;
  HeaderLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
}

const CardWrapper = ({ children, HeaderLabel, backButtonHref, backButtonLabel }: CardWrapperProps) => {
  return (
    <section className='w-full max-w-md rounded-2xl border border-black/10 bg-white/90 p-7 shadow-2xl backdrop-blur-sm dark:border-white/10 dark:bg-black/60 sm:p-8'>
      <div className='mb-6 text-center'>
        <div className='mx-auto mb-4 inline-flex rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm dark:border-white/10 dark:bg-black/50'>
          <Image src='/assets/icons/savemelin3.svg' width={110} height={36} alt='SaveMelin' />
        </div>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>{HeaderLabel}</h2>
      </div>
      {children}
      <div className='mt-6 text-center'>
        <Link href={backButtonHref} className='text-sm font-medium text-primary transition hover:underline'>
          {backButtonLabel}
        </Link>
      </div>
    </section>
  );
};

export default CardWrapper;
