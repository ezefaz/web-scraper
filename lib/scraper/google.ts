'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeGoogleShopping(productTitle: string) {
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

    const productList: any = [];
    $('.ui-search-layout.ui-search-layout--stack .ui-search-layout__item').each((index, element) => {
      const product = $(element);
      const title = product.find('.ui-search-item__title').text().trim();
      const url = product.find('a.ui-search-link').attr('href') || '';
      let priceLabel = product.find('.andes-money-amount').attr('aria-label');

      // Remove 'Antes' if it exists in the priceLabel
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

      const image = product.find('.ui-search-result-image__element').attr('data-src');

      productList.push({ url, title, price, image });
    });

    return productList;
  } catch (error: any) {
    throw new Error(`Failed to scrape Google Shopping: ${error.message}`);
  }
}
