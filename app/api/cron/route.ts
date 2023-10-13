import { NextResponse } from 'next/server';

import { getLowestPrice, getHighestPrice, getAveragePrice, getEmailNotifType } from '@/lib/utils';
import { connectToDb } from '@/lib/mongoose';
import Product from '@/lib/models/product.model';
import { scrapeMLProduct } from '@/lib/scraper';
import { generateEmailBody, sendEmail } from '@/lib/nodemailer';
import { PriceHistoryItem } from '@/types';

export const maxDuration = 10; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    connectToDb();

    const products = await Product.find({});

    if (!products) throw new Error('No product fetched');

    // ======================== 1 SCRAPE LATEST PRODUCT DETAILS & UPDATE DB
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        // Scrape product
        const scrapedProduct = await scrapeMLProduct(currentProduct.url);

        if (!scrapedProduct) return;

        const updatedPriceHistory = currentProduct.priceHistory
          .map((priceItem: PriceHistoryItem) => {
            const priceString = priceItem.price ? priceItem.price.toString() : '';
            return {
              price: parseInt(priceString.replace('.', ''), 10),
              date: priceItem.date,
              _id: priceItem._id,
            };
          })
          .filter((priceItem: PriceHistoryItem) => Number.isInteger(priceItem.price) && priceItem.price >= 100000);

        const currentPrice: number = parseInt(scrapedProduct.currentPrice.toString().replace('.', ''), 10);

        const product = {
          ...scrapedProduct,
          priceHistory: [...updatedPriceHistory, { price: currentPrice, date: new Date() }],
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };
        // Update Products in DB

        console.log('PRODUCTO ACTUALIZADO CRON -->', product);
        const updatedProduct = await Product.findOneAndUpdate(
          {
            url: product.url,
          },
          product
        );

        // ======================== 2 CHECK EACH PRODUCT'S STATUS & SEND EMAIL ACCORDINGLY
        const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct);

        if (emailNotifType && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };
          // Construct emailContent
          const emailContent = await generateEmailBody(productInfo, emailNotifType);
          // Get array of user emails
          const userEmails = updatedProduct.users.map((user: any) => user.email);
          // Send email notification
          await sendEmail(emailContent, userEmails);
        }

        return updatedProduct;
      })
    );

    return NextResponse.json({
      message: 'Ok',
      data: updatedProducts,
    });
  } catch (error: any) {
    throw new Error(`Failed to get all products: ${error.message}`);
  }
}
