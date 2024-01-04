'use client';

import { getProductsForDashboard } from '@/lib/actions';
import { formatNumber } from '@/lib/utils';
import {
  Card,
  Flex,
  Icon,
  MultiSelect,
  MultiSelectItem,
  Select,
  SelectItem,
  TabPanel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from '@tremor/react';
import { useEffect, useState } from 'react';
import { IoMdInformationCircleOutline } from 'react-icons/io';

type Props = {};

const ProductsDashboard = (props: Props) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const [products, setProducts] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('stock');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts: any = await getProductsForDashboard();
        setProducts(fetchedProducts);
        setLoading(false);

        console.log('Fetched Products:', fetchedProducts);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const isProductSelected = (product: any) => selectedProducts.includes(product.title) || selectedProducts.length === 0;

  return (
    <TabPanel>
      <div className='mt-6'>
        <Card className='p-4 max-w-100'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center space-x-2'>
              <Title>Historial de Productos</Title>
              <Icon
                icon={IoMdInformationCircleOutline}
                variant='simple'
                tooltip='Muestra la totalidad de productos de la aplicación'
              />
            </div>
            <div className='flex space-x-2'>
              <MultiSelect className='w-full' onValueChange={setSelectedProducts} placeholder='Buscar producto...'>
                {products.map((product: any) => (
                  <MultiSelectItem key={product._id} value={product.title}>
                    {product.title}
                  </MultiSelectItem>
                ))}
              </MultiSelect>
              <Select className='w-full' defaultValue='stock' onValueChange={setSelectedStatus} placeholder='Stock'>
                <SelectItem value='all'>Stock Disponible</SelectItem>
                <SelectItem value='overperforming'>Sin Stock</SelectItem>
              </Select>
            </div>
          </div>
          <div className='mt-6'>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>ID</TableHeaderCell>
                  <TableHeaderCell className='text-center'>Titulo</TableHeaderCell>
                  <TableHeaderCell className='text-right'>Precio ($)</TableHeaderCell>
                  <TableHeaderCell className='text-right'>Stock</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products
                  .filter((item: any) => isProductSelected(item))
                  .map((item: any) => (
                    <TableRow key={item.id} className='w-full'>
                      <TableCell>{item.id}</TableCell>
                      <TableCell className='text-left'>{item.title}</TableCell>
                      <TableCell className='text-left'>${formatNumber(item.currentPrice)}</TableCell>
                      <TableCell className='text-right'>{item.stock}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </TabPanel>
  );
};

export default ProductsDashboard;
