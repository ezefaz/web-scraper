'use client';
/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react';
import { PiMinusCircleBold, PiPlusCircleBold } from 'react-icons/pi';
import { IoArrowDownCircleOutline } from 'react-icons/io5';
import { BsFunnelFill } from 'react-icons/bs';
import ProductResults from './ProductResults';
import { useSearchParams } from 'next/navigation';
import { scrapeProductSearchPageML } from '@/lib/scraper/product-search-page-ml';
import { scrapeGoogleShoppingSearchProducts } from '@/lib/scraper/google-shopping';
import { SyncLoader } from 'react-spinners';
// import { XMarkIcon } from '@heroicons/react/24/outline';
// import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid';

const sortOptions = [
  { name: 'Precio: Menor a Mayor', key: 'price_asc' },
  { name: 'Precio: Mayor a Menor', key: 'price_desc' },
];

const subCategories = [
  { name: 'Envío Gratis', href: '#' },
  // { name: 'Tiendas Oficiales', href: '#' },
  // { name: 'Solo con descuento', href: '#' },
];

const filters = [
  {
    id: 'condition',
    name: 'Condición',
    options: [
      { value: 'Nuevo', label: 'Nuevo', checked: false },
      { value: 'Reacondicionado', label: 'Reacondicionado', checked: false },
      { value: 'Usado', label: 'Usado', checked: false },
    ],
  },
  // {
  //   id: 'category',
  //   name: 'Category',
  //   options: [
  //     { value: 'new-arrivals', label: 'New Arrivals', checked: false },
  //     { value: 'sale', label: 'Sale', checked: false },
  //     { value: 'travel', label: 'Travel', checked: true },
  //     { value: 'organization', label: 'Organization', checked: false },
  //     { value: 'accessories', label: 'Accessories', checked: false },
  //   ],
  // },
  // {
  //   id: 'size',
  //   name: 'Size',
  //   options: [
  //     { value: '2l', label: '2L', checked: false },
  //     { value: '6l', label: '6L', checked: false },
  //     { value: '12l', label: '12L', checked: false },
  //     { value: '18l', label: '18L', checked: false },
  //     { value: '20l', label: '20L', checked: false },
  //     { value: '40l', label: '40L', checked: true },
  //   ],
  // },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function ResultsCategory() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'price_asc' | 'price_desc'>('price_asc');
  const [activeSource, setActiveSource] = useState<'mercadolibre' | 'google-shopping'>('mercadolibre');

  const searchParams = useSearchParams();

  const product = searchParams.get('search');

  const formattedProduct = product?.replace(/-/g, ' ');

  const isMercadoLibreUrl = (url: string) =>
    /mercadolibre\.com|mercadolivre\.com|mercadolibre\.com\.ar|mercadolibre\.com\.co|mercadolibre\.com\.uy|mercadolibre\.cl/i.test(
      String(url || ''),
    );
  const isLocalDevUrl = (url: string) =>
    /localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|::1/i.test(String(url || ''));

  const [scrapingInProgress, setScrapingInProgress] = useState(false);
  const [mercadolibreData, setMercadolibreData] = useState<any[]>([]);
  const [googleShoppingData, setGoogleShoppingData] = useState<any[]>([]);
  const [freeShipping, setFreeShipping] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!product) {
        setMercadolibreData([]);
        setGoogleShoppingData([]);
        return;
      }

      setScrapingInProgress(true);
      try {
        const [mlResult, googleResult] = await Promise.allSettled([
          scrapeProductSearchPageML(product),
          scrapeGoogleShoppingSearchProducts(product),
        ]);

        const mlItems =
          mlResult.status === 'fulfilled' && Array.isArray(mlResult.value)
            ? mlResult.value.filter((item: any) => item?.source === 'mercadolibre' || isMercadoLibreUrl(item?.url))
            : [];

        const googleItems =
          googleResult.status === 'fulfilled' && Array.isArray(googleResult.value)
            ? googleResult.value.filter(
                (item: any) =>
                  item?.source === 'google-shopping' && !isMercadoLibreUrl(item?.url) && !isLocalDevUrl(item?.url),
              )
            : [];

        setMercadolibreData(mlItems);
        setGoogleShoppingData(googleItems);
      } catch (error) {
        console.error('Error Comparing prices:', error);
      } finally {
        setScrapingInProgress(false);
      }
    };

    fetchData();
  }, [product]);

  const sortAndFilter = (items: any[]) => {
    const filteredData = freeShipping ? items.filter((item: any) => item.freeShipping !== '') : items;
    return [...filteredData].sort((a: any, b: any) => {
      if (sortOrder === 'price_desc') return (b.currentPrice || 0) - (a.currentPrice || 0);
      return (a.currentPrice || 0) - (b.currentPrice || 0);
    });
  };

  const sortedMercadoLibreData = useMemo(
    () => sortAndFilter(mercadolibreData),
    [mercadolibreData, sortOrder, freeShipping],
  );
  const sortedGoogleShoppingData = useMemo(
    () => sortAndFilter(googleShoppingData),
    [googleShoppingData, sortOrder, freeShipping],
  );

  useEffect(() => {
    if (activeSource === 'mercadolibre' && sortedMercadoLibreData.length === 0 && sortedGoogleShoppingData.length > 0) {
      setActiveSource('google-shopping');
      return;
    }
    if (activeSource === 'google-shopping' && sortedGoogleShoppingData.length === 0 && sortedMercadoLibreData.length > 0) {
      setActiveSource('mercadolibre');
    }
  }, [activeSource, sortedMercadoLibreData.length, sortedGoogleShoppingData.length]);

  const activeData = activeSource === 'mercadolibre' ? sortedMercadoLibreData : sortedGoogleShoppingData;

  return (
    <>
      {!scrapingInProgress ? (
        <div className='bg-white dark:bg-black'>
          <div className=''>
            {/* Mobile filter dialog */}
            <Transition.Root show={mobileFiltersOpen} as={Fragment}>
              <Dialog as='div' className='relative z-40 lg:hidden' onClose={setMobileFiltersOpen}>
                <Transition.Child
                  as={Fragment}
                  enter='transition-opacity ease-linear duration-300'
                  enterFrom='opacity-0'
                  enterTo='opacity-100'
                  leave='transition-opacity ease-linear duration-300'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <div className='fixed inset-0 bg-black bg-opacity-25' />
                </Transition.Child>

                <div className='fixed inset-0 z-40 flex'>
                  <Transition.Child
                    as={Fragment}
                    enter='transition ease-in-out duration-300 transform'
                    enterFrom='translate-x-full'
                    enterTo='translate-x-0'
                    leave='transition ease-in-out duration-300 transform'
                    leaveFrom='translate-x-0'
                    leaveTo='translate-x-full'
                  >
                    <Dialog.Panel className='relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl dark:bg-black'>
                      <div className='flex items-center justify-between px-4'>
                        <h2 className='text-lg font-medium text-gray-900'>Filters</h2>
                        <button
                          type='button'
                          className='-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400'
                          onClick={() => setMobileFiltersOpen(false)}
                        >
                          <span className='sr-only'>Close menu</span>
                          {/* <XMarkIcon className='h-6 w-6' aria-hidden='true' /> */}
                        </button>
                      </div>

                      {/* Filters */}
                      <form className='mt-4 border-t border-gray-200'>
                        <h3 className='sr-only'>Categories</h3>
                        <ul role='list' className='px-2 py-3 font-medium text-gray-900'>
                          {subCategories.map((category) => (
                            <li key={category.name}>
                              <a
                                href={category.href}
                                onClick={() => setFreeShipping(!freeShipping)}
                                className='block px-2 py-3'
                              >
                                {category.name}
                              </a>
                            </li>
                          ))}
                        </ul>

                        {filters.map((section) => (
                          <Disclosure as='div' key={section.id} className='border-t border-gray-200 px-4 py-6'>
                            {({ open }) => (
                              <>
                                <h3 className='-mx-2 -my-3 flow-root'>
                                  <Disclosure.Button className='flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500'>
                                    <span className='font-medium text-gray-900'>{section.name}</span>
                                    <span className='ml-6 flex items-center'>
                                      {open ? (
                                        <PiMinusCircleBold className='h-5 w-5' aria-hidden='true' />
                                      ) : (
                                        <PiPlusCircleBold className='h-5 w-5' aria-hidden='true' />
                                      )}
                                    </span>
                                  </Disclosure.Button>
                                </h3>
                                <Disclosure.Panel className='pt-6'>
                                  <div className='space-y-6'>
                                    {section.options.map((option, optionIdx) => (
                                      <div key={option.value} className='flex items-center'>
                                        <input
                                          id={`filter-mobile-${section.id}-${optionIdx}`}
                                          name={`${section.id}[]`}
                                          defaultValue={option.value}
                                          type='checkbox'
                                          defaultChecked={option.checked}
                                          className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                                        />
                                        <label
                                          htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                          className='ml-3 min-w-0 flex-1 text-gray-500'
                                        >
                                          {option.label}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </Disclosure.Panel>
                              </>
                            )}
                          </Disclosure>
                        ))}
                      </form>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition.Root>

            <main className='mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8 dark:bg-black'>
              <div className='flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24 dark:bg-black'>
                <h1 className='text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-200'>
                  Resultados para: {formattedProduct}
                </h1>

                <div className='flex items-center'>
                  <Menu as='div' className='relative inline-block text-left'>
                    <div>
                      <Menu.Button className='group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-200'>
                        {sortOrder === 'price_asc' ? 'Orden: Menor a Mayor' : 'Orden: Mayor a Menor'}
                        <IoArrowDownCircleOutline
                          className='-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
                          aria-hidden='true'
                        />
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter='transition ease-out duration-100'
                      enterFrom='transform opacity-0 scale-95'
                      enterTo='transform opacity-100 scale-100'
                      leave='transition ease-in duration-75'
                      leaveFrom='transform opacity-100 scale-100'
                      leaveTo='transform opacity-0 scale-95'
                    >
                      <Menu.Items className='absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-900'>
                        <div className='py-1'>
                          {sortOptions.map((option) => (
                            <Menu.Item key={option.key}>
                              {({ active }) => (
                                <button
                                  type='button'
                                  className={classNames(
                                    sortOrder === option.key ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300',
                                    active ? 'bg-gray-100 dark:bg-zinc-800' : '',
                                    'block w-full px-4 py-2 text-left text-sm'
                                  )}
                                  onClick={() => setSortOrder(option.key as 'price_asc' | 'price_desc')}
                                >
                                  {option.name}
                                </button>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                  <button
                    type='button'
                    className='-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden'
                    onClick={() => setMobileFiltersOpen(true)}
                  >
                    <span className='sr-only'>Filters</span>
                    <BsFunnelFill className='h-5 w-5' aria-hidden='true' />
                  </button>
                </div>
              </div>

              <section aria-labelledby='products-heading' className='pb-24 pt-6'>
                <h2 id='products-heading' className='sr-only'>
                  Products
                </h2>

                <div className='mb-6 flex items-center justify-between gap-3'>
                  <div className='inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900'>
                    <button
                      type='button'
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        activeSource === 'mercadolibre'
                          ? 'bg-primary text-white'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => setActiveSource('mercadolibre')}
                    >
                      MercadoLibre ({sortedMercadoLibreData.length})
                    </button>
                    <button
                      type='button'
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        activeSource === 'google-shopping'
                          ? 'bg-primary text-white'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => setActiveSource('google-shopping')}
                    >
                      Otras tiendas ({sortedGoogleShoppingData.length})
                    </button>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4'>
                  {/* Filters */}
                  <form className='hidden lg:block'>
                    <h3 className='sr-only dark:text-gray-200'>Categorías</h3>
                    <ul
                      role='list'
                      className='space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900 dark:text-gray-200'
                    >
                      {subCategories.map((category) => (
                        <li key={category.name}>
                          <a
                            href={category.href}
                            className={`block px-2 py-3 ${
                              freeShipping ? 'font-bold dark:text-gray-200' : 'dark:text-gray-200'
                            }`}
                            onClick={() => setFreeShipping(!freeShipping)}
                          >
                            {category.name}
                          </a>
                        </li>
                      ))}
                    </ul>

                    {filters.map((section) => (
                      <Disclosure as='div' key={section.id} className='border-b border-gray-200 py-6'>
                        {({ open }) => (
                          <>
                            <h3 className='-my-3 flow-root'>
                              <Disclosure.Button className='flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500'>
                                <span className='font-medium text-gray-900'>{section.name}</span>
                                <span className='ml-6 flex items-center'>
                                  {open ? (
                                    <PiMinusCircleBold className='h-5 w-5' aria-hidden='true' />
                                  ) : (
                                    <PiPlusCircleBold className='h-5 w-5' aria-hidden='true' />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className='pt-6'>
                              <div className='space-y-4'>
                                {section.options.map((option, optionIdx) => (
                                  <div key={option.value} className='flex items-center'>
                                    <input
                                      id={`filter-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      defaultValue={option.value}
                                      type='checkbox'
                                      defaultChecked={option.checked}
                                      className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                                    />
                                    <label
                                      htmlFor={`filter-${section.id}-${optionIdx}`}
                                      className='ml-3 text-sm text-gray-600'
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </form>

                  {/* Product grid */}
                  <div className='lg:col-span-3'>
                    <ProductResults data={activeData} />
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      ) : (
        <div className='flex justify-center m-auto items-center pt-20'>
          <main className='mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8 dark:bg-black'>
            <div className='flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24 dark:bg-black'>
              <div className='flex justify-center align-center'>
                <h1 className='text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-200'>
                  Buscando producto...
                </h1>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
