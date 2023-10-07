'use server'

import axios from "axios";
import * as cheerio from 'cheerio'
import { extractCurrency, extractDescription, extractPrice } from "../utils";


export async function scrapeMLProduct(url: string) {
    if (!url) return;    

    // bright data proxy configuration
    const username = String(process.env.BRIGHT_DATA_USERNAME)
    const password = String(process.env.BRIGHT_DATA_PASSWORD)
    const port = 22225
    const session_id = (1000000 * Math.random()) | 0;

    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password: password
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnathorized: false,
    }

    try {

    const response = await axios.get(url, options)
    const $ = cheerio.load(response.data)
     
    const title = $('.ui-pdp-title').text().trim(); 
    // const currentPrice = extractPrice(
    //     $('.andes-money-amount__fraction'),
    //     $('.andes-visually-hidden'),
    //     $('.andes-money-amount__fraction'),
    //     $('.ui-pdp-price__second-line'),
    //     $('.ui-pdp-price__main-container'),
    // );
    const currentPrice = $('meta[itemprop="price"]').attr('content');
    
    const isOutOfStock = $('.ui-pdp-color--BLACK.ui-pdp-size--SMALL.ui-pdp-family--SEMIBOLD.ui-pdp-stock-information__title').text().trim().toLowerCase() !== 'stock disponible';  
    
    const images = 
    $('.ui-pdp-image.ui-pdp-gallery__figure__image') ||
    $('.ui-pdp-image');


    const imageUrls: string[] = []
    
    images.each((index, element) => {
      const imageUrl = $(element).attr('src');
      if (imageUrl) {
        imageUrls.push(imageUrl);
      }
    });

    const currency = extractCurrency($('.andes-money-amount__currency-symbol'))

    const discountRate = $('.andes-money-amount__discount').text().replace(/[\s%]*OFF$/, '');

    const originalPrice = currentPrice ? (currentPrice * 100) / (100 - discountRate) : '';

    const description = extractDescription($)

  // Construct data object with scraped information

  const data = {
    url,
    currency: currency || '$',
    image: imageUrls[0],
    title,
    currentPrice: Number(currentPrice) || Number(originalPrice),
    originalPrice: Number(originalPrice) || Number(currentPrice),
    priceHistory: [],
    discountRate: Number(discountRate),
    category: 'category',
    reviewsCount: 0,
    stars: 4.5,
    isOutOfStock,
    description,
    lowestPrice: Number(currentPrice) ||  Number(originalPrice),
    highestPrice: Number(originalPrice) || Number(currentPrice),
    averagePrice:  Number(currentPrice) ||  Number(originalPrice),
  }

  console.log('DATA', data);

  return data;
  
        
    } catch (error: any) {
        throw new Error(`Failed to scrape product; ${error.message}`)
    }

}