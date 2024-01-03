import React from 'react';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return <div className='h-full w-full mt-40 flex flex-col gap-y-10 items-center justify-center'>{children}</div>;
};

export default ProtectedLayout;
