'use client';

import React from 'react';
import { Card, Title, LineChart } from '@tremor/react';

interface Props {
  priceBasedOnDolar: number;
  dateHistory: Array<String>;
  dolarValue: number;
}

const valueFormatter = (number: number) => `$ ${new Intl.NumberFormat('us').format(number).toString()}`;

const DolarBasedChart = ({ priceBasedOnDolar, dateHistory, dolarValue }: Props) => {
  const chartdata = dateHistory.map((date, index) => ({
    date,
    'Valor Real del Producto': priceBasedOnDolar,
    'Valor del Dólar': dolarValue,
  }));

  return (
    <Card className='p-4 shadow-md rounded-md w-full'>
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
