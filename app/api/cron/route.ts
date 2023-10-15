import { NextResponse } from 'next/server';
import { getLowestPrice, getHighestPrice, getAveragePrice, getEmailNotifType } from '@/lib/utils';
import { connectToDb } from '@/lib/mongoose';
import Product from '@/lib/models/product.model';
import { scrapeMLProduct } from '@/lib/scraper';
import { generateEmailBody, sendEmail } from '@/lib/nodemailer';
import { PriceHistoryItem } from '@/types';
import { scrapeDolarValue } from '@/lib/scraper/dolar';

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
        const currentDolarValue = await scrapeDolarValue();

        if (!scrapedProduct) return;

        const updatedPriceHistory = currentProduct.priceHistory
          .filter((priceItem: PriceHistoryItem) => priceItem && priceItem.price !== undefined)
          .map((priceItem: PriceHistoryItem) => {
            const price = priceItem.price ? parseInt(priceItem.price.toString().replace(/[^0-9]/g, ''), 10) : null;
            if (price !== null && !isNaN(price)) {
              return {
                price,
                date: priceItem.date,
                _id: priceItem._id,
              };
            }
            return null;
          })
          .filter(
            (priceItem: PriceHistoryItem | null) =>
              priceItem !== null && Number.isInteger(priceItem.price) && priceItem.price >= 100000
          );

        const currentPrice = scrapedProduct.currentPrice
          ? parseInt(scrapedProduct.currentPrice.toString().replace(/[^0-9]/g, ''), 10)
          : null;
        if (currentPrice === null || isNaN(currentPrice)) {
          throw new Error('Current price is not available or not a valid number.');
        }

        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
          currentDolarValue,
        };

        console.log('PRODUCTO OBTENIDO CON CRON -->', currentDolarValue);

        // Update Products in DB
        const updatedProduct = await Product.findOneAndUpdate(
          {
            url: product.url,
          },
          product
        );

        // CHECK EACH PRODUCT'S STATUS & SEND EMAIL ACCORDINGLY
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
