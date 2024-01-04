'use server';

import { CurrentDolar, ProductType, UserType } from '@/types';
import Product from '../models/product.model';
import { connectToDb } from '../mongoose';
import { scrapeMLProduct } from '../scraper';
import { getAveragePrice, getHighestPrice, getLowestPrice } from '../utils';
import { revalidatePath } from 'next/cache';
import { generateEmailBody, sendEmail } from '../nodemailer';
// import { getServerSession } from "next-auth";
import { permanentRedirect, redirect } from 'next/navigation';
import User from '../models/user.model';
import { auth } from '@/auth';

export async function scrapeAndStoreProducts(productUrl: string) {
  if (!productUrl) return;

  try {
    connectToDb();

    const scrapedProduct = await scrapeMLProduct(productUrl);
    const currentUser = await getCurrentUser();

    if (!scrapedProduct) return;

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    const userProducts =
      scrapedProduct.users.length > 0
        ? scrapedProduct.users.map((user: any) => {
            user.products.push(scrapedProduct);
            return user.products;
          })
        : null;

    if (currentUser && existingProduct && !existingProduct.users) {
      existingProduct.users = scrapedProduct.users;
    }

    if (existingProduct) {
      const updatedExistingUser = [...existingProduct.users, { products: userProducts }];

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

    const newProduct = await Product.findOneAndUpdate({ url: scrapedProduct.url }, product, {
      upsert: true,
      new: true,
    });

    if (currentUser) {
      const user = await User.findOne({ email: currentUser.email });

      if (user && user.products) {
        const existingProduct = user.products.find((p: any) => p.url === scrapedProduct.url);

        if (!existingProduct) {
          await User.findOneAndUpdate({ email: currentUser.email }, { $addToSet: { products: scrapedProduct } });
        }
      }
    }

    revalidatePath(`/products/${newProduct._id}`);
    return newProduct._id.toString();
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
    console.log('[GET_PRODUCT_ID]', error);
  }
}

export async function deleteProduct(productId: string) {
  try {
    await connectToDb();

    const deletedProduct = await Product.findOneAndDelete({ _id: productId });

    if (!deletedProduct) {
      throw new Error('Product not found');
    }

    return deletedProduct.id;
  } catch (error: any) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }
}

export async function getAllProducts() {
  try {
    connectToDb();

    const products = await Product.find();

    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getProductsForDashboard() {
  try {
    const products = await Product.find();

    const dashboardProducts = products.map((product) => ({
      id: product._id.toString(),
      image: product.image,
      currentPrice: product.currentPrice,
      stock: product.stockAvailable,
      title: product.title,
      createdAt: product.createdAt,
      url: product.url,
    }));

    return dashboardProducts;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getUsersForDashboard() {
  try {
    const users = await User.find();

    const dashboardUsers = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified.toISOString(),
      products: user.products.length,
      createdAt: user.createdAt.toISOString(),
      role: user.role,
    }));

    return dashboardUsers;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getUserProducts() {
  try {
    const user: any = await getCurrentUser();

    const products = await getAllProducts();
    const userProducts: ProductType[] = [];

    if (user && products && products.length > 0) {
      for (const product of products) {
        const productHasUser = product.users?.find((productUser: any) => productUser.email === user.email);

        if (productHasUser) {
          userProducts.push(product);
        }
      }
    }

    // console.log("User's Products:", userProducts);

    return userProducts;
  } catch (error) {
    console.log('El usuario no tiene productos');
  }
}

export async function searchUserProducts(searchTerm: string) {
  try {
    const user: any = await getCurrentUser();

    if (!user) throw new Error('Usuario no encontrado');

    const userProducts: Array<ProductType> = (await getUserProducts()) ?? [];

    if (!userProducts) console.log('El usuario no tiene productos.');

    const filteredProducts = userProducts.filter((product: any) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredProducts;
  } catch (error: any) {
    throw new Error(`Failed to search user products: ${error.message}`);
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
    const product = await getProductById(productId);

    if (!product) return;

    const userExists: boolean = product.users.some((user: UserType) => user.email === userEmail);

    if (userExists) {
      product.users.push({ email: userEmail, isFollowing: true });

      await product.save();

      const emailContent = await generateEmailBody(product, 'WELCOME');
      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log('[ADD_USER_EMAIL_TO_PRODUCT]', error);
  }
}

export async function getCurrentUser() {
  try {
    const session = await auth();
    // const user = await currentUser();
    if (!session) return null;

    const currentUserEmail = session.user?.email;

    const userDb = await User.findOne({ email: currentUserEmail });

    return userDb;
  } catch (error) {
    console.log(error);
    throw new Error('[GET_CURRENT_USER] Error retrieving the current user');
  }
}
