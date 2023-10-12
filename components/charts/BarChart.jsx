'use client';

import { Card, Title, LineChart } from '@tremor/react';

const priceFormatter = (number) => `$${Intl.NumberFormat('us').format(number).toString()}`;

const LineChartComponent = ({ highestPrice, lowestPrice, productTitle }) => {
  // Function to get the current month and three months before it
  const getLastThreeMonths = () => {
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    const today = new Date();
    const currentMonth = today.getMonth();
    const lastFourMonths = [];
    for (let i = 2; i >= 0; i--) {
      lastFourMonths.push(months[(currentMonth - i + 12) % 12]);
    }
    return lastFourMonths;
  };

  const lastThreeMonths = getLastThreeMonths();

  const chartdata = lastThreeMonths.map((month) => ({
    mes: month,
    'Precios Mayores': highestPrice,
    'Precios Menores': lowestPrice,
    Variación: highestPrice - lowestPrice,
  }));

  return (
    <Card className='bg-white-200 p-4 shadow-md rounded-md w-[50%]'>
      <Title className='text-2xl font-semibold mb-4'>Análisis Últimos Tres Meses de "{productTitle}"</Title>
      <LineChart
        data={chartdata}
        index='mes'
        categories={['Precios Mayores', 'Precios Menores', 'Variación']}
        colors={['emerald', 'red', 'blue']} // Added a color for 'Variación'
        valueFormatter={priceFormatter}
        yAxisWidth={80}
      />
    </Card>
  );
};

export default LineChartComponent;
