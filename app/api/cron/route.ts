import { NextResponse } from 'next/server';

import { getLowestPrice, getHighestPrice, getAveragePrice, getEmailNotifType } from '@/lib/utils';
import { connectToDb } from '@/lib/mongoose';
import Product from '@/lib/models/product.model';
import { scrapeMLProduct } from '@/lib/scraper';
import { generateEmailBody, sendEmail } from '@/lib/nodemailer';
import { PriceHistoryItem } from '@/types';

export const maxDuration = 300; // This function can run for a maximum of 300 seconds
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

        // console.log('PRODUCTITO CURRENT', currentProduct);

        const updatedPriceHistory = currentProduct.priceHistory.filter((priceItem: PriceHistoryItem) => {
          const price = parseInt(priceItem.price.toString().replace(/[^0-9]/g, ''), 10);
          return !isNaN(price) && Number.isInteger(price);
        });

        const currentPrice = parseInt(scrapedProduct.currentPrice.toString().replace(/[^0-9]/g, ''), 10);

        const product = {
          ...scrapedProduct,
          priceHistory: [...updatedPriceHistory, { price: currentPrice, date: new Date() }],
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        console.log('PRODUCTO NORMAL', product);

        // Update Products in DB
        const updatedProduct = await Product.findOneAndUpdate(
          {
            url: product.url,
          },
          product
        );

        console.log('PRODUCTO UPDATEADO', updatedProduct);

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
