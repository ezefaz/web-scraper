import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import React from 'react';

interface Props {
  icon: any;
  title: string;
  details: string;
}

const ServiceCard = ({ icon, title, details }: Props) => {
  return (
    <>
      <div className='w-full flex px-4 md:w-1/2 lg:w-1/3'>
        <div className='mb-8 rounded-[20px] bg-white p-10 shadow-md hover:shadow-lg md:px-7 xl:px-10'>
          <div className={`mb-8 flex h-[70px] w-[70px] p-3 items-center justify-center rounded-2xl bg-primary`}>
            {icon}
          </div>
          <h4 className='mb-3 text-xl font-semibold text-dark dark:text-black'>{title}</h4>
          <p className='text-body-color font-regular text-l text-gray-500'>{details}</p>
        </div>
      </div>
    </>
  );
};

export default ServiceCard;
