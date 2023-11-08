import React, { useState } from 'react';
import { getCurrentUser, getUserProducts } from '@/lib/actions';
import {
  Badge,
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
import { formatNumber } from '@/lib/utils';
import { Product } from '@/types';
import Removal from '@/components/Removal';
import Search from '@/components/Search';

const page = async () => {
  const userProducts = await getUserProducts();
  // const allProducts: any = await getAllProducts();
  const user = await getCurrentUser();

  // function getProductUrl() {
  //   const matchingProducts = allProducts.filter((product: Product) => {
  //     return userProducts.some((userProduct: Product) => userProduct.url === product.url);
  //   });

  //   const matchingProductIds = matchingProducts.map((product: Product) => product._id);
  // }

  // const productsUrl = getProductUrl();

  const limitWords = (title: string, limit: number) => {
    const words = title.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    }
    return title;
  };

  return (
    <>
      {!user ? (
        <div className='flex justify-center items-center p-20 mt-20'>
          <Card>
            <Title>Porfavor inicie sesión para ingresar en esta página.</Title>
          </Card>
        </div>
      ) : (
        <div className='flex justify-center items-center p-20 mt-20'>
          <Card className='w-full max-w-4xl'>
            <Title className='mb-4'>Listado de Productos del Usuario {user ? user.name : ''}</Title>
            <div className='flex justify-end '>
              <Search />
            </div>
            <Table className='w-full'>
              <TableHead>
                <TableRow>
                  <TableHeaderCell />
                  <TableHeaderCell>Título</TableHeaderCell>
                  <TableHeaderCell>Precio</TableHeaderCell>
                  <TableHeaderCell>Precio USD</TableHeaderCell>
                  <TableHeaderCell>Stock</TableHeaderCell>
                  <TableHeaderCell>Seguimiento</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userProducts?.map((product: Product) => (
                  <TableRow key={product._id} className='hover:bg-gray-50 cursor-pointer'>
                    <TableCell>
                      <Removal product={product._id?.toString()} />
                    </TableCell>
                    <TableCell>
                      <a className='text-blue-500 hover:underline' href={`/products/${product._id}`}>
                        {limitWords(product.title, 8)}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Text>{`${product.currency} ${formatNumber(product.currentPrice)}`}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{`${product.currency} ${formatNumber(
                        product.currentPrice / product.currentDolar.value
                      )}`}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>
                        {product.stockAvailable == '1'
                          ? `${product.stockAvailable} disponible`
                          : product.stockAvailable}
                      </Text>
                    </TableCell>
                    <TableCell>
                      {/* <Badge color='emerald' icon={StatusOnlineIcon}>
                    {product.status}
                  </Badge> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
    </>
  );
};

export default page;
