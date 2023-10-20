'use client';

import React, { useState } from 'react';
import {
  extractMonthsFromDate,
  formatNumber,
  formatNumberWithCommas,
  getLastThreeMonths,
  getWeekFromDate,
} from '@/lib/utils';
import { Card, Title, LineChart, Text, Flex, Metric, ProgressBar, TabGroup, TabList, Tab } from '@tremor/react';
import { Badge, BadgeDelta } from '@tremor/react';
import { HiOutlineStatusOnline } from 'react-icons/hi';

const priceFormatter = (number: any) => `$${Intl.NumberFormat('us').format(number).toString()}`;

interface Props {
  productTitle: string;
  dateHistory: Array<string | Date>;
  priceHistory: Array<string | Number>;
  currentPrice: Number;
  originalPrice: Number;
}

const LineChartComponent = ({ productTitle, priceHistory, dateHistory, currentPrice, originalPrice }: Props) => {
  const [selectedTab, setSelectedTab] = useState('mensual');
  const lastThreeMonths = getLastThreeMonths();
  const monthsFromDates = extractMonthsFromDate(dateHistory);
  const filteredPrices = priceHistory.filter((price, index) => lastThreeMonths.includes(monthsFromDates[index]));

  let chartData: any = [];

  if (selectedTab === 'diario') {
    // Lógica para datos diarios
  } else if (selectedTab === 'semanal') {
    // Lógica para datos semanales
  } else {
    chartData = lastThreeMonths.map((month) => {
      const filteredMonthPrices = filteredPrices.filter((price, index) => {
        return (
          monthsFromDates[index] === month &&
          typeof price === 'number' && // Filter out values less than 0.01
          !Number.isNaN(price) // Filter out NaN values
        );
      });

      // Remove duplicate prices using a Set
      const uniquePrices: any = new Set(filteredMonthPrices);

      // Convert the unique prices back to an array
      const uniquePricesArray: any = Array.from(uniquePrices);

      const maxPrice = Math.max(...uniquePricesArray);
      const minPrice = Math.min(...uniquePricesArray);

      const variation = maxPrice - minPrice;

      if (uniquePricesArray.length === 0) {
        const maxPrice = originalPrice;
        const minPrice = currentPrice;
        const variation = Number(originalPrice) - Number(currentPrice);

        return {
          mes: month.charAt(0).toUpperCase() + month.slice(1),
          'Precios Mayores': maxPrice,
          'Precios Menores': minPrice,
          Variación: variation,
        };
      }

      return {
        mes: month.charAt(0).toUpperCase() + month.slice(1),
        'Precios Mayores': maxPrice || currentPrice,
        'Precios Menores': minPrice || originalPrice,
        Variación: variation,
      };
    });
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
        yAxisWidth={80}
        // maxValue={currentPrice}
        // minValue={originalPrice}
      />
    </Card>
  );
};

export default LineChartComponent;
