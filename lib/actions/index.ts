'use server'

import Product from "../models/product.model";
import { connectToDb } from "../mongoose";
import { scrapeMLProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { revalidatePath } from "next/cache";

export async function scrapeAndStoreProducts(productUrl: string) {
    if (!productUrl) return;

    try {
        connectToDb();

        const scrapedProduct = await scrapeMLProduct(productUrl);

        console.log('ESTA ENTRANDO ACA??', scrapedProduct);

        if(!scrapedProduct) return;

        let product = scrapedProduct;

        const existingProduct = await Product.findOne({ url: scrapedProduct.url })

        if (existingProduct) {
            const updatedPriceHistory: any = [
                ...existingProduct.priceHistory,
                { price: scrapedProduct.currentPrice }
            ]

            product = {
                ...scrapedProduct,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory),
            }
        }


        console.log('ESTA ENTRANDO ACA??');
        

        const newProduct = await Product.findOneAndUpdate({ url: scrapedProduct.url },
            product,
            { upsert: true, new: true }
        );

        revalidatePath(`/products/${newProduct._id}`);


    } catch (error: any) {
        throw new Error(`Failed to create/update product: ${error.message}`)
    }
}


export async function getProductById(productId: string) {
    try {
        connectToDb();

        const product = await Product.findOne({ _id: productId })

        if (!product) return;

        return product;
    } catch (error) {
        console.log(error);
        
    }
}