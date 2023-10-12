import { NextResponse } from "next/server";

import { getLowestPrice, getHighestPrice, getAveragePrice, getEmailNotifType, formatNumber, formatNumberWithCommas } from "@/lib/utils";
import { connectToDb } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { scrapeMLProduct } from "@/lib/scraper";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";

export const maxDuration = 10; // This function can run for a maximum of 300 seconds
export const dynamic = "force-dynamic";
export const revalidate = 0;

const MIN_VALID_PRICE = 4000;

export async function GET(request: Request) {
  
  try {
    connectToDb();

    const products = await Product.find({});

    if (!products) throw new Error("No product fetched");

    // ======================== 1 SCRAPE LATEST PRODUCT DETAILS & UPDATE DB
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        // Scrape product
        const scrapedProduct = await scrapeMLProduct(currentProduct.url);       

        if (!scrapedProduct) return;

        const updatedPrice = scrapedProduct.currentPrice;

        console.log('PRECIO ACTUALIZADO ---> ', updatedPrice);

        if(!isNaN(updatedPrice) && updatedPrice >= MIN_VALID_PRICE) {
          const updatedPriceHistory = [];

          // Iterate through the price history
          for (const priceEntry of currentProduct.priceHistory) {
            if (priceEntry.price >= MIN_VALID_PRICE) {
              updatedPriceHistory.push(priceEntry);
            }
          }

          // Add the new price to the updated history
          updatedPriceHistory.push({ price: updatedPrice });
          
          console.log('HISTORIA DE PRECIO ACTUALIZADA', updatedPriceHistory);

          const product = {
            ...scrapedProduct,
            priceHistory: updatedPriceHistory,
            lowestPrice: getLowestPrice(updatedPriceHistory),
            highestPrice: getHighestPrice(updatedPriceHistory),
            averagePrice: getAveragePrice(updatedPriceHistory),
          };

          // Update Products in DB
          const updatedProduct = await Product.findOneAndUpdate(
            {
              url: product.url,
            },
            product
          );

          // ======================== 2 CHECK EACH PRODUCT'S STATUS & SEND EMAIL ACCORDINGLY
          const emailNotifType = getEmailNotifType(
            scrapedProduct,
            currentProduct
          );

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
        } else {
          console.log('Scraped price is not a valid number');
        }
      })
    );

    return NextResponse.json({
      message: "Ok",
      data: updatedProducts,
    });
  } catch (error: any) {
    throw new Error(`Failed to get all products: ${error.message}`);
  }
}
