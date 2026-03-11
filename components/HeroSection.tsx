import React from 'react';
import Searchbar from './Searchbar';
import Link from 'next/link';

type Props = {};

const HeroSection = (props: Props) => {
  return (
    <section id='inicio' className='relative min-h-[92vh] overflow-hidden pt-28 pb-16'>
      <div
        className='absolute inset-0 bg-cover bg-center scale-105'
        style={{ backgroundImage: "url('/assets/images/hero2.png')" }}
      />
      <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70' />
      <div className='absolute inset-0 shadow-[inset_0_140px_180px_rgba(0,0,0,0.55),inset_0_-140px_180px_rgba(0,0,0,0.7)]' />

      <div className='relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl text-center text-white'>
          <span className='inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold tracking-[0.14em] uppercase'>
            Ahorro inteligente
          </span>

          <h1 className='mt-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl'>
            Compara precios y compra en el mejor momento
          </h1>

          <p className='mx-auto mt-5 max-w-2xl text-base text-white/85 sm:text-lg'>
            SaveMelin te ayuda a seguir productos, analizar su evolución y detectar oportunidades reales de ahorro.
          </p>

          <div className='mt-8 flex flex-wrap justify-center gap-3'>
            <Link
              href='/#servicios'
              className='rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-white/90'
            >
              Ver servicios
            </Link>
            <Link
              href='/#como-funciona'
              className='rounded-full border border-white/50 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10'
            >
              Cómo funciona
            </Link>
          </div>
        </div>

        <div className='mx-auto mt-10 max-w-3xl rounded-2xl border border-white/25 bg-white/10 p-3 shadow-2xl backdrop-blur-md'>
          <div className='rounded-xl bg-white/95 p-2'>
            <Searchbar />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
