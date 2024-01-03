'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetSchema } from '@/schemas';
import CardWrapper from '../CardWrapper';
import FormError from './FormError';
import FormSuccess from './FormSuccess';

import { useState, useTransition } from 'react';
import { Button } from '@tremor/react';
import Link from 'next/link';
import { reset } from '@/app/actions/reset';

type Props = {};

const ResetForm = (props: Props) => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      reset(values).then((data: any) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };
  return (
    <div className='flex justify-center items-center h-screen'>
      <CardWrapper
        HeaderLabel='Olvidaste tu contraseña?'
        backButtonHref='/sign-in'
        backButtonLabel='Volver a Iniciar Sesion'
      >
        <div className='flex justify-center mb-6'>
          <Image src='/assets/icons/savemelin3.svg' width={120} height={100} alt='Logo' />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              id='email'
              type='email'
              disabled={isPending}
              placeholder='john@doe.com'
              {...register('email')}
              className='mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50'
            />
            {errors.email && <span className='text-red-500'>{errors.email.message}</span>}
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
              Enviar correo de recupero
            </Button>
          </div>
        </form>
      </CardWrapper>
    </div>
  );
};

export default ResetForm;
