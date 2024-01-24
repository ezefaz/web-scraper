'use client';

import {
  Badge,
  BadgeDelta,
  Card,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  TextInput,
  Title,
} from '@tremor/react';
import { formatNumber, formatUSD } from '@/lib/utils';

interface UserProduct {
  url: string;
  id: string;
  image: string;
  title: string;
  currentPrice: number;
  currentDolarValue: number;
  currency: string;
  stock: string;
  isFollowing: boolean;
  category: string;
}

interface ProductTableProps {
  user: string | any;
  userProducts: Array<UserProduct>;
}

const limitWords = (title: string, limit: number) => {
  const words = title.split(' ');
  if (words.length > limit) {
    return words.slice(0, limit).join(' ') + '...';
  }
  return title;
};

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '@tremor/react';
import { BsArrowsExpand } from 'react-icons/bs';
import TableDropdown from './TableDropdown';
import Image from 'next/image';

const ProductsTable = ({ user, userProducts }: ProductTableProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <div className='mt-40 mb-10 text-center w-full'>
        <h1>Productos del usuario {user}</h1>
      </div>
      <div className='w-[80%] m-auto'>
        <Card className='relative mx-auto h-96 overflow-hidden w-full'>
          <Table className='w-full'>
            <TableHead>
              <TableRow>
                <TableHeaderCell className='bg-white text-center'>Imagen</TableHeaderCell>
                <TableHeaderCell className='bg-white text-center'>Título</TableHeaderCell>
                <TableHeaderCell className='bg-white text-center'>Categoría</TableHeaderCell>
                <TableHeaderCell className='bg-white text-center'>Stock</TableHeaderCell>
                <TableHeaderCell className='bg-white text-center'>Precio ($)</TableHeaderCell>
                <TableHeaderCell className='bg-white text-center'>Precio (USD)</TableHeaderCell>
                <TableHeaderCell className='bg-white text-center'>Seguimiento</TableHeaderCell>
                <TableHeaderCell className='bg-white text-center'>Acciones</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userProducts?.map((product: UserProduct) => (
                <TableRow key={product.id} className='hover:bg-gray-50 cursor-pointer'>
                  <Image src={product.image} alt={product.title} height={200} width={200} />
                  <TableCell>
                    <a
                      className='text-blue-500 hover:underline'
                      href={`/products/${product.id}`}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {limitWords(product.title, 10)}
                    </a>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Text>{product.stock == '1' ? `${product.stock} disponible` : product.stock}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{`${product.currency} ${formatNumber(product.currentPrice)}`}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{formatUSD(product.currentDolarValue)}</Text>
                  </TableCell>
                  <TableCell>
                    {/* <Text>
 										{product.isFollowing ? "Siguiendo" : "Sin Seguimiento"}
 									</Text> */}
                    <TableCell className='text-right'>
                      <BadgeDelta deltaType={product.isFollowing ? 'increase' : 'unchanged'} size='xs'>
                        {product.isFollowing ? 'Siguiendo' : 'Sin Seguimiento'}
                      </BadgeDelta>
                    </TableCell>
                  </TableCell>
                  <TableCell>
                    <TableDropdown url={product.url} productId={product.id} isFollowing={product.isFollowing} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className='inset-x-0 bottom-0 flex justify-center bg-gradient-to-t mt-4 from-white pt-12 pb-8 absolute rounded-b-lg'>
            {userProducts.length > 3 ? (
              <Button
                icon={BsArrowsExpand}
                className='bg-white shadow-md border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                onClick={openModal}
              >
                Mostrar Más
              </Button>
            ) : null}
          </div>
        </Card>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-900 bg-opacity-25' />
          </Transition.Child>
          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel
                  className='w-[80%] transform overflow-hidden ring-tremor bg-white
                                    p-6 text-left align-middle shadow-tremor transition-all rounded-xl'
                >
                  <div className='relative mt-3 w-full'>
                    <Table className='h-[450px]'>
                      <TableHead>
                        <TableRow>
                          <TableHeaderCell className='bg-white text-center'>Imagen</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center'>Título</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center'>Categoría</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center'>Stock</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center'>Precio ($)</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center'>Precio (USD)</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center'>Seguimiento</TableHeaderCell>
                          <TableHeaderCell className='bg-white text-center'>Acciones</TableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userProducts?.map((product: UserProduct) => (
                          <>
                            <TableRow key={product.id} className='w-full hover:bg-gray-50 cursor-pointer'>
                              <TableCell>
                                <Image src={product.image} alt={product.title} height={200} width={200} />
                              </TableCell>
                              <TableCell>
                                <a
                                  className='text-blue-500 hover:underline'
                                  href={`/products/${product.id}`}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                >
                                  {limitWords(product.title, 10)}
                                </a>
                              </TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>
                                <Text>{product.stock == '1' ? `${product.stock} disponible` : product.stock}</Text>
                              </TableCell>
                              <TableCell>
                                <Text>{`${product.currency} ${formatNumber(product.currentPrice)}`}</Text>
                              </TableCell>
                              <TableCell>
                                <Text>{formatUSD(product.currentDolarValue)}</Text>
                              </TableCell>
                              <TableCell>
                                <TableCell className='text-right'>
                                  <BadgeDelta deltaType={product.isFollowing ? 'increase' : 'unchanged'} size='xs'>
                                    {product.isFollowing ? 'Siguiendo' : 'Sin Seguimiento'}
                                  </BadgeDelta>
                                </TableCell>
                              </TableCell>
                              <TableCell>
                                <TableDropdown
                                  url={product.url}
                                  productId={product.id}
                                  isFollowing={product.isFollowing}
                                />
                              </TableCell>
                            </TableRow>
                          </>
                        ))}
                      </TableBody>
                      <div className='absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-white z-0 h-20 w-full' />
                    </Table>
                  </div>
                  <Button
                    className='mt-5 w-full bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                    onClick={closeModal}
                  >
                    Volver
                  </Button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ProductsTable;
