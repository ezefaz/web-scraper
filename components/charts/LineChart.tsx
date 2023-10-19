'use client';

import React from 'react';
import { Card, Title, LineChart } from '@tremor/react';

interface Props {
  priceBasedOnDolar: number;
  dateHistory: Array<String>;
  dolarValue: number;
  dolarDate: Date;
  dolarDates: Array<String>;
  dolarValues: Array<Number>;
}

const valueFormatter = (number: number) => `$ ${new Intl.NumberFormat('us').format(number).toString()}`;

const DolarBasedChart = ({ priceBasedOnDolar, dateHistory, dolarValue, dolarDate, dolarValues, dolarDates }: Props) => {
  console.log('VALORES -->', dolarDates, dolarValues);

  const chartdata = dateHistory.map((date, index) => ({
    date,
    'Valor Real del Producto': priceBasedOnDolar,
    'Valor del Dólar': dolarValue,
    'Historial de Dólar': dolarValues[index], // Asumiendo que dolarValues y dolarDates tienen la misma longitud y que se corresponden por índice
    'Fecha de Dólar': dolarDates[index],
  }));

  return (
    <Card className='p-4 shadow-md rounded-md w-full h-full'>
      <Title>Valor Real del Producto en el Tiempo (USD)</Title>
      <LineChart
        data={chartdata}
        index='date'
        categories={['Valor Real del Producto', 'Valor del Dólar']}
        colors={['indigo', 'cyan']}
        valueFormatter={valueFormatter}
        yAxisWidth={80}
      />
    </Card>
  );
};

export default DolarBasedChart;
