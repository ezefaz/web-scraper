'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeMLProductDetail(productUrl: any) {
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
    const response = await axios.get(productUrl, options);
    const $ = cheerio.load(response.data);

    const products = $('#ui-pdp-main-container')
      .map((index, element) => {
        const productTitle = $(element).find('.ui-pdp-title').text().trim();
        const subtitle = $(element).find('.ui-pdp-header__subtitle').text().trim();
        // const originalPrice = $(element).find('.andes-money-amount__fraction').text().trim();
        // const currentPrice = $(element).find('.andes-money-amount__fraction').next().text().trim();
        // const currentDollarPrice = $(element).find('.price-line-save_price .dollar_price').text().trim();
        // const originalDollarPrice = $(element).find('.price-line-list_price .dollar_price').text().trim();
        const productBrand = $(element).find('#product-brand').text();
        const productLink = $(element).find('.product-new-window').attr('href');
        const productImage = $(element).find('.ui-pdp-image.ui-pdp-gallery__figure__image').attr('src');
        const availabilityMessage = $(element).find('.detail-availability_message').text();
        const refurbishedMessage = $(element).find('.detail-refurbished_message').text();
        const returnMessage = $(element).find('.detail-return_message').text();
        const isBestSeller = $(element).find('.ui-pdp-promotions-pill-label__target').text();
        const rating = $(element).find('.ui-pdp-review__rating').text();
        const reviews = $(element).find('.ui-pdp-review__amount').text();

        return {
          title: productTitle,
          subtitle,
          brand: productBrand,
          // description: productDescription,
          // currentPrice,
          // originalPrice,
          url: productLink,
          image: productImage,
          // vendorsName,
          returnMessage,
          availabilityMessage,
          refurbishedMessage,
          isBestSeller,
          rating,
          reviews,
        };
      })
      .get();

    console.log(products);

    return products;
  } catch (error: any) {
    throw new Error(`Failed to scrape internacional product value: ${error.message}`);
  }
}
