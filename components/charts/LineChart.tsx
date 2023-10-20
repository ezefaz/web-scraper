'use client';

import React, { useState } from 'react';
import { Card, Title, LineChart, Text, Flex, Metric, ProgressBar } from '@tremor/react';
import { Badge, BadgeDelta } from '@tremor/react';
import { HiOutlineStatusOnline } from 'react-icons/hi';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@tremor/react';
import { getMonthName, isSameWeek } from '@/lib/utils';

interface Props {
  priceBasedOnDolar: number;
  dateHistory: Array<String | Date>;
  dolarValue: number;
  dolarDate: Date;
  dolarDates: Array<string | Date>;
  dolarValues: Array<Number>;
}

const valueFormatter = (number: number) => `$ ${new Intl.NumberFormat('us').format(number).toString()}`;

const DolarBasedChart = ({ priceBasedOnDolar, dateHistory, dolarValue, dolarDate, dolarValues, dolarDates }: Props) => {
  const [selectedTab, setSelectedTab] = useState('mensual');

  let chartdata: any = [];

  if (selectedTab === 'diario') {
    let realProductValue = 0;
    let distinctDolarValues: Array<number> = [];

    for (let i = 0; i < dolarDates.length; i++) {
      const dateString = dolarDates[i].toString().slice(0, 10);
      const currentDolarValue = Number(dolarValues[i]);
      const today = new Date().toISOString().slice(0, 10);

      if (dateString === today) {
        realProductValue = currentDolarValue * priceBasedOnDolar;
        if (!distinctDolarValues.includes(currentDolarValue)) {
          distinctDolarValues.push(currentDolarValue);
        }
      }
    }

    chartdata = [
      {
        date: new Date().toISOString().slice(0, 10),
        'Valor Real del Producto': realProductValue,
        'Valor del Dólar': distinctDolarValues,
      },
    ];
  } else if (selectedTab === 'semanal') {
    let weeklyData: any = [];

    for (let i = 0; i < dolarDates.length; i++) {
      const currentDolarDate = new Date(dolarDates[i]);
      const currentDolarValue = dolarValues[i];
      const currentDay = currentDolarDate.getDay();
      let currentWeekDates: any = [];
      let currentWeekValues: any = [];

      for (let j = 0; j < dolarDates.length; j++) {
        const comparedDolarDate = new Date(dolarDates[j]);
        if (isSameWeek(currentDolarDate, comparedDolarDate)) {
          currentWeekDates.push(comparedDolarDate);
          currentWeekValues.push(dolarValues[j]);
        }
      }

      if (currentWeekDates.length > 0) {
        const weekMax = Math.max(...currentWeekValues);
        const weekMin = Math.min(...currentWeekValues);

        const startDate = currentWeekDates[0].toISOString().slice(0, 10);
        const endDate = currentWeekDates[currentWeekDates.length - 1].toISOString().slice(0, 10);

        weeklyData.push({
          startDate,
          endDate,
          max: weekMax,
          min: weekMin,
        });
      }
    }

    chartdata = weeklyData.map(({ startDate, endDate, max, min }: any) => ({
      date: startDate,
      endDate,
      'Valor Real del Producto': priceBasedOnDolar,
      'Valor del Dólar': min,
      // 'Valor Real del Producto': min,
    }));
  } else {
    // Lógica para datos mensuales (por defecto)
    if (dolarValues.length === 1) {
      chartdata = dolarDates.map((date, index) => ({
        date: getMonthName(date),
        'Valor Real del Producto': priceBasedOnDolar,
        'Valor del Dólar': dolarValue,
        'Historial de Dólar': dolarValues[0],
      }));
    } else if (dolarValues.length > 1) {
      chartdata = dolarDates.map((date, index) => ({
        date: getMonthName(date),
        'Valor Real del Producto': priceBasedOnDolar,
        'Valor del Dólar': dolarValues[0],
        'Historial del Dolar': dolarValues[1],
      }));
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
          categories={['Valor Real del Producto', 'Valor del Dólar', 'Historial de Dólar']}
          colors={['indigo', 'cyan', 'purple']}
          valueFormatter={valueFormatter}
          yAxisWidth={80}
        />
      </Card>
    </>
  );
};

export default DolarBasedChart;
