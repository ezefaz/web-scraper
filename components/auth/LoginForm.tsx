'use client';

import * as z from 'zod';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/schemas';
import CardWrapper from '../CardWrapper';
import FormError from './FormError';
import FormSuccess from './FormSuccess';

import { useState, useTransition } from 'react';
import { Button } from '@tremor/react';
import { login } from '@/app/actions/login';
import { Social } from './Social';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Props = {};

const LoginForm = (props: Props) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked' ? 'El correo es utilizado con otro proveedor' : '';

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');

    try {
      startTransition(async () => {
        const data = await login(values, callbackUrl);

        console.log(data);

        if (data?.error) {
          console.log('Error:', data.error);
          setError(data.error);
        }

        if (data?.success) {
          console.log('Success:', data.success);
          setSuccess(data.success);
        }
      });
    } catch (error) {
      setError('Something went wrong');
      console.error('Error occurred during login:', error);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <CardWrapper
        HeaderLabel='Bienvenido!'
        backButtonHref='/sign-up'
        backButtonLabel='No tienes una cuenta?'
        showSocial
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
            <button className='block px-0 py-2 mt-2 text-sm font-normal text-gray-600 hover:text-primary focus:outline-none focus:text-blue-500'>
              <Link href='/reset'>Olvidaste tu contraseña?</Link>
            </button>
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <div>
            <Button
              type='submit'
              size='md'
              disabled={isPending}
              className='w-full bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded-md transition duration-300'
            >
              Iniciar Sesión
            </Button>
          </div>
        </form>
        <div className='mt-4 flex justify-between items-center'>
          <span className='text-sm text-gray-700'>O inicia sesión con:</span>
          {/* <div className='flex items-center space-x-3'> */}
          <Social />

          {/* <button className='rounded-full bg-red-600 text-white p-2 hover:bg-red-700'>
							<FaGoogle size={20} />
						</button>
						<button className='rounded-full bg-black text-white p-2 hover:bg-gray-800'>
							<FaGithub size={20} />
						</button>
					</div> */}
        </div>
      </CardWrapper>
    </div>
  );
};

export default LoginForm;
