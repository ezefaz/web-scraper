'use client';

import React, { useState } from 'react';
import { comparePrices, extractMonthsFromDate, getDailyData, getLastThreeMonths, getMonthlyData } from '@/lib/utils';
import { Card, Title, LineChart, Text, Flex, Metric, ProgressBar, TabGroup, TabList, Tab } from '@tremor/react';
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
  weeklyData: Array<any>;
}

const LineChartComponent = ({
  productTitle,
  priceHistory,
  dateHistory,
  currentPrice,
  originalPrice,
  weeklyData,
}: Props) => {
  const [selectedTab, setSelectedTab] = useState('diario');
  const lastThreeMonths = getLastThreeMonths();
  const monthsFromDates = extractMonthsFromDate(dateHistory);

  const filteredPrices = priceHistory.filter((price, index) => lastThreeMonths.includes(monthsFromDates[index]));

  let chartData: any = [];

  if (selectedTab === 'diario') {
    // Logic for daily data

    chartData = getDailyData(currentPrice, originalPrice);
  } else if (selectedTab === 'semanal') {
    // Lógica para datos semanales
    chartData = weeklyData;
  } else {
    chartData = lastThreeMonths.map((month) => {
      const filteredMonthPrices = filteredPrices.filter((price, index) => {
        return monthsFromDates[index] === month && typeof price === 'number' && !Number.isNaN(price);
      });
      // Remove duplicate prices using a Set
      const uniquePrices: any = new Set(filteredMonthPrices);
      // Convert the unique prices back to an array
      const uniquePricesArray: any = Array.from(uniquePrices);
      const maxPrice: Number = Math.max(...uniquePricesArray);
      const minPrice: Number = Math.min(...uniquePricesArray);
      const variation = Number(maxPrice) - Number(minPrice);

      if (uniquePricesArray.length === 0) {
        const maxPrice = originalPrice;
        const minPrice = currentPrice;

        return {
          mes: month.charAt(0).toUpperCase() + month.slice(1),
          'Precios Mayores': maxPrice,
          'Precios Menores': minPrice,
          Variación: Number(originalPrice) - Number(currentPrice),
        };
      }
      return {
        mes: month.charAt(0).toUpperCase() + month.slice(1),
        'Precios Mayores': maxPrice > currentPrice ? currentPrice : maxPrice,
        'Precios Menores': minPrice > originalPrice ? originalPrice : minPrice,
        Variación: Number(originalPrice) - Number(currentPrice),
      };
    });
    // chartData = getMonthlyData(filteredPrices, monthsFromDates, originalPrice, currentPrice);
  }
  return (
    <Card className='p-4 shadow-md rounded-md w-full'>
      <TabGroup>
        <TabList className='mt-8'>
          <Tab onClick={() => setSelectedTab('diario')}>Diario</Tab>
          <Tab onClick={() => setSelectedTab('semanal')}>Semanal</Tab>
          <Tab onClick={() => setSelectedTab('mensual')}>Mensual</Tab>
        </TabList>
      </TabGroup>
      <div className='flex justify-end m-2'>
        <Badge icon={HiOutlineStatusOnline}>live</Badge>
      </div>
      <Title className='text-2xl font-semibold mb-4'>
        Análisis {selectedTab} de "{productTitle}"
      </Title>
      <LineChart
        data={chartData}
        index='mes'
        categories={['Precios Mayores', 'Precios Menores', 'Variación']}
        colors={['emerald', 'red', 'blue']}
        valueFormatter={priceFormatter}
        yAxisWidth={70}
        className='h-72 mt-4 m-auto'
        // maxValue={currentPrice}
        // minValue={originalPrice}
      />
    </Card>
  );
};

export default LineChartComponent;
