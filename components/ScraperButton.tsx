"use client";
import { scrapeGoogleShopping } from "@/lib/scraper/google";
import React, { useState } from "react";

interface ScraperButtonProps {
	productTitle: string;
}

const ScraperButton = ({ productTitle }: ScraperButtonProps) => {
	const [scrapingInProgress, setScrapingInProgress] = useState(false);

	const handleScrapeClick = async () => {
		setScrapingInProgress(true);
		try {
			const formattedProductTitle = productTitle.replace(/\s/g, "");

			const scrapedData = await scrapeGoogleShopping("iphone13promax");
			console.log("Scraped Data:", scrapedData);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setScrapingInProgress(false);
		}
	};

	return (
		<div>
			<button onClick={handleScrapeClick} disabled={scrapingInProgress}>
				{scrapingInProgress ? "Scraping..." : "Scrape Google Shopping"}
			</button>
		</div>
	);
};

export default ScraperButton;
