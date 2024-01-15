'use client';

import React, { useState } from 'react';
import { comparePrices, extractMonthsFromDate, getDailyData, getLastThreeMonths, getMonthlyData } from '@/lib/utils';
import {
  Card,
  Title,
  LineChart,
  Text,
  Flex,
  Metric,
  ProgressBar,
  TabGroup,
  TabList,
  Tab,
  AreaChart,
} from '@tremor/react';
import { Badge, BadgeDelta } from '@tremor/react';
import { HiOutlineStatusOnline } from 'react-icons/hi';
import { generateDolarHistory } from '@/lib/faker';
import { DolarHistoryItem } from '@/types';

const priceFormatter = (number: any) => `$${Intl.NumberFormat('us').format(number).toString()}`;

interface Props {
  productTitle: string;
  dateHistory: Array<string | Date>;
  priceHistory: Array<string | Number>;
  currentPrice: Number;
  originalPrice: Number;
  monthlyData: Array<any>;
  currency: string;
}

const LineChartComponent = ({
  productTitle,
  priceHistory,
  dateHistory,
  currentPrice,
  originalPrice,
  monthlyData,
  currency,
}: Props) => {
  const [selectedTab, setSelectedTab] = useState('mensual');
  const lastThreeMonths = getLastThreeMonths();
  const monthsFromDates = extractMonthsFromDate(dateHistory);

  // const filteredPrices = priceHistory.filter((price, index) => lastThreeMonths.includes(monthsFromDates[index]));

  let chartData: any = [];

  console.log(monthlyData);

  // if (selectedTab === 'diario') {
  //   chartData = getDailyData(currentPrice, originalPrice);
  // } else if (selectedTab === 'semanal') {
  //   chartData = weeklyData;
  // } else {
  //   chartData = lastThreeMonths.map((month) => {
  //     const filteredMonthPrices = filteredPrices.filter((price, index) => {
  //       return monthsFromDates[index] === month && typeof price === 'number' && !Number.isNaN(price);
  //     });

  //     const uniquePrices: any = new Set(filteredMonthPrices);

  //     const uniquePricesArray: any = Array.from(uniquePrices);
  //     const maxPrice: Number = Math.max(...uniquePricesArray);
  //     const minPrice: Number = Math.min(...uniquePricesArray);
  //     const variation = Number(maxPrice) - Number(minPrice);

  //     if (uniquePricesArray.length === 0) {
  //       const maxPrice = originalPrice;
  //       const minPrice = currentPrice;

  //       return {
  //         mes: month.charAt(0).toUpperCase() + month.slice(1),
  //         'Precios Mayores': maxPrice,
  //         'Precios Menores': minPrice,
  //         Variación: Number(originalPrice) - Number(currentPrice),
  //       };
  //     }
  //     return {
  //       mes: month.charAt(0).toUpperCase() + month.slice(1),
  //       'Precios Mayores': maxPrice > currentPrice ? currentPrice : maxPrice,
  //       'Precios Menores': minPrice > originalPrice ? originalPrice : minPrice,
  //       Variación: Number(originalPrice) - Number(currentPrice),
  //     };
  //   });
  //   // chartData = getMonthlyData(filteredPrices, monthsFromDates, originalPrice, currentPrice);
  // }

  if (selectedTab === 'mensual') {
    chartData = monthlyData;
  }

  const valueFormatter = (number: number) => {
    return currency + number.toLocaleString('ars');
  };

  return (
    <Card className='p-4 shadow-md rounded-md w-full'>
      <TabGroup>
        <TabList className='mt-8'>
          {/* <Tab onClick={() => setSelectedTab('diario')}>Diario</Tab> */}
          <Tab onClick={() => setSelectedTab('mensual')}>Mensual</Tab>
          <Tab onClick={() => setSelectedTab('semanal')}>Anual</Tab>
        </TabList>
      </TabGroup>
      <div className='flex justify-end m-2'>
        <Badge icon={HiOutlineStatusOnline}>live</Badge>
      </div>
      <Title className='text-2xl font-semibold mb-4'>
        Análisis {selectedTab} de "{productTitle}"
      </Title>
      {/* <AreaChart
        data={monthlyData}
        index='month'
        categories={['Precios Mayores', 'Precios Menores', 'Variación']}
        colors={['emerald', 'red', 'blue']}
        valueFormatter={priceFormatter}
        yAxisWidth={70}
        className='h-72 mt-4 m-auto'
        maxValue={Number(currentPrice)}
        minValue={Number(originalPrice)}
      /> */}
      <AreaChart
        className='mt-4 h-80'
        data={chartData}
        categories={['Mayor', 'Menor']}
        index='Month'
        colors={['red', 'green']}
        yAxisWidth={60}
        valueFormatter={valueFormatter}
      />
    </Card>
  );
};

export default LineChartComponent;
