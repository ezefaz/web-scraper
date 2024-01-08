import { NextResponse } from 'next/server';
import { getLowestPrice, getHighestPrice, getAveragePrice, getEmailNotifType } from '@/lib/utils';
import { connectToDb } from '@/lib/mongoose';
import Product from '@/lib/models/product.model';
import { scrapeMLProduct } from '@/lib/scraper';
import { generateEmailBody, sendEmail } from '@/lib/nodemailer';
import { CurrentDolar, PriceHistoryItem } from '@/types';

export const maxDuration = 20;
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
        const scrapedProduct = await scrapeMLProduct(currentProduct.url);

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
            return currentProduct.priceHistory;
          });

        const previousDolarHistory = currentProduct.dolarHistory;

        const updatedCurrentDolar: CurrentDolar = scrapedProduct.currentDolar;
        const updatedDolarValue = scrapedProduct.currentDolar.value;

        const updatedDolarHistory: any = [...previousDolarHistory, { value: updatedDolarValue, date: new Date() }];

        const filteredDolarHistory: any[] = [];

        // Filtering out entries with the same date and value
        updatedDolarHistory.forEach((item: any) => {
          const existingItem = filteredDolarHistory.find(
            (filteredItem) =>
              new Date(filteredItem.date).toISOString().split('T')[0] ===
                new Date(item.date).toISOString().split('T')[0] && filteredItem.value === item.value
          );
          if (!existingItem) {
            filteredDolarHistory.push(item);
          }
        });

        const existingUsers = currentProduct.users;

        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
          currentDolar: updatedCurrentDolar,
          dolarHistory: filteredDolarHistory,
          users: existingUsers,
        };

        const updatedProduct = await Product.findOneAndUpdate(
          {
            url: product.url,
          },
          product
        );

        // CHECK EACH PRODUCT'S STATUS & SEND EMAIL ACCORDINGLY
        const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct);

        if (
          (emailNotifType && currentProduct.users && currentProduct.users.length > 0) ||
          (emailNotifType && scrapedProduct.users && scrapedProduct.users.length > 0)
        ) {
          const productInfo = {
            title: updatedProduct.title,
            image: updatedProduct.image,
            url: updatedProduct.url,
          };

          const emailContent = await generateEmailBody(productInfo, emailNotifType);

          let userEmails = [];

          if (scrapedProduct.users && scrapedProduct.users.length > 0) {
            userEmails = scrapedProduct.users.map((user) => user.email);
          } else if (currentProduct.users && currentProduct.users.length > 0) {
            userEmails = currentProduct.users.map((user: any) => user.email);
          }

          if (userEmails.length > 0) {
            await sendEmail(emailContent, userEmails);
          }
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
