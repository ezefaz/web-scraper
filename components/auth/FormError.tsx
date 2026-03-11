import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

type Props = {
  message?: string;
};

const FormError: React.FC<Props> = ({ message }) => {
  if (!message) return null;
  return (
    <div className='flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200'>
      <FaExclamationCircle className='h-4 w-4 shrink-0' />
      <span>{message}</span>
    </div>
  );
};

export default FormError;
