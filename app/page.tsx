import HeroCarousel from '@/components/HeroCarousel';
import Searchbar from '@/components/Searchbar';
import Image from 'next/image';

import { getAllProducts } from '@/lib/actions';
import ProductCard from '@/components/ProductCard';

const Home = async () => {
  const allProducts = await getAllProducts();

  return (
    <>
      <section className='px-6 md:px-20 py-24'>
        <div className='flex max-xl:flex-col gap-16'>
          <div className='flex flex-col'>
            <div className='small-text'>
              Tus compras inteligentes comienzan aquí:
              <Image src='/assets/icons/arrow-right.svg' alt='arrow-right' width={16} height={16} />
            </div>
            <h1 className='head-text'>Descubre el potencial de</h1>
            {''}
            <div className='head-text'>
              <span>Save</span>
              <span className='text-primary'>Melin</span>
            </div>
            <p className='mt-6'>
              A través de análisis y seguimiento de tus productos favoritos, te vamos a ayudar a ahorrar dinero a largo
              plazo.
            </p>
            <Searchbar />
          </div>
          <HeroCarousel />
        </div>
      </section>
      <section className='trending-section'>
        <h2 className='section-text'>Trending</h2>
        <div className='flex flex-wrap gap-x-8 gap-y-16'>
          {allProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
