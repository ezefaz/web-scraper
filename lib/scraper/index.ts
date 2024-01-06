'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';
import {
  extractCategories,
  extractCategory,
  extractCurrency,
  extractDescription,
  extractPrice,
  extractStars,
} from '../utils';
import { scrapeDolarValue } from './dolar';
import { getCurrentUser } from '../actions';

export async function scrapeMLProduct(url: string) {
  if (!url) return;

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

  const user = await getCurrentUser();

  try {
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    const currentDolarValue = await scrapeDolarValue();

    const title = $('.ui-pdp-title').text().trim();

    const prices = $('.andes-money-amount.ui-pdp-price__part .andes-money-amount__fraction');

    const originalPrices = prices.map((index, element) => $(element).text().trim()).get();
    let firstOriginalPrice = originalPrices[0];

    const originalPrice = parseFloat(String(firstOriginalPrice).replace(/,/g, '').replace(/\./g, ''));

    let currentPrice = $('meta[itemprop="price"]').attr('content');

    const isOutOfStock =
      $('.ui-pdp-color--BLACK.ui-pdp-size--SMALL.ui-pdp-family--SEMIBOLD.ui-pdp-stock-information__title')
        .text()
        .trim()
        .toLowerCase() !== 'stock disponible';

    const images = $('.ui-pdp-image.ui-pdp-gallery__figure__image') || $('.ui-pdp-image');

    const imageUrls: string[] = [];

    images.each((index, element) => {
      const imageUrl = $(element).attr('src');
      if (imageUrl) {
        imageUrls.push(imageUrl);
      }
    });

    const currency = extractCurrency($('.andes-money-amount__currency-symbol'));

    const discountElements = $('.andes-money-amount__discount');
    const discounts = discountElements.map((index, element) => $(element).text().trim()).get();
    const discountRate = discounts.length > 0 ? discounts[0].replace(/[\s%]*OFF$/, '') : '';

    const reviewsCountText = $('.ui-pdp-review__amount').text();
    const reviewsCount = reviewsCountText ? parseInt(reviewsCountText.replace(/\D+/g, ''), 10) : 0;

    // const starsText = $('.ui-pdp-review__rating').text();
    // const stars = extractStarRatings($);
    // const stars = parseFloat(starsText);

    // DESCRIPTION

    const description = extractDescription($);

    // RATING
    const stars = extractStars($);

    const stockAvailable =
      $('.ui-pdp-buybox__quantity__available')
        .text()
        ?.match(/\(([^)]+)\)/)?.[1] || '';

    let isFreeReturning = false;
    let isFreeShipping = false;

    const shippingElements = $('.ui-pdp-color--GREEN.ui-pdp-family--SEMIBOLD');
    const returningElements = $('.ui-pdp-action-modal__link');

    shippingElements.each((index, tag) => {
      const text = $(tag).text().toLowerCase().trim();
      if (text.includes('gratis')) {
        isFreeShipping = true;
        return false;
      }
    });

    returningElements.each((index, tag) => {
      const text = $(tag).text().toLowerCase().trim();

      if (text.includes('gratis')) {
        isFreeReturning = true;
        return false;
      }
    });

    const statusElement = $('.ui-pdp-subtitle');
    const statusText = statusElement.text().trim();
    const status = statusText.split(' ')[0];

    const storeNameElement = $('.ui-pdp-action-modal__link .ui-pdp-color--BLUE.ui-pdp-family--REGULAR').first();
    const storeName = storeNameElement.text();

    const categories = extractCategory($);
    // const category = categories[4].length > 1 ? categories[4] : categories[0];
    const category = categories[0];

    const today = new Date();

    const data = {
      url,
      currency: currency || '$',
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      currentDolar: { value: Number(currentDolarValue), date: today },
      priceHistory: [],
      dolarHistory: [],
      discountRate: Number(discountRate),
      category: category || '',
      reviewsCount: reviewsCount || 0,
      stars: stars || 4.5,
      stockAvailable: stockAvailable && !isOutOfStock ? stockAvailable : '1',
      isOutOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
      users: user ? [user] : [],
      isFreeReturning,
      storeName,
      status,
      isFreeShipping,
    };

    // console.log('PRODUCTO -->', data);

    return data;
  } catch (error: any) {
    throw new Error(`Failed to scrape product; ${error.message}`);
  }
}
