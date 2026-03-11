import { getAllProducts, getUserProducts } from '@/lib/actions';
import ProductCard from '@/components/ProductCard';
import Services from '@/components/Services';
import StepsComponent from '@/components/Steps';
import { ProductType } from '@/types';
import { StartSteps } from '@/components/StartSteps';
import Stats from '@/components/Stats';
import HeroSection from '@/components/HeroSection';

const Home = async () => {
  const allProducts = await getAllProducts();
  const userProducts = await getUserProducts();

  return (
    <main>
      <HeroSection />
      <section id='como-funciona' className='scroll-mt-24'>
        <StartSteps />
      </section>
      <section id='servicios' className='scroll-mt-24'>
        <Services />
      </section>
      <section id='funcionalidades' className='scroll-mt-24'>
        <StepsComponent />
      </section>
      <section id='impacto' className='scroll-mt-24'>
        <Stats />
      </section>
      <section id='destacados' className='trending-section scroll-mt-24'>
        <h2 className='section-text dark:text-white'>
          {userProducts && userProducts.length > 1 ? 'Tus Productos' : 'Destacados 🔥'}
        </h2>
        <div className='flex flex-wrap gap-x-8 gap-y-16'>
          {userProducts && userProducts.length > 1
            ? userProducts &&
              userProducts.map((product: ProductType) => <ProductCard key={product._id} product={product} />)
            : allProducts &&
              allProducts.map((product: ProductType) => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>
    </main>
  );
};

export default Home;
