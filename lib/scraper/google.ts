"use server";

import axios from "axios";
import * as cheerio from "cheerio";

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
		host: "brd.superproxy.io",
		port,
		rejectUnathorized: false,
	};

	try {
		const searchUrl = `https://listado.mercadolibre.com.ar/iphone14pro`;

		const response = await axios.get(searchUrl);

		const html = response.data;
		const $ = cheerio.load(html);

		const productList: any = [];
		$(".ui-search-layout.ui-search-layout--stack .ui-search-layout__item").each(
			(index, element) => {
				const product = $(element);
				const title = product.find(".ui-search-item__title").text().trim();
				const price = product
					.find(".andes-money-amount__fraction")
					.text()
					.trim();
				const image = product
					.find(".ui-search-result-image__element")
					.attr("src");

				productList.push({ title, price, image });
			}
		);

		console.log(productList);
		return productList;
	} catch (error: any) {
		throw new Error(`Failed to scrape Google Shopping: ${error.message}`);
	}
}
