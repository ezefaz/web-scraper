import React from 'react';

const Stats = () => {
  return (
    <div className='bg-gray-50 py-16 pt-32 dark:bg-black'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white'>
            La única plataforma que entiende tus necesidades
          </h2>
          <p className='mt-3 text-l text-gray-500 sm:mt-4'>
            Entendemos lo importante que es cuidar el bolsillo de uno, por eso creamos esta plataforma centrada en tu
            necesidad para obtener las cosas que te gustan, a un mejor precio.
          </p>
        </div>
      </div>
      <div className='mt-10 pb-1'>
        <div className='relative'>
          <div className='absolute inset-0 h-1/2 bg-gray-50 dark:bg-black'></div>
          <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='max-w-4xl mx-auto'>
              <dl className='rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3'>
                <div className='flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r'>
                  <dt className='order-2 mt-2 text-lg leading-6 font-medium text-gray-500'>Usuarios</dt>
                  <dd className='order-1 text-5xl font-extrabold text-gray-700'>500+</dd>
                </div>
                <div className='flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r'>
                  <dt className='order-2 mt-2 text-lg leading-6 font-medium text-gray-500'>Productos</dt>
                  <dd className='order-1 text-5xl font-extrabold text-gray-700'>1500+</dd>
                </div>
                <div className='flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l'>
                  <dt className='order-2 mt-2 text-lg leading-6 font-medium text-gray-500'>Porcentaje de Ahorro</dt>
                  <dd className='order-1 text-5xl font-extrabold text-gray-700'>95%</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
