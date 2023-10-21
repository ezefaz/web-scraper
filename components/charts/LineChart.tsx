'use client';

import React, { useState } from 'react';
import { Card, Title, LineChart, Text, Flex, Metric, ProgressBar } from '@tremor/react';
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
}

const valueFormatter = (number: number) => `$ ${new Intl.NumberFormat('us').format(number).toString()}`;

const isDevelopment = process.env.NODE_ENV === 'development';

const DolarBasedChart = ({ currentPrice, dolarValue, dolarDate, dolarValues, dolarDates }: Props) => {
  const [selectedTab, setSelectedTab] = useState('diario');

  let chartdata: any = [];

  if (isDevelopment) {
    // Use the generated fake data in development mode
    if (selectedTab === 'diario') {
      const fakerDailyData = generateDailyDolarData(5);

      chartdata = fakerDailyData.map((dataItem: any, index: number) => {
        return {
          date: new Date().toISOString().slice(0, 10),
          'Valor Real del Producto': currentPrice / dataItem.value,
          'Valor del Dólar': dataItem.value,
        };
      });
    } else if (selectedTab === 'semanal') {
      const weeklyData = [];
      const thisSunday = new Date();
      thisSunday.setDate(thisSunday.getDate() - thisSunday.getDay());
      const nextSunday = new Date(thisSunday);
      nextSunday.setDate(thisSunday.getDate() + 7);

      const fakerWeeklyData = generateWeeklyDolarData();

      for (let i = 0; i < fakerWeeklyData.length; i++) {
        const currentDolarDate = new Date(fakerWeeklyData[i].date);
        const currentDolarValue = fakerWeeklyData[i].value;

        if (currentDolarDate >= thisSunday && currentDolarDate <= nextSunday) {
          weeklyData.push({
            date: currentDolarDate.toISOString().slice(0, 10),
            'Valor Real del Producto': currentPrice / currentDolarValue,
            'Valor del Dólar': currentDolarValue,
          });
        }
      }

      chartdata = weeklyData;
    } else if (selectedTab === 'mensual') {
      // Logic for monthly data using fake data
      const fakerMonthlyData = generateDolarHistory(5);
      const monthlyMonths = extractMonthsFromDate(fakerMonthlyData.map((dataItem: any) => dataItem.date));

      chartdata = fakerMonthlyData.map((dataItem: any, index: number) => {
        return {
          date: monthlyMonths[index],
          'Valor Real del Producto': currentPrice / dataItem.value,
          'Valor del Dólar': dataItem.value,
        };
      });
    }
  } else {
    if (selectedTab === 'diario') {
      const dailyData = getDailyDolarData(currentPrice, dolarValue, dolarDate, dolarValues, dolarDates);
      chartdata = dailyData;
    } else if (selectedTab === 'semanal') {
      const weeklyData = getCurrentWeekData(currentPrice, dolarValue, dolarDate, dolarValues, dolarDates);

      chartdata = weeklyData;
    } else {
      const monthlyData = getMonthlyRealData(dolarDates, dolarValues, currentPrice);

      chartdata = monthlyData;
    }
  }

  return (
    <>
      <Card className='p-4 shadow-md rounded-md w-full h-full'>
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
        <Title>Análisis {selectedTab} del Valor Real del Producto (USD)</Title>
        <LineChart
          data={chartdata}
          index='date'
          categories={['Valor Real del Producto', 'Valor del Dólar']}
          colors={['green', 'red']}
          valueFormatter={valueFormatter}
          yAxisWidth={80}
        />
      </Card>
    </>
  );
};

export default DolarBasedChart;
