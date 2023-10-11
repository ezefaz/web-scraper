'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const navIcons = [
  { src: '/assets/icons/search.svg', alt: 'Search' },
  { src: '/assets/icons/black-heart.svg', alt: 'Heart' },
  { src: '/assets/icons/user.svg', alt: 'User' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className='w-full'>
      <nav className='bg-gray-200 p-4'>
        <div className='container mx-auto flex justify-between items-center'>
          <Link href='/' className='flex items-center gap-1'>
            <Image src='/assets/icons/savemelin3.svg' width={120} height={100} alt='Logo' />
          </Link>
          <div className='lg:hidden flex items-center'>
            <button className='text-2xl text-black hover:text-primary focus:outline-none' onClick={toggleMenu}>
              ☰
            </button>
          </div>
          <div className={`lg:flex items-center gap-5 text-black ${menuOpen ? 'block' : 'hidden'}`}>
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
          <div className='flex items-center gap-5'>
            {navIcons.map((icon) => (
              <Image src={icon.src} alt={icon.alt} width={28} height={28} className='object-contain' />
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
