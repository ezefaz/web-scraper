import Image from 'next/image';
import React from 'react';

const StepsComponent: React.FC = () => {
  return (
    <section>
      <div className='max-w-screen-xl px-4 py-8 mx-auto space-y-12 lg:space-y-20 lg:py-24 lg:px-6'>
        <div className='items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16'>
          <div className='text-gray-500 sm:text-lg dark:text-gray-400'>
            <h2 className='mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-black'>
              Junta tus productos en una misma plataforma y ahorra masivamente
            </h2>
            <p className='mb-8 font-light lg:text-xl'>
              Te enviaremos toda la información y análisis previo a la compra, para que puedas tomar una decision
              inteligente y cuidando tu economía.
            </p>
            <ul role='list' className='pt-8 space-y-5 border-t border-gray-200 my-7 dark:border-gray-700'>
              <li className='flex space-x-3'>
                <svg
                  className='flex-shrink-0 w-5 h-5 text-purple-500 dark:text-purple-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fill-rule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clip-rule='evenodd'
                  ></path>
                </svg>
                <span className='text-base font-medium leading-tight  font-light'>Insertar el link del producto</span>
              </li>
              <li className='flex space-x-3'>
                <svg
                  className='flex-shrink-0 w-5 h-5 text-purple-500 dark:text-purple-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fill-rule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clip-rule='evenodd'
                  ></path>
                </svg>
                <span className='text-base font-medium leading-tight'>Seguimiento de Producto</span>
              </li>
              <li className='flex space-x-3'>
                <svg
                  className='flex-shrink-0 w-5 h-5 text-purple-500 dark:text-purple-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fill-rule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clip-rule='evenodd'
                  ></path>
                </svg>
                <span className='text-base font-medium leading-tight'>Comenzar a ahorrar</span>
              </li>
            </ul>
          </div>
          <Image
            // className='hidden w-full mb-4 rounded-lg lg:mb-0 lg:flex'
            width={600}
            height={600}
            src='/assets/images/feature-1.png'
            alt='dashboard feature image'
          />
        </div>
        <div className='items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16'>
          <Image
            // className='hidden w-full mb-4 rounded-lg lg:mb-0 lg:flex'
            width={600}
            height={600}
            src='/assets/images/feature-2.png'
            alt='feature image 2'
          />
          <div className='text-gray-500 sm:text-lg dark:text-gray-400'>
            <h2 className='mb-4 text-3xl font-extrabold tracking-tight text-black'>
              La prioridad es cuidar tu bolsillo
            </h2>
            <p className='mb-8 font-light lg:text-xl'>
              Sabemos la importancia y el impacto que puede generar el ahorro a largo plazo, por eso juntamos una serie
              de servicios para maximizarlo.
            </p>
            <ul role='list' className='pt-8 space-y-5 border-t border-gray-200 my-7 dark:border-gray-700'>
              <li className='flex space-x-3'>
                <svg
                  className='flex-shrink-0 w-5 h-5 text-purple-500 dark:text-purple-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fill-rule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clip-rule='evenodd'
                  ></path>
                </svg>
                <span className='text-base font-medium leading-tight'>Reportes y Graficos Dinámicos</span>
              </li>
              <li className='flex space-x-3'>
                <svg
                  className='flex-shrink-0 w-5 h-5 text-purple-500 dark:text-purple-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fill-rule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clip-rule='evenodd'
                  ></path>
                </svg>
                <span className='text-base font-medium leading-tight'>Precios menores, mayores, promedio y en USD</span>
              </li>
              <li className='flex space-x-3'>
                <svg
                  className='flex-shrink-0 w-5 h-5 text-purple-500 dark:text-purple-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fill-rule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clip-rule='evenodd'
                  ></path>
                </svg>
                <span className='text-base font-medium leading-tight'>Actualización a tu correo electrónico</span>
              </li>
              <li className='flex space-x-3'>
                <svg
                  className='flex-shrink-0 w-5 h-5 text-purple-500 dark:text-purple-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fill-rule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clip-rule='evenodd'
                  ></path>
                </svg>
                <span className='text-base font-medium leading-tight'>Comparación de Precios entre Productos</span>
              </li>
              <li className='flex space-x-3'>
                <svg
                  className='flex-shrink-0 w-5 h-5 text-purple-500 dark:text-purple-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fill-rule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clip-rule='evenodd'
                  ></path>
                </svg>
                <span className='text-base font-medium leading-tight'>Colección de productos y ahorro masivo</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepsComponent;
