import { PriceHistoryItem, Product } from '@/types';

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
};

const THRESHOLD_PERCENTAGE = 40;

// Extracts and returns the price from a list of possible elements.
export function extractPrice(...elements: any) {
  for (const element of elements) {
    const priceText = element.text().trim();

    if (priceText) {
      const cleanPrice = priceText.replace(/[^\d.]/g, '');

      let firstPrice;

      if (cleanPrice) {
        firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
      }

      return firstPrice || cleanPrice;
    }
  }

  return '';
}

export function extractCategories(...elements: any) {
  for (const element of elements) {
    const categoryText = element.text().trim();

    if (categoryText) {
      const splitBySpace = categoryText.split(/\s+/);
      let category: Array<string> = [];
      splitBySpace.forEach((word: string) => {
        category = category.concat(word.split(/(?=[A-Z])/));
      });
      return category;
    }
  }

  return [];
}

// Extracts and returns the currency symbol from an element.
export function extractCurrency(element: any) {
  const currencyText = element.text().trim().slice(0, 1);
  return currencyText ? currencyText : '';
}

// Extracts description from two possible elements from amazon
export function extractDescription($: any) {
  // these are possible elements holding description of the product
  const selectors = ['.ui-pdp-description__content', '.ui-pdp-description', '.ui-pdp-description br'];

  for (const selector of selectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      const textContent = elements
        .map((_: any, element: any) => $(element).text().trim())
        .get()
        .join('\n');
      return textContent;
    }
  }

  // If no matching elements were found, return an empty string
  return '';
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
  let highestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price > highestPrice.price) {
      highestPrice = priceList[i];
    }
  }

  return highestPrice.price;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
  let lowestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price < lowestPrice.price) {
      lowestPrice = priceList[i];
    }
  }

  return lowestPrice.price;
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
  const averagePrice = sumOfPrices / priceList.length || 0;

  return averagePrice;
}

export const getEmailNotifType = (scrapedProduct: Product, currentProduct: Product) => {
  const lowestPrice = getLowestPrice(currentProduct.priceHistory);

  if (scrapedProduct.currentPrice < lowestPrice) {
    return Notification.LOWEST_PRICE as keyof typeof Notification;
  }
  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
  }
  if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
    return Notification.THRESHOLD_MET as keyof typeof Notification;
  }

  return null;
};

export const formatNumber = (num: number = 0) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export function formatNumberWithCommas(num: number = 0) {
  // Convert the number to a string
  const numStr = num.toString();

  // Split the string into integer and decimal parts
  const [integerPart, decimalPart] = numStr.split('.');

  // Add commas for thousands separators to the integer part
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Combine the formatted integer part with the decimal part, removing trailing zeros
  const formattedDecimalPart = decimalPart ? `.${decimalPart}` : '';
  const formattedNumber = `${formattedIntegerPart}${formattedDecimalPart}`;

  return formattedNumber;
}

export const getLastThreeMonths = () => {
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];
  const today = new Date();
  const currentMonth = today.getMonth();

  const lastFourMonths = [];
  for (let i = 2; i >= 0; i--) {
    lastFourMonths.push(months[(currentMonth - i + 12) % 12]);
  }
  return lastFourMonths;
};

export const extractMonthsFromDate = (dateArray: Array<Date>) =>
  dateArray.map((date: Date) => {
    const parsedDate = new Date(date);
    const monthName = parsedDate.toLocaleString('es-AR', { month: 'long' });
    return monthName;
  });
