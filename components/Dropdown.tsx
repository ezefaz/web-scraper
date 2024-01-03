'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import DropdownItem from './DropdownItem';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-use';

const Dropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef: any = useRef(null);

  const loggedUser = useCurrentUser();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      setIsDropdownOpen(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    router.push('/');
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <>
      <div className='relative inline-block text-left' ref={dropdownRef}>
        <button
          id='dropdown-button'
          onClick={toggleDropdown}
          className='inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500'
        >
          {loggedUser && loggedUser.image ? (
            <Image src={loggedUser.image} alt='User' width={25} height={25} className='rounded-full' />
          ) : (
            <Image src='/assets/icons/user.svg' alt='User' width={25} height={25} />
          )}
        </button>
        <div
          id='dropdown-menu'
          className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
            isDropdownOpen ? '' : 'hidden'
          }`}
        >
          <div className='py-2' role='menu' aria-orientation='vertical' aria-labelledby='dropdown-button'>
            <div className='flex flex-col items-center px-4 py-2'>
              <div className='mb-2'>
                {loggedUser && loggedUser.image ? (
                  <Image src={loggedUser.image} alt='User' width={40} height={40} className='rounded-full' />
                ) : (
                  <Image src='/assets/icons/user.svg' alt='User' width={25} height={25} />
                )}
              </div>
              <p className='text-sm text-gray-700'>{loggedUser?.email}</p>
              <div className='my-2 border-b border-gray-300 w-4/5'></div>
            </div>
            <DropdownItem
              icon={
                <svg width='20' height='25' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M6.75 6L7.5 5.25H16.5L17.25 6V19.3162L12 16.2051L6.75 19.3162V6ZM8.25 6.75V16.6838L12 14.4615L15.75 16.6838V6.75H8.25Z'
                    fill='#080341'
                  />
                </svg>
              }
              text='Mis Productos'
              link='/user-products'
            />
            <DropdownItem
              icon={
                <svg width='20' height='25' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M6.75 6L7.5 5.25H16.5L17.25 6V19.3162L12 16.2051L6.75 19.3162V6ZM8.25 6.75V16.6838L12 14.4615L15.75 16.6838V6.75H8.25Z'
                    fill='#080341'
                  />
                </svg>
              }
              text='Perfil'
              link='/profile'
            />
            <DropdownItem
              icon={
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M20 12C20 7.58172 16.4183 4 12 4M12 20C14.5264 20 16.7792 18.8289 18.2454 17'
                    stroke='#1C274C'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                  />
                  <path
                    d='M4 12H14M14 12L11 9M14 12L11 15'
                    stroke='#1C274C'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              }
              text='Cerrar Sesión'
              onClick={handleSignOut}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dropdown;
