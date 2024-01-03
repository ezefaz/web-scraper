'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewPasswordSchema } from '@/schemas';
import CardWrapper from '../CardWrapper';
import FormError from './FormError';
import FormSuccess from './FormSuccess';

import { useState, useTransition } from 'react';
import { Button } from '@tremor/react';
import Link from 'next/link';
import { newPassword } from '@/app/actions/new-password';
import { useSearchParams } from 'next/navigation';

type Props = {};

const NewPasswordForm = (props: Props) => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      newPassword(values, token).then((data: any) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };
  return (
    <div className='flex justify-center items-center h-screen'>
      <CardWrapper
        HeaderLabel='Crea tu Nueva Contraseña!'
        backButtonHref='/sign-in'
        backButtonLabel='Volver a Iniciar Sesion'
      >
        <div className='flex justify-center mb-6'>
          <Image src='/assets/icons/savemelin3.svg' width={120} height={100} alt='Logo' />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
              Contraseña
            </label>
            <input
              id='password'
              type='password'
              disabled={isPending}
              placeholder='*******'
              {...register('password')}
              className='mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50'
            />
            {errors.password && <span className='text-red-500'>{errors.password.message}</span>}
          </div>
          <div></div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <div>
            <Button
              type='submit'
              size='md'
              disabled={isPending}
              className='w-full bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded-md transition duration-300'
            >
              Reinciar Contraseña
            </Button>
          </div>
        </form>
      </CardWrapper>
    </div>
  );
};

export default NewPasswordForm;
