import React from 'react';

const StepsComponent: React.FC = () => {
  return (
    <div className='flex items-center justify-center h-screen '>
      <div className='w-full max-w-screen-md p-6'>
        <div className='text-center mb-12'>
          <span className='block mb-2 text-lg font-semibold text-primary'>Cómo Funciona</span>
          <h2 className='mb-4 text-3xl font-bold text-dark sm:text-4xl md:text-5xl'>
            Comienza con la plataforma de manera sencilla
          </h2>
        </div>

        <div className='flex flex-col items-center md:flex-row md:justify-between'>
          <div className='flex items-center mb-8 md:mb-0'>
            <div className='h-10 w-10 flex items-center justify-center rounded-full bg-[#D9D9D9] text-white text-lg'>
              1
            </div>
            <div className='ml-4 text-lg font-medium'>Insertar el link del producto</div>
          </div>
          <div className='flex items-center mb-8 md:mb-0'>
            <div className='h-10 w-10 flex items-center justify-center rounded-full bg-[#D9D9D9] text-white text-lg'>
              2
            </div>
            <div className='ml-4 text-lg font-medium'>Seguimiento del Producto</div>
          </div>
          <div className='flex items-center mb-8 md:mb-0'>
            <div className='h-10 w-10 flex items-center justify-center rounded-full bg-[#D9D9D9] text-white text-lg'>
              2
            </div>
            <div className='ml-4 text-lg font-medium'>Comienza a Ahorrar</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepsComponent;
