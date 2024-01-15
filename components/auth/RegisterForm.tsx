'use client';

import * as z from 'zod';
import { useState, useTransition } from 'react';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '@/schemas';
import CardWrapper from '../CardWrapper';
import FormError from './FormError';
import FormSuccess from './FormSuccess';
import { Button } from '@tremor/react';
import { register as registration } from '@/app/actions/register';
import CountrySelect from './CountrySelect';
import { Avatar, Input, Select, SelectItem } from '@nextui-org/react';
import { TbEyeFilled } from 'react-icons/tb';
import { IoMdEyeOff } from 'react-icons/io';

type Props = {};

const RegisterForm = (props: Props) => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      country: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      registration(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <CardWrapper
        HeaderLabel='Crea una cuenta!'
        backButtonHref='/sign-in'
        backButtonLabel='Ya tienes una cuenta?'
        showSocial
      >
        <div className='flex justify-center mb-6'>
          <Image src='/assets/icons/savemelin3.svg' width={120} height={100} alt='Logo' />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <Input
              id='email'
              type='email'
              label='Email'
              variant='bordered'
              disabled={isPending}
              placeholder='Ingresa tu correo'
              {...register('email')}
              className='max-w-xs'
            />
            {errors.email && <span className='text-red-500'>{errors.email.message}</span>}
          </div>
          <div>
            <Input
              id='name'
              type='name'
              label='Nombre'
              variant='bordered'
              disabled={isPending}
              placeholder='Ingresa tu nombre'
              {...register('name')}
              className='max-w-xs'
            />
            {errors.name && <span className='text-red-500'>{errors.name.message}</span>}
          </div>
          <div>
            <Input
              id='password'
              label='Contraseña'
              variant='bordered'
              disabled={isPending}
              placeholder='******'
              {...register('password')}
              endContent={
                <button className='focus:outline-none' type='button' onClick={toggleVisibility}>
                  {isVisible ? (
                    <IoMdEyeOff className='text-2xl text-default-400 pointer-events-none' />
                  ) : (
                    <TbEyeFilled className='text-2xl text-default-400 pointer-events-none' />
                  )}
                </button>
              }
              type={isVisible ? 'text' : 'password'}
              className='max-w-xs'
            />
            {errors.password && <span className='text-red-500'>{errors.password.message}</span>}
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <div>
            <Select className='max-w-xs' label='Seleccionar País' id='country' {...register('country')}>
              <SelectItem
                key='argentina'
                id='country'
                {...register('country')}
                startContent={<Avatar alt='Argentina' className='w-6 h-6' src='https://flagcdn.com/ar.svg' />}
              >
                Argentina
              </SelectItem>
              <SelectItem
                key='brazil'
                id='country'
                {...register('country')}
                startContent={<Avatar alt='Brazil' className='w-6 h-6' src='https://flagcdn.com/br.svg' />}
              >
                Brasil
              </SelectItem>
              <SelectItem
                key='colombia'
                id='country'
                {...register('country')}
                startContent={<Avatar alt='Colombia' className='w-6 h-6' src='https://flagcdn.com/co.svg' />}
              >
                Colombia
              </SelectItem>
              <SelectItem
                key='uruguay'
                id='country'
                {...register('country')}
                startContent={<Avatar alt='Uruguay' className='w-6 h-6' src='https://flagcdn.com/uy.svg' />}
              >
                Uruguay
              </SelectItem>
              <SelectItem
                key='venezuela'
                id='country'
                {...register('country')}
                startContent={<Avatar alt='Venezuela' className='w-6 h-6' src='https://flagcdn.com/ve.svg' />}
              >
                Venezuela
              </SelectItem>
            </Select>
          </div>
          <div>
            <Button
              type='submit'
              size='md'
              disabled={isPending}
              className='w-full bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded-md transition duration-300'
            >
              Crear Cuenta
            </Button>
          </div>
        </form>
        <div className='mt-4 flex justify-between items-center'>
          <span className='text-sm text-gray-700'>O inicia sesión con:</span>
          <div className='flex items-center space-x-3'>
            <button className='rounded-full bg-red-600 text-white p-2 hover:bg-red-700'>
              <FaGoogle size={20} />
            </button>
            <button className='rounded-full bg-black text-white p-2 hover:bg-gray-800'>
              <FaGithub size={20} />
            </button>
          </div>
        </div>
      </CardWrapper>
    </div>
  );
};

export default RegisterForm;
