'use client';

import React, { useState } from 'react';
import { Card, Title, LineChart, Text, Flex, Metric, ProgressBar, AreaChart } from '@tremor/react';
import { Badge, BadgeDelta } from '@tremor/react';
import { HiOutlineStatusOnline } from 'react-icons/hi';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@tremor/react';
import { extractMonthsFromDate, getCurrentWeekData, getDailyDolarData, getMonthlyRealData } from '@/lib/utils';
import { generateDailyDolarData, generateWeeklyDolarData, generateDolarHistory } from '@/lib/faker';

interface Props {
  currentPrice: number;
  dolarValue: number;
  dolarDate: Date;
  dolarDates: Array<Date>;
  dolarValues: Array<Number | number>;
  weeklyData: Array<any>;
  monthlyData: Array<any>;
  anualData: Array<any>;
}

const valueFormatter = (number: number) => `$ ${new Intl.NumberFormat('us').format(number).toString()}`;

const DolarBasedChart = ({ weeklyData, monthlyData, anualData }: Props) => {
  const [selectedTab, setSelectedTab] = useState('diario');

  let chartData: any = [];

  if (selectedTab === 'semanal') {
    chartData = weeklyData;
  } else if (selectedTab === 'mensual') {
    chartData = monthlyData;
  } else {
    chartData = anualData;
  }

  return (
    <>
      <Card className='p-4 shadow-md rounded-md w-full h-full'>
        <TabGroup>
          <TabList className='mt-8'>
            {/* <Tab onClick={() => setSelectedTab('diario')}>Diario</Tab> */}
            <Tab onClick={() => setSelectedTab('semanal')}>Semanal</Tab>
            <Tab onClick={() => setSelectedTab('mensual')}>Mensual</Tab>
            <Tab onClick={() => setSelectedTab('anual')}>Mensual</Tab>
          </TabList>
        </TabGroup>
        <div className='flex justify-end m-2'>
          <Badge icon={HiOutlineStatusOnline}>live</Badge>
        </div>
        <Title>Análisis {selectedTab} del Valor Real del Producto (USD)</Title>
        <AreaChart
          data={chartData}
          index='Date'
          categories={['Valor Producto', 'Valor Dólar']}
          colors={['green', 'red']}
          valueFormatter={valueFormatter}
          className='h-72 mt-4 m-auto'
          yAxisWidth={80}
        />
      </Card>
    </>
  );
};

export default DolarBasedChart;
