'use server'

import { scrapeMLProduct } from "../scraper";

export async function scrapeAndStoreProducts(productUrl: string) {
    if (!productUrl) return;

    try {
        const scrapeProduct = await scrapeMLProduct(productUrl)
    } catch (error: any) {
        throw new Error(`Failed to create/update product: ${error.message}`)
    }
}