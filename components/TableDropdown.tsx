'use client';

import React, { useState } from 'react';
import { Dropdown, Link, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { MdOutlineMoreVert } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { deleteProduct } from '@/lib/actions';

interface ProductTableProps {
  productId: string;
  url: string;
  isFollowing: boolean;
}

export default function TableDropdown({ url, productId, isFollowing }: ProductTableProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopySuccess(true);

    toast.success('Enlace copiado!');

    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const deletedProductId = await deleteProduct(productId);

      if (deletedProductId) {
        toast.success('Producto eliminado correctamente.');
      } else {
        console.error('Product ID not returned after deletion.');
      }
    } catch (error) {
      console.error('Error deleting product: ', error);
    }
  };

  return (
    <Dropdown backdrop='blur'>
      <DropdownTrigger>
        <Button variant='bordered' size='sm'>
          {' '}
          <MdOutlineMoreVert />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        variant='faded'
        aria-label='Static Actions'
        disabledKeys={[`${isFollowing ? 'follow' : null}`, `${!isFollowing ? 'unfollow' : null}`]}
      >
        <DropdownItem key='copy' onClick={() => copyToClipboard(url)}>
          Copiar Link
        </DropdownItem>
        <DropdownItem key='follow'>Seguir</DropdownItem>
        <DropdownItem key='unfollow' className='text-warning' color='warning'>
          Dejar de seguir
        </DropdownItem>
        <DropdownItem
          key='delete'
          onClick={() => handleDeleteProduct(productId)}
          className='text-danger'
          color='danger'
        >
          Eliminar
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
