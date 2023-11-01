'use client';

import { Icon } from '@tremor/react';
import React from 'react';
import { IoMdRemoveCircleOutline } from 'react-icons/io';
import { deleteProduct, removeProductFromUser } from '@/lib/actions';

const Removal = ({ product }: any) => {
  const handleDeleteProduct = async () => {
    try {
      await removeProductFromUser(product);
    } catch (error) {
      console.error('Error deleting product: ', error);
    }
  };

  const handleOnClick = () => {
    handleDeleteProduct();
  };

  return (
    <div>
      <Icon icon={IoMdRemoveCircleOutline} variant='solid' tooltip='Delete Product' onClick={handleOnClick} />
    </div>
  );
};

export default Removal;
