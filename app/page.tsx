import HeroCarousel from '@/components/HeroCarousel';
import Searchbar from '@/components/Searchbar';
import Image from 'next/image';

import { getAllProducts } from '@/lib/actions';
import ProductCard from '@/components/ProductCard';

const Home = async () => {
  const allProducts = await getAllProducts();

  return (
    <>
      <section
        className='px-6 md:px-20 py-24'
        style={{
          backgroundImage: "url('/assets/images/hero2.png')",
          backgroundSize: 'cover',
          height: '80vh',
          backgroundPosition: 'center',
          opacity: '70%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Adjust the alpha value (0.8) as needed
        }}
      >
        <div className='flex max-xl:flex-col gap-16'>
          <div className='m-auto'>
            <div className='small-text'>
              Empieza a ahorrar de manera gratuita y eficaz:
              <Image src='/assets/icons/arrow-right.svg' alt='arrow-right' width={16} height={16} />
            </div>
            <h1 className='head-text flex justify-center'>Descubre el potencial de</h1>
            {''}
            <div className='head-text'>
              <div className=''>
                <span className=''>Save</span>
                <span className='text-primary'>Melin</span>
              </div>
            </div>
            <p className='mt-6 text-gray-900'>
              A través de análisis y seguimiento de tus productos favoritos, te vamos a ayudar a ahorrar dinero a largo
              plazo.
            </p>
            <Searchbar />
          </div>
          {/* <HeroCarousel /> */}
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
