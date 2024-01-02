import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

type Props = {
  message?: string;
};

const FormError: React.FC<Props> = ({ message }) => {
  if (!message) return null;
  return (
    <div className='flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md '>
      <FaExclamationCircle className='mr-2' />
      <span>{message}</span>
    </div>
  );
};

export default FormError;
