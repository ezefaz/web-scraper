import { ExtendedUser } from '@/next-auth';
import { UserType } from '@/types';
import { Card } from '@tremor/react';
import React from 'react';

interface UserInfoProps {
  user?: UserType;
  label: string;
}

const UserInfo = ({ user, label }: UserInfoProps) => {
  return (
    <Card className='w-full max-w-lg mx-auto bg-white rounded-md shadow-md overflow-hidden'>
      <div className='px-6 py-4'>
        <p className='text-xl font-semibold text-center dark:text-black'>{label}</p>
        <div className='mt-4 p-2'>
          <div className='flex flex-col space-y-2'>
            <div className='flex flex-row items-center'>
              <p className='text-md w-32 font-semibold dark:text-black'>ID:</p>
              <span className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md text-end ml-2 dark:text-black'>
                {user?.id}
              </span>
            </div>
            <div className='flex flex-row items-center'>
              <p className='text-md w-32 font-semibold dark:text-black'>Nombre:</p>
              <span className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md text-end ml-2 dark:text-black'>
                {user?.name}
              </span>
            </div>
            <div className='flex flex-row items-center'>
              <p className='text-md w-32 font-semibold dark:text-black'>Correo:</p>
              <span className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md text-end ml-2 dark:text-black'>
                {user?.email}
              </span>
            </div>
            <div className='flex flex-row items-center'>
              <p className='text-md w-32 font-semibold dark:text-black'>Rol:</p>
              <span className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md text-end ml-2 dark:text-black'>
                {user?.role == 'USER' ? 'Usuario' : 'Admin'}
              </span>
            </div>
            <div className='flex flex-row items-center'>
              <p className='text-md w-32 font-semibold dark:text-black'>País:</p>
              <span className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md text-end ml-2 dark:text-black'>
                {user?.country?.name.toUpperCase()}
              </span>
            </div>
            {/* <div className='flex flex-row items-center mt-4'>
              <p className='text-md w-32 font-semibold'>Cantidad de Productos:</p>
              <span className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md text-end ml-2 dark:text-black'>
                {user?.products?.length}
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserInfo;
