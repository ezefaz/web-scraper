'use client';

import ProductSearchCard from './ProductSearchCard';

export default function ProductResults({ data }: any) {
  const products = Array.isArray(data) ? data : [];

  return (
    <div className='bg-white dark:bg-black'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <h2 className='sr-only'>Products</h2>
        {products.length === 0 ? (
          <div className='rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900/40'>
            <p className='text-sm text-slate-600 dark:text-slate-300'>No encontramos resultados para esta búsqueda.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
            {products.map((product: any, index: number) => (
              <ProductSearchCard key={product?.url || index} product={product} />
            ))}
          </div>
        )}
        </div>
      </div>
  );
}
