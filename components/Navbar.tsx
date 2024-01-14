'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import Dropdown from './Dropdown';
import LoginButton from './auth/LoginButton';
import { useSession } from 'next-auth/react';
import { useCurrentUser } from '@/hooks/use-current-use';
import { ThemeSwitcher } from './ThemeSwitcher';
import UserDropdown from './UserDropdown';

const navIcons = [
  { src: '/assets/icons/search.svg', alt: 'Search' },
  { src: '/assets/icons/black-heart.svg', alt: 'Heart' },
  { src: '/assets/icons/user.svg', alt: 'User' },
];

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const user = useCurrentUser();

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <header className='w-full fixed top-4 z-50'>
      <nav className='bg-gray-300 dark:bg-black'>
        <div className='container ml-8 flex justify-between items-center'>
          <Link href='/' className='flex items-center gap-1'>
            <Image src='/assets/icons/savemelin3.svg' width={120} height={100} alt='Logo' />
          </Link>

          <div>
            {!user ? (
              <>
                <div className='flex items-center p-2 mr-10 mt-2'>
                  <LoginButton>
                    <a
                      // href='/sign-up'
                      className='bg-primary text-white hover:text-gray-300 hover:bg-gray-700 rounded-md py-2 px-4 transition duration-300 ease-in-out'
                      suppressHydrationWarning={true}
                    >
                      Comenzar Ahora
                    </a>
                  </LoginButton>
                  <ThemeSwitcher />
                </div>
              </>
            ) : (
              <div className='container mx-auto flex justify-between items-center'>
                {/* <Dropdown /> */}
                <UserDropdown />
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
