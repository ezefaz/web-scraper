'use server';

import { CurrentDolar, PriceHistoryItem, User } from '@/types';
import Product from '../models/product.model';
import { connectToDb } from '../mongoose';
import { scrapeMLProduct } from '../scraper';
import { getAveragePrice, getHighestPrice, getLowestPrice } from '../utils';
import { revalidatePath } from 'next/cache';
import { generateEmailBody, sendEmail } from '../nodemailer';
import { getServerSession } from 'next-auth';
import UserSchema from '../models/user.model';

export async function scrapeAndStoreProducts(productUrl: string) {
  if (!productUrl) return;

  try {
    connectToDb();

    const scrapedProduct = await scrapeMLProduct(productUrl);
    const currentUser = await getCurrentUser();

    if (!scrapedProduct) return;

    let product = scrapedProduct;

    console.log('PRODUCTO SCRAPEADO', product);

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    const getUserProducts = scrapedProduct.users.map((user: any) => {
      user.products.push(scrapedProduct);
      return user.products;
    });

    if (currentUser && existingProduct && !existingProduct.users) {
      existingProduct.users = scrapedProduct.users;
    }

    if (existingProduct) {
      console.log('SCRAPEADO PERO EL PRODCUTO 2', scrapedProduct.users);

      const updatedExistingUser = [...existingProduct.users, { products: getUserProducts }];

      const updatedDolar: CurrentDolar = scrapedProduct.currentDolar;

      const updatedDolarValue = scrapedProduct.currentDolar.value;

      const previousDolarHistory = existingProduct.dolarHistory || [];

      const updatedPriceHistory: any = [...existingProduct.priceHistory, { price: scrapedProduct.currentPrice }];

      const updatedDolarHistory: any = [...previousDolarHistory, { value: updatedDolarValue, date: new Date() }];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
        currentDolar: updatedDolar,
        dolarHistory: updatedDolarHistory,
        users: updatedExistingUser,
      };
    }

    console.log('PRODUCTITOT DATOS -->', product.users);

    const newProduct = await Product.findOneAndUpdate({ url: scrapedProduct.url }, product, {
      upsert: true,
      new: true,
    });

    console.log('PRODUCTO NUEVO DATOS -->', newProduct.users);

    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDb();

    const product = await Product.findOne({ _id: productId });

    if (!product) return;

    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  try {
    connectToDb();

    const products = await Product.find();

    const user = await getCurrentUser();

    console.log('PRODUCTOS DEL USUARIO', user.products);

    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectToDb();

    const currentProduct = await Product.findById(productId);

    if (!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
  try {
    const product = await Product.findById(productId);

    if (!product) return;

    const userExists = product.users.some((user: User) => user.email === userEmail);

    if (!userExists) {
      product.users.push({ email: userEmail });

      await product.save();

      const emailContent = await generateEmailBody(product, 'WELCOME');

      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return null;
    }
    const currentUserEmail = session.user.email;
    const user = await UserSchema.findOne({ email: currentUserEmail });

    return user;
  } catch (error) {
    console.log(error);
    throw new Error('Error retrieving the current user');
  }
}
