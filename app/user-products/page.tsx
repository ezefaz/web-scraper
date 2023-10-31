import React from 'react';
import { getCurrentUser, getUserProducts } from '@/lib/actions';
import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Title,
} from '@tremor/react';
import Link from 'next/link';

const page = async () => {
  const userProducts = await getUserProducts();
  const user = await getCurrentUser();

  console.log(userProducts);

  return (
    <div className='flex justify-center items-center p-20 mt-20'>
      <Card className='w-full max-w-4xl'>
        <Title className='mb-4'>Listado de Productos del Usuario {user.name}</Title>
        <Table className='w-full'>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Título</TableHeaderCell>
              <TableHeaderCell>Último Precio</TableHeaderCell>
              <TableHeaderCell>Stock</TableHeaderCell>
              <TableHeaderCell>Seguimiento</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userProducts.map((product: any) => (
              <TableRow key={product._id} className='hover:bg-gray-50 cursor-pointer'>
                <TableCell>
                  <a className='text-blue-500 hover:underline' href={`/products/${product._id}`}>
                    {product.title}
                  </a>
                </TableCell>
                <TableCell>
                  <Text>${product.currentPrice}</Text>
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
  );
};

export default page;
