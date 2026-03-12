'use client';

import Link from 'next/link';

interface CardWrapperProps {
  children: React.ReactNode;
  HeaderLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
}

const CardWrapper = ({ children, HeaderLabel, backButtonHref, backButtonLabel }: CardWrapperProps) => {
  return (
    <section className='w-full max-w-[28rem] border border-border/70 bg-background p-5 sm:p-6'>
      <div className='mb-5'>
        <p className='text-xs uppercase tracking-[0.14em] text-muted-foreground'>SaveMelin</p>
        <h2 className='mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-foreground'>{HeaderLabel}</h2>
      </div>
      {children}
      <div className='mt-5 pt-3 border-t border-border/70 text-center'>
        <Link href={backButtonHref} className='text-sm font-medium text-muted-foreground transition hover:text-foreground'>
          {backButtonLabel}
        </Link>
      </div>
    </section>
  );
};

export default CardWrapper;
