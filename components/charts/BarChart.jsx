'use client';

import { extractMonthsFromDate, formatNumber, formatNumberWithCommas, getLastThreeMonths } from '@/lib/utils';
import { Card, Title, LineChart } from '@tremor/react';
import { Badge, BadgeDelta } from '@tremor/react';
import { HiOutlineStatusOnline } from 'react-icons/hi';

const priceFormatter = (number) => `$${Intl.NumberFormat('us').format(number).toString()}`;

const LineChartComponent = ({ productTitle, priceHistory, dateHistory, currentPrice, originalPrice }) => {
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
        typeof price === 'number' && // Filter out values less than 0.01
        !Number.isNaN(price) // Filter out NaN values
      );
    });

    // Remove duplicate prices using a Set
    const uniquePrices = new Set(filteredMonthPrices);

    // Convert the unique prices back to an array
    const uniquePricesArray = Array.from(uniquePrices);

    // Format prices to remove commas and dots and convert to integers
    // const formattedPrices = uniquePricesArray.map((price) => {
    //   // Use parseFloat to ensure proper interpretation of the number
    //   const formattedPrice = parseFloat(String(price).replace(/,|\./g, ''));
    //   return formattedPrice || 0; // Default to 0 if the formatting fails
    // });

    const maxPrice = Math.max(...uniquePricesArray);
    const minPrice = Math.min(...uniquePricesArray);

    const variation = maxPrice - minPrice;

    if (uniquePricesArray.length === 0) {
      const maxPrice = originalPrice;
      const minPrice = currentPrice;
      const variation = originalPrice - currentPrice;

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

  return (
    <Card className='p-4 shadow-md rounded-md w-full'>
      <div className='flex justify-end'>
        <Badge icon={HiOutlineStatusOnline}>live</Badge>
      </div>
      <Title className='text-2xl font-semibold mb-4'>Análisis Últimos Tres Meses de "{productTitle}"</Title>
      <LineChart
        data={chartdata}
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
