'use client';

import { signIn } from 'next-auth/react';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';

import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const onClick = (provider: 'google' | 'github') => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className='flex items-center space-x-3'>
      <button onClick={() => onClick('google')} className='rounded-full bg-red-600 text-white p-2 hover:bg-red-700'>
        <FaGoogle size={20} />
      </button>
      <button onClick={() => onClick('github')} className='rounded-full bg-black text-white p-2 hover:bg-gray-800'>
        <FaGithub size={20} />
      </button>
    </div>
  );
};
