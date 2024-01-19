'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';
import { scrapeDolarValue } from './dolar';

export async function scrapeProductSearchPageML(productTitle: any) {
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
    const searchUrl = `https://listado.mercadolibre.com.ar/${productTitle}`;

    const response = await axios.get(searchUrl);

    const html = response.data;
    const $ = cheerio.load(html);

    const scrapedDolarValue = await scrapeDolarValue();

    const productList: any = [];
    $('.ui-search-layout.ui-search-layout--stack .ui-search-layout__item').each((index, element) => {
      const product = $(element);
      const title = product.find('.ui-search-item__title').text().trim();
      const url = product.find('a.ui-search-link').attr('href') || '';
      let priceLabel = product.find('.andes-money-amount').attr('aria-label');

      if (priceLabel && priceLabel.includes('Antes')) {
        priceLabel = priceLabel.replace('Antes: ', '');
      }

      let price = '';
      if (priceLabel) {
        price = priceLabel.replace(' pesos', '');
      } else {
        const priceElement = product.find('.andes-money-amount.ui-search-price__part');
        price = priceElement.attr('aria-label') || '';
      }

      const pricesLabel = product.find('.andes-money-amount__fraction');

      // Extract and parse prices
      const pricesArray: number[] = [];
      pricesLabel.each((idx, fractionElement) => {
        const priceText = $(fractionElement).text().replace(/\./g, '').replace(',', '.');
        const numericPrice = parseFloat(priceText);
        pricesArray.push(numericPrice);
      });

      let currentPrice = 0;
      let originalPrice = 0;

      if (pricesArray.length === 2) {
        currentPrice = pricesArray[0];
      } else if (pricesArray.length === 3) {
        originalPrice = pricesArray[0];
        currentPrice = pricesArray[1];
      } else if (pricesArray.length === 1) {
        currentPrice = pricesArray[0];
      }

      const currency = product.find('.andes-money-amount__currency-symbol').first().text();

      const freeShipping = product.find('.ui-search-item__shipping.ui-search-item__shipping--free').text();

      const image = product.find('.ui-search-result-image__element').attr('data-src');

      const dolarPrice = Number(price) / Number(scrapedDolarValue);

      const features = product.find('.ui-search-item__group__element.ui-search-item__variations-text').text();

      const isBestSeller = product.find('.ui-search-styled-label.ui-search-item__highlight-label__text').text();

      productList.push({
        url,
        title,
        currentPrice,
        originalPrice,
        image,
        dolarPrice,
        freeShipping,
        currency,
        features,
        isBestSeller,
      });
    });

    return productList;
  } catch (error: any) {
    throw new Error(`Failed to scrape Google Shopping: ${error.message}`);
  }
}
