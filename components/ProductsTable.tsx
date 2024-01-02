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
import Search from './Search';
import { ProductType } from '@/types';
import { formatNumber } from '@/lib/utils';
import Removal from './Removal';

interface UserProduct {
  id: string;
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

const ProductsTable = ({ user, userProducts }: ProductTableProps) => {
  return (
    <div className='flex w-full justify-center items-center  mt-20'>
      <Card className='w-full  p-10'>
        <Title className='mb-4'>Listado de Productos del Usuario {user}</Title>
        <Table className='w-full'>
          <TableHead>
            <TableRow>
              <TableHeaderCell />
              <TableHeaderCell>Título</TableHeaderCell>
              <TableHeaderCell>Categoría</TableHeaderCell>
              <TableHeaderCell>Stock</TableHeaderCell>
              <TableHeaderCell>Precio ($)</TableHeaderCell>
              <TableHeaderCell>Precio (USD)</TableHeaderCell>
              <TableHeaderCell>Seguimiento</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userProducts?.map((product: UserProduct) => (
              <TableRow key={product.id} className='hover:bg-gray-50 cursor-pointer'>
                <TableCell>
                  <Removal productId={product.id} />
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
                  <Text>${product.currentDolarValue}</Text>
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

export default ProductsTable;
