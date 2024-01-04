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
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  stroke='#000000'
                  stroke-width='0.00024000000000000003'
                >
                  <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
                  <g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g>
                  <g id='SVGRepo_iconCarrier'>
                    {' '}
                    <g clip-path='url(#clip0_15_82)'>
                      {' '}
                      <rect width='24' height='24' fill='white'></rect>{' '}
                      <g filter='url(#filter0_d_15_82)'>
                        {' '}
                        <path
                          d='M14.3365 12.3466L14.0765 11.9195C13.9082 12.022 13.8158 12.2137 13.8405 12.4092C13.8651 12.6046 14.0022 12.7674 14.1907 12.8249L14.3365 12.3466ZM9.6634 12.3466L9.80923 12.8249C9.99769 12.7674 10.1348 12.6046 10.1595 12.4092C10.1841 12.2137 10.0917 12.022 9.92339 11.9195L9.6634 12.3466ZM4.06161 19.002L3.56544 18.9402L4.06161 19.002ZM19.9383 19.002L20.4345 18.9402L19.9383 19.002ZM16 8.5C16 9.94799 15.2309 11.2168 14.0765 11.9195L14.5965 12.7737C16.0365 11.8971 17 10.3113 17 8.5H16ZM12 4.5C14.2091 4.5 16 6.29086 16 8.5H17C17 5.73858 14.7614 3.5 12 3.5V4.5ZM7.99996 8.5C7.99996 6.29086 9.79082 4.5 12 4.5V3.5C9.23854 3.5 6.99996 5.73858 6.99996 8.5H7.99996ZM9.92339 11.9195C8.76904 11.2168 7.99996 9.948 7.99996 8.5H6.99996C6.99996 10.3113 7.96342 11.8971 9.40342 12.7737L9.92339 11.9195ZM9.51758 11.8683C6.36083 12.8309 3.98356 15.5804 3.56544 18.9402L4.55778 19.0637C4.92638 16.1018 7.02381 13.6742 9.80923 12.8249L9.51758 11.8683ZM3.56544 18.9402C3.45493 19.8282 4.19055 20.5 4.99996 20.5V19.5C4.70481 19.5 4.53188 19.2719 4.55778 19.0637L3.56544 18.9402ZM4.99996 20.5H19V19.5H4.99996V20.5ZM19 20.5C19.8094 20.5 20.545 19.8282 20.4345 18.9402L19.4421 19.0637C19.468 19.2719 19.2951 19.5 19 19.5V20.5ZM20.4345 18.9402C20.0164 15.5804 17.6391 12.8309 14.4823 11.8683L14.1907 12.8249C16.9761 13.6742 19.0735 16.1018 19.4421 19.0637L20.4345 18.9402Z'
                          fill='#000000'
                        ></path>{' '}
                      </g>{' '}
                    </g>{' '}
                    <defs>
                      {' '}
                      <filter
                        id='filter0_d_15_82'
                        x='2.55444'
                        y='3.5'
                        width='18.8911'
                        height='19'
                        filterUnits='userSpaceOnUse'
                        color-interpolation-filters='sRGB'
                      >
                        {' '}
                        <feFlood flood-opacity='0' result='BackgroundImageFix'></feFlood>{' '}
                        <feColorMatrix
                          in='SourceAlpha'
                          type='matrix'
                          values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                          result='hardAlpha'
                        ></feColorMatrix>{' '}
                        <feOffset dy='1'></feOffset> <feGaussianBlur stdDeviation='0.5'></feGaussianBlur>{' '}
                        <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'></feColorMatrix>{' '}
                        <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_15_82'></feBlend>{' '}
                        <feBlend
                          mode='normal'
                          in='SourceGraphic'
                          in2='effect1_dropShadow_15_82'
                          result='shape'
                        ></feBlend>{' '}
                      </filter>{' '}
                      <clipPath id='clip0_15_82'>
                        {' '}
                        <rect width='24' height='24' fill='white'></rect>{' '}
                      </clipPath>{' '}
                    </defs>{' '}
                  </g>
                </svg>
              }
              text='Perfil'
              link='/profile'
            />

            {loggedUser && loggedUser.role === 'ADMIN' && (
              <DropdownItem
                icon={
                  <svg
                    fill='#00000'
                    width='20'
                    height='20'
                    viewBox='-192 -192 2304.00 2304.00'
                    xmlns='http://www.w3.org/2000/svg'
                    stroke='#4d4d4d'
                  >
                    <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
                    <g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g>
                    <g id='SVGRepo_iconCarrier'>
                      {' '}
                      <path
                        d='M1142.277 1243.138H777.214v347.178c66.118 23.143 113.538 86.085 113.538 160.103 0 93.657-75.924 169.581-169.581 169.581-93.657 0-169.581-75.924-169.581-169.581 0-74.018 47.42-136.96 113.538-160.103v-347.178H541.656l.033 198.107c0 77.095-62.497 139.592-139.592 139.592l-59.136-.048c-22.914 66.534-86.064 114.337-160.38 114.337C88.924 1695.126 13 1619.2 13 1525.544s75.924-169.581 169.581-169.581c73.707 0 136.431 47.023 159.809 112.707h61.463c14.201 0 25.714-11.513 25.714-25.714v-199.818H183.115c-32.461 0-58.776-26.314-58.776-58.775V58.776C124.339 26.315 150.654 0 183.115 0h1552.02c32.46 0 58.775 26.315 58.775 58.776v1125.587c0 32.46-26.314 58.775-58.775 58.775h-245.278v199.818c0 14.201 11.512 25.714 25.714 25.714h61.463c23.377-65.684 86.101-112.707 159.808-112.707 93.658 0 169.582 75.924 169.582 169.581 0 93.657-75.924 169.582-169.582 169.582-74.315 0-137.465-47.803-160.379-114.337l-59.1.048c-77.131 0-139.628-62.497-139.628-139.592l.033-198.107h-123.405v347.178c66.118 23.143 113.538 86.085 113.538 160.103 0 93.657-75.924 169.581-169.581 169.581-93.657 0-169.581-75.924-169.581-169.581 0-74.018 47.42-136.96 113.538-160.103v-347.178Zm57.394 562.91c30.723 0 55.629-24.906 55.629-55.63 0-30.722-24.906-55.628-55.629-55.628s-55.629 24.906-55.629 55.629 24.906 55.629 55.63 55.629Zm-477.149 0c30.723 0 55.629-24.906 55.629-55.63 0-30.722-24.906-55.628-55.629-55.628s-55.629 24.906-55.629 55.629 24.906 55.629 55.629 55.629Zm1015.672-224.875c30.723 0 55.628-24.906 55.628-55.629s-24.905-55.629-55.628-55.629-55.63 24.906-55.63 55.63c0 30.722 24.907 55.628 55.63 55.628Zm-1556.964 0c30.723 0 55.63-24.906 55.63-55.629s-24.907-55.629-55.63-55.629c-30.723 0-55.629 24.906-55.629 55.63 0 30.722 24.906 55.628 55.63 55.628ZM901.047 348.665l220.035 131.796C1133.59 489.628 1141 504.338 1141 520c0 15.662-7.41 30.372-19.918 39.539L901.047 691.335a47.406 47.406 0 0 1-48.007.014c-14.858-8.697-24.02-24.777-24.04-42.189V390.84c.02-17.412 9.182-33.492 24.04-42.19a47.406 47.406 0 0 1 48.007.015Zm786.155 584.668V136.054c0-16.23-13.157-29.387-29.388-29.387H260.434c-16.23 0-29.387 13.157-29.387 29.387v797.28h1456.155Zm0 106.667H231.047v67.099c0 16.23 13.157 29.387 29.388 29.387h1397.38c16.23 0 29.387-13.157 29.387-29.387V1040Z'
                        fill-rule='evenodd'
                      ></path>{' '}
                    </g>
                  </svg>
                }
                text='Administrador'
                link='/admin'
              />
            )}
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
