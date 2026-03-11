import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

type Props = {
  message?: string;
};

const FormSuccess: React.FC<Props> = ({ message }) => {
  if (!message) return null;
  return (
    <div className='flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200'>
      <FaCheckCircle className='h-4 w-4 shrink-0' />
      <span>{message}</span>
    </div>
  );
};

export default FormSuccess;
