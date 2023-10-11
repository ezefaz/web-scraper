"use server";

import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";

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
		host: "brd.superproxy.io",
		port,
		rejectUnathorized: false,
	};

	try {
		const response = await axios.get(url, options);
		const $ = cheerio.load(response.data);

		const title = $(".ui-pdp-title").text().trim();
		// const originalPrice = extractPrice(
		//     $('.andes-money-amount__fraction'),
		//     $('.andes-visually-hidden'),
		//     $('.andes-money-amount__fraction'),
		//     $('.ui-pdp-price__second-line'),
		//     $('.ui-pdp-price__main-container'),
		// );
		// const currentPrice: any = $('meta[itemprop="price"]').attr("content");

		const priceElements = $('.andes-money-amount__fraction');
		const prices = priceElements.map((index, element) => $(element).text().trim()).get();
		const originalPriceText = prices[0];
		const currentPriceText = prices[1];
		
		const originalPrice = parseFloat(originalPriceText);
		const currentPrice = parseFloat(currentPriceText);	

		const isOutOfStock =
			$(
				".ui-pdp-color--BLACK.ui-pdp-size--SMALL.ui-pdp-family--SEMIBOLD.ui-pdp-stock-information__title"
			)
				.text()
				.trim()
				.toLowerCase() !== "stock disponible";

		const images =
			$(".ui-pdp-image.ui-pdp-gallery__figure__image") || $(".ui-pdp-image");

		const imageUrls: string[] = [];

		images.each((index, element) => {
			const imageUrl = $(element).attr("src");
			if (imageUrl) {
				imageUrls.push(imageUrl);
			}
		});

		const currency = extractCurrency($(".andes-money-amount__currency-symbol"));

		const discountElements = $('.andes-money-amount__discount');
		const discounts = discountElements.map((index, element) => $(element).text().trim()).get();
		const discountRate = discounts[0].replace(/[\s%]*OFF$/, "");		

		// const discountRate: string = $(".andes-money-amount__discount")
		// 	.text()
		// 	.replace(/[\s%]*OFF$/, "");			

    const reviewsCountText = $('.ui-pdp-review__amount').text();
    const reviewsCount = parseInt(reviewsCountText.replace(/\D+/g, ''), 10);
    
    const starsText = $('.ui-pdp-review__rating').text();
    const stars = parseFloat(starsText);

	const description = extractDescription($);	

	const stockAvailable = $('.ui-pdp-buybox__quantity__available').text().replace(/\(([^)]+)\)/, '$1');	

const category = $('.andes-breadcrumb__link').text()
	console.log('CARCAGADA', category);
	
	
	// const discounts = discountElements.map((index, element) => $(element).text().trim()).get();
	// const discountRate = discounts[0].replace(/[\s%]*OFF$/, "");
	
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
    reviewsCount: reviewsCount || 0,
    stars: stars || 4.5,
    stockAvailable: stockAvailable && !isOutOfStock ? stockAvailable : '1',
    isOutOfStock,
    description,
    lowestPrice: Number(currentPrice) ||  Number(originalPrice),
    highestPrice: Number(originalPrice) || Number(currentPrice),
    averagePrice:  Number(currentPrice) ||  Number(originalPrice),
  }

//   console.log('PRODUCTO -->', data);

		return data;
	} catch (error: any) {
		throw new Error(`Failed to scrape product; ${error.message}`);
	}
}
