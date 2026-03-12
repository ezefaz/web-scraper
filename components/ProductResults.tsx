'use client';

import ProductSearchCard from './ProductSearchCard';

export default function ProductResults({ data }: any) {
  const products = Array.isArray(data) ? data : [];

  return (
    <div className='bg-background'>
      <div className='py-1'>
        <h2 className='sr-only'>Products</h2>
        {products.length === 0 ? (
          <div className='border border-dashed border-border bg-section-grey p-10 text-center'>
            <p className='text-sm text-muted-foreground'>No encontramos resultados para esta búsqueda.</p>
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
