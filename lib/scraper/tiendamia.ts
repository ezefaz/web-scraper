'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';
import { getCurrentUser } from '../actions';

export async function scrapeInternationalValue(product: string) {
  // bright data proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password: password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnathorized: false,
  };

  try {
    const user = await getCurrentUser();

    const defaultCountry = 'argentina';

    const country = user?.country?.name || defaultCountry;

    let link = '';

    switch (country.toLowerCase()) {
      case 'argentina':
        link = 'https://tiendamia.com/ar/';
        break;
      case 'uruguay':
        link = 'https://tiendamia.com/uy/';
        break;
      case 'brasil':
        link = 'https://tiendamia.com/br/';
        break;
      case 'colombia':
        link = 'https://tiendamia.co/';
        break;
      default:
        link = 'https://tiendamia.com/';
        break;
    }

    const response = await axios.get(`${link}search?amzs=${product}`, options);
    const $ = cheerio.load(response.data);

    const products = $('.body-result .item.button-border')
      .map((index, element) => {
        const productTitle = $(element).find('.item-name').text().trim();
        const originalPrice = $(element).find('.now-from.list-price .currency_price').text().trim();
        const currentPrice = $(element).find('.item-real-price .currency_price').text().trim();
        const currentDollarPrice = $(element).find('.now-from.list-price .dollar_price').text().trim();
        const originalDollarPrice = $(element).find('.item-real-price .dollar_price').text().trim();
        const productLink = $(element).find('.product-new-window').attr('href');
        const productImage = $(element).find('.main-image').attr('src');

        const url = 'http://tiendamia.com';

        return {
          title: productTitle,
          currentPrice,
          originalPrice,
          currentDollarPrice,
          originalDollarPrice,
          url: url + productLink,
          image: productImage,
        };
      })
      .get();

    // console.log(products);

    return products;
  } catch (error: any) {
    throw new Error(`Failed to scrape internacional product value: ${error.message}`);
  }
}
