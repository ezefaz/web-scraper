'use client';

import React, { ReactNode, MouseEventHandler } from 'react';

type DropdownItemProps = {
  icon: ReactNode;
  text: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  link?: any;
};

const DropdownItem: React.FC<DropdownItemProps> = ({ icon, text, onClick, link }) => {
  return (
    <>
      <a
        className='flex items-center justify-between rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer'
        role='menuitem'
        onClick={onClick}
        href={link}
      >
        {icon}
        <span>{text}</span>
      </a>
    </>
  );
};

export default DropdownItem;
