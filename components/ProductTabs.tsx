'use client';
import { Tab, TabGroup, TabList } from '@tremor/react';

type Props = {};

const ProductTabs = (props: Props) => {
  const handleTabClick: any = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <TabGroup className='flex justify-end'>
      <TabList className='mt-8'>
        <Tab onClick={() => handleTabClick('information')}>Información</Tab>
        <Tab onClick={() => handleTabClick('history')}>Historial</Tab>
        <Tab onClick={() => handleTabClick('comparisson')}>Comparación</Tab>
      </TabList>
    </TabGroup>
  );
};

export default ProductTabs;
