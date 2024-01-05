'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import Dropdown from './Dropdown';
import LoginButton from './auth/LoginButton';
import { useSession } from 'next-auth/react';
import { useCurrentUser } from '@/hooks/use-current-use';

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
    <header className='w-full fixed top-0 z-50'>
      <nav className='bg-gray-200 pb-3 pt-2'>
        <div className='container ml-8 flex justify-between items-center'>
          <Link href='/' className='flex items-center gap-1'>
            <Image src='/assets/icons/savemelin3.svg' width={120} height={100} alt='Logo' />
          </Link>
          {/* {!nav && (
						<div className='lg:flex items-center gap-5 text-black hidden lg:block'>
							<a href='#how-it-works' className='hover:underline'>
								Funcionamiento
							</a>
							<a href='#pricing' className='hover:underline'>
								Precios
							</a>
							<a href='#faqs' className='hover:underline'>
								FAQs
							</a>
						</div>
					)} */}
          <div>
            {/* <ul
							className={
								nav
									? "fixed left-0 top-0 w-[60%] h-full border-r border-r-white bg-[#000300] transition-all duration-1000 overflow-y-auto bg-[#e5e7eb]"
									: "fixed left-0 top-0 w-[60%] h-full transition-all duration-1000"
							}>
							<Link href='/' className='flex items-center gap-1 mt-3 ml-2'>
								<Image
									src='/assets/icons/savemelin3.svg'
									width={120}
									height={100}
									alt='Logo'
								/>
							</Link>
							<Link href='#funcionalidad' passHref>
								<li className='mt-3 p-4 border-b border-gray-600 hover:bg-gray-700 m-auto'>
									Funcionalidad
								</li>
							</Link>
							<Link href='#precios' passHref>
								<li className='p-4 border-b border-gray-600 hover:bg-gray-700'>
									Precios
								</li>
							</Link>
							<Link href='#faqs' passHref>
								<li className='p-4 border-b border-gray-600 hover:bg-gray-700'>
									FAQs
								</li>
							</Link>
						</ul> */}

            {!user ? (
              <div className='p-2 mr-10 mt-2'>
                <LoginButton>
                  <a
                    // href='/sign-up'
                    className='bg-primary text-white hover:text-gray-300 hover:bg-gray-700 rounded-md py-2 px-4 transition duration-300 ease-in-out'
                    suppressHydrationWarning={true}
                  >
                    Comenzar Ahora
                  </a>
                </LoginButton>
              </div>
            ) : (
              <div className='container mx-auto flex justify-between items-center'>
                <Dropdown />
              </div>
            )}
          </div>

          {/* <div className='lg:hidden flex items-center'>
						<div onClick={handleNav} className='mx-8'>
							{nav ? <AiOutlineClose size={25} /> : <AiOutlineMenu size={25} />}
						</div>
					</div> */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
