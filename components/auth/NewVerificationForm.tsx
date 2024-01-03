'use client';

import Image from 'next/image';
import CardWrapper from '../CardWrapper';
import { SyncLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { newVerification } from '@/app/actions/new-verification';
import FormSuccess from './FormSuccess';
import FormError from './FormError';

type Props = {};

const NewVerificationForm = (props: Props) => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError('Falta el token!');
      return;
    }

    newVerification(token)
      .then(({ data }: any) => {
        console.log(data);

        setSuccess(data?.success);
        setError(data?.error);
      })
      .catch(() => {
        setError('Algo salio mal...');
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      HeaderLabel='Confirmando tu verificación'
      backButtonHref='/sign-in'
      backButtonLabel='Volver a Iniciar Sesion'
    >
      <div className='flex justify-center mb-6 mt-5'>
        <Image src='/assets/icons/savemelin3.svg' width={120} height={100} alt='Logo' />
      </div>
      <div className='flex items-center w-full justify-center mt-12 mb-12'>
        {!success && !error && <SyncLoader />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
