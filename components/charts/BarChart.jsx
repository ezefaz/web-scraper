'use client';

import { extractMonthsFromDate, formatNumber, formatNumberWithCommas, getLastThreeMonths } from '@/lib/utils';
import { Card, Title, LineChart } from '@tremor/react';

const priceFormatter = (number) => `$${Intl.NumberFormat('us').format(number).toString()}`;

const LineChartComponent = ({ productTitle, priceHistory, dateHistory }) => {
  // Get the last three months
  const lastThreeMonths = getLastThreeMonths();

  // Extract months from dateHistory
  const monthsFromDates = extractMonthsFromDate(dateHistory);

  // Filter the priceHistory based on selected months
  const filteredPrices = priceHistory.filter((price, index) => lastThreeMonths.includes(monthsFromDates[index]));

  // Create the chart data
  const chartdata = lastThreeMonths.map((month) => {
    const filteredMonthPrices = filteredPrices.filter((price, index) => {
      return (
        monthsFromDates[index] === month &&
        typeof price === 'number' &&
        price >= 2 && // Filter out values less than 0.01
        !Number.isNaN(price) // Filter out NaN values
      );
    });

    console.log('HAYH ALGO ACA?', filteredMonthPrices);

    const numericPrices = filteredMonthPrices.map((price) => parseFloat(price));

    let maxPrice = Math.max(...numericPrices);
    let minPrice = Math.min(...numericPrices);

    const cleanMinPrice = parseFloat(String(minPrice).replace(/,/g, '').replace(/\./g, ''));
    const cleanMaxPrice = parseFloat(String(maxPrice).replace(/,/g, '').replace(/\./g, ''));

    const variation = cleanMaxPrice - cleanMinPrice;

    if (filteredMonthPrices.length === 0) {
      // If no valid prices for the month, set maxPrice and minPrice to 0
      const maxPrice = 0;
      const minPrice = 0;
      const variation = 0;

      return {
        mes: month.charAt(0).toUpperCase() + month.slice(1),
        'Precios Mayores': maxPrice,
        'Precios Menores': minPrice,
        Variación: variation,
      };
    }

    return {
      mes: month.charAt(0).toUpperCase() + month.slice(1),
      'Precios Mayores': cleanMaxPrice,
      'Precios Menores': cleanMinPrice,
      Variación: variation,
    };
  });

  return (
    <Card className='bg-white-200 p-4 shadow-md rounded-md w-[50%]'>
      <Title className='text-2xl font-semibold mb-4'>Análisis Últimos Tres Meses de "{productTitle}"</Title>
      <LineChart
        data={chartdata}
        index='mes'
        categories={['Precios Mayores', 'Precios Menores', 'Variación']}
        colors={['emerald', 'red', 'blue']}
        valueFormatter={priceFormatter}
        yAxisWidth={80}
      />
    </Card>
  );
};

export default LineChartComponent;
