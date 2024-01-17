'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeTiendamiaProduct(productUrl: any) {
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
    console.log(productUrl);

    const response = await axios.get(productUrl, options);
    const $ = cheerio.load(response.data);

    const products = $('.product-data-container')
      .map((index, element) => {
        const productTitle = $(element).find('#product-name').text().trim();
        const originalPrice = $(element).find('.price-line-list_price .currency_price').text().trim();
        const currentPrice = $(element).find('.price-line-final_price .currency_price').text().trim();
        const currentDollarPrice = $(element).find('.price-line-save_price .dollar_price').text().trim();
        const originalDollarPrice = $(element).find('.price-line-list_price .dollar_price').text().trim();
        const productBrand = $(element).find('#product-brand').text();
        const productLink = $(element).find('.product-new-window').attr('href');
        const productImage = $(element).find('.product-image .cloud-zoom').attr('href');
        const availabilityMessage = $(element).find('.detail-availability_message').text();
        const refurbishedMessage = $(element).find('.detail-refurbished_message').text();
        const returnMessage = $(element).find('.detail-return_message').text();
        const vendorsName = $(element).find('.detail-vendor_name');
        // const productDescription = $(element).find('.limited-list list-detail.detail-short_desc opened"').text();

        const url: string = 'http://tiendamia.com';

        return {
          title: productTitle,
          brand: productBrand,
          // description: productDescription,
          currentPrice,
          originalPrice,
          currentDollarPrice,
          originalDollarPrice,
          url: productLink,
          image: productImage,
          // vendorsName,
          returnMessage,
          availabilityMessage,
          refurbishedMessage,
        };
      })
      .get();

    console.log(products);

    return products;
  } catch (error: any) {
    throw new Error(`Failed to scrape internacional product value: ${error.message}`);
  }
}
