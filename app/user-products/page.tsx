import React from 'react';
import { getAllProducts, getCurrentUser, getUserProducts } from '@/lib/actions';
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
  Title,
} from '@tremor/react';
import { formatNumber } from '@/lib/utils';
import { Product } from '@/types';
import Removal from '@/components/Removal';

const page = async () => {
  const userProducts = await getUserProducts();
  const allProducts: any = await getAllProducts();
  const user = await getCurrentUser();

  // function getProductUrl() {
  //   const matchingProducts = allProducts.filter((product: Product) => {
  //     return userProducts.some((userProduct: Product) => userProduct.url === product.url);
  //   });

  //   const matchingProductIds = matchingProducts.map((product: Product) => product._id);
  // }

  // const productsUrl = getProductUrl();

  return (
    <>
      {!user ? (
        <div className='flex justify-center items-center p-20 mt-20'>
          <Card>
            <Title>Please log in to access this page.</Title>
          </Card>
        </div>
      ) : (
        <div className='flex justify-center items-center p-20 mt-20'>
          <Card className='w-full max-w-4xl'>
            <Title className='mb-4'>Listado de Productos del Usuario {user ? user.name : ''}</Title>
            <Table className='w-full'>
              <TableHead>
                <TableRow>
                  <TableHeaderCell></TableHeaderCell>
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
                        {product.title}
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
                      <Text>{product.stockAvailable}</Text>
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
