import LocalProduct from '@/components/LocalProduct';
import Searchbar from '@/components/Searchbar';
import PixelPerfectFooter from '@/components/pixel-perfect-page-main/Footer';
import PixelPerfectNavbar from '@/components/pixel-perfect-page-main/Navbar';

type Props = {
  searchParams?: {
    productUrl?: string;
  };
};

const LocalProductsPage = ({ searchParams }: Props) => {
  const rawProductUrl = searchParams?.productUrl ?? '';
  const initialSearch = (() => {
    try {
      return decodeURIComponent(rawProductUrl).trim();
    } catch {
      return rawProductUrl.trim();
    }
  })();

  return (
    <div className='pixel-perfect-home relative min-h-screen bg-background text-foreground'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-y-0 z-[60] border-l border-border/50'
        style={{ left: 'max(calc((100vw - 94rem) / 2 + 2.5rem), 2.5rem)' }}
      />
      <div
        aria-hidden
        className='pointer-events-none absolute inset-y-0 z-[60] border-r border-border/50'
        style={{ right: 'max(calc((100vw - 94rem) / 2 + 2.5rem), 2.5rem)' }}
      />

      <PixelPerfectNavbar />

      <section className='border-y border-border/70'>
        <div className='max-w-[94rem] mx-auto padding-global border-x border-border/70 py-6 lg:py-7'>
          <div className='grid grid-cols-1 px-12 gap-6 items-end'>
            <Searchbar initialValue={initialSearch} />
          </div>
        </div>
      </section>

      <section>
        <div className='max-w-[94rem] mx-auto padding-global border-x border-border/70'>
          <LocalProduct />
        </div>
      </section>

      <PixelPerfectFooter />
    </div>
  );
};

export default LocalProductsPage;
