'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewPasswordSchema } from '@/schemas';
import CardWrapper from '../CardWrapper';
import FormError from './FormError';
import FormSuccess from './FormSuccess';

import { useState, useTransition } from 'react';
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
    <CardWrapper
      HeaderLabel='Crea tu nueva contraseña'
      backButtonHref='/sign-in'
      backButtonLabel='Volver a iniciar sesión'
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='space-y-1'>
          <label htmlFor='password' className='block text-sm text-muted-foreground'>
            Nueva contraseña
          </label>
          <input
            id='password'
            type='password'
            disabled={isPending}
            placeholder='••••••••'
            {...register('password')}
            className='w-full h-11 border border-border bg-section-grey px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:border-foreground/30'
          />
          {errors.password && <span className='text-xs text-red-600'>{errors.password.message}</span>}
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />

        <button
          type='submit'
          disabled={isPending}
          className='inline-flex w-full items-center justify-center bg-primary h-11 px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {isPending ? 'Actualizando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </CardWrapper>
  );
};

export default NewPasswordForm;
