'use client';
// import { Tab, TabGroup, TabList } from '@tremor/react';
import { Tabs, Tab, Card, CardBody, CardHeader } from '@nextui-org/react';
import { useState } from 'react';

type Props = {};

const ProductTabs = (props: Props) => {
  const [selected, setSelected] = useState('information');

  // const handleTabClick: any = (id: string) => {
  //   const element = document.getElementById(id);
  //   if (element) {
  //     element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //   }
  // };

  return (
    <div className='flex justify-center md:justify-end'>
      <Tabs
        aria-label='Opciones'
        selectedKey={selected}
        defaultSelectedKey={selected}
        radius='md'
        variant='solid'
        onSelectionChange={setSelected}
      >
        <Tab key='information' title='Informacion' href='#information'></Tab>
        <Tab key='history' title='Historial' href='#history'></Tab>
        <Tab key='priceCompare' title='Comparación' href='#priceCompare'></Tab>
      </Tabs>
    </div>
    //   <TabGroup className='flex justify-center md:justify-end'>
    //     <TabList className='mt-8'>
    //       <Tab onClick={() => handleTabClick('information')}>Información</Tab>
    //       <Tab onClick={() => handleTabClick('history')}>Historial</Tab>
    //       <Tab onClick={() => handleTabClick('priceCompare')}>Comparación</Tab>
    //     </TabList>
    //   </TabGroup>
  );
};

export default ProductTabs;
