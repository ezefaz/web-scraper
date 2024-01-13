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
import { getUserByEmail } from '@/data/user';

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
      id: user._id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
      products: user.products.length,
      createdAt: user.createdAt ? user.createdAt.toISOString() : null,
      role: user.role,
    }));

    return dashboardUsers;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// export async function getUserProducts() {
//   try {
//     const user: any = await getCurrentUser();

//     const products = await getAllProducts();
//     const userProducts: ProductType[] = [];

//     if (user && products && products.length > 0) {
//       for (const product of products) {
//         const productHasUser = product.users?.find((productUser: any) => productUser.email === user.email);

//         if (productHasUser) {
//           userProducts.push(product);
//         }
//       }
//     }

//     // console.log("User's Products:", userProducts);

//     return userProducts;
//   } catch (error) {
//     console.log('El usuario no tiene productos');
//   }
// }

export async function deleteProduct(productId: string) {
  try {
    await connectToDb();
    const user: any = await getCurrentUser();

    const productToDelete = user.products.find((product: any) => product._id.toString() === productId);

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { products: { _id: productId } } },
      { new: true }
    );

    console.log(updatedUser);

    if (!updatedUser) {
      throw new Error("User not found or product not present in the user's products array");
    }

    if (!productToDelete || !productToDelete.url) {
      throw new Error('Product not found or missing URL');
    }

    const deletedProduct = await Product.findOneAndDelete({ url: productToDelete.url });

    if (!deletedProduct) {
      throw new Error('Product not found');
    }

    return deletedProduct.id;
  } catch (error: any) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }
}

export async function getUserProducts() {
  try {
    await connectToDb();
    const user: any = await getCurrentUser();

    if (!user) return;

    const userWithProducts = await User.findOne({ email: user.email }).populate('products');

    if (!userWithProducts) {
      throw new Error('User not found');
    }

    return userWithProducts.products;
  } catch (error: any) {
    throw new Error(`Failed to fetch user products: ${error.message}`);
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
    await connectToDb();
    const currentProduct = await Product.findById(productId);

    if (!currentProduct) return null;

    const similarProductsInSameCategory = await Product.find({
      _id: { $ne: productId },
      category: currentProduct.category,
    }).limit(3);

    if (similarProductsInSameCategory.length === 0) {
      const randomProducts = await Product.aggregate([{ $sample: { size: 3 } }]);
      return randomProducts;
    }

    return similarProductsInSameCategory;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching similar products');
  }
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
  try {
    const product = await getProductById(productId);
    const user = await getUserByEmail(userEmail);

    if (!product) return;

    const userExists: boolean = product.users.some((user: UserType) => user.email === userEmail);
    const userProduct = user.products.find((p: ProductType) => p.url === product.url);

    if (userExists) {
      product.users.push({ email: userEmail, isFollowing: true });

      await product.save();

      if (userProduct) {
        userProduct.isFollowing = true;

        await user.save();
      }

      if (userProduct.isFollowing) {
        const emailContent = await generateEmailBody(product, 'WELCOME');
        await sendEmail(emailContent, [userEmail]);
      }
    }
  } catch (error) {
    console.log('[ADD_USER_EMAIL_TO_PRODUCT]', error);
  }
}

export async function getCurrentUser() {
  try {
    const session = await auth();

    if (!session) return null;

    const currentUserEmail = session.user?.email;

    const userDb = await User.findOne({ email: currentUserEmail });

    return userDb;
  } catch (error) {
    console.log(error);
    throw new Error('[GET_CURRENT_USER] Error retrieving the current user');
  }
}

export async function unfollowProduct(productId: string) {
  const user = await getCurrentUser();
  // const product = await getProductById(productId);

  try {
    if (!user) return;

    // const userProduct: ProductType = await product.users.find((userProduct: any) => userProduct.email === user.email);
    const userProduct = user.products.find((product: any) => product._id.toString() === productId);

    if (userProduct) {
      userProduct.isFollowing = false;

      await user.save();
    }
  } catch (error) {
    console.log('[UNFOLLOW_PRODUCT_ERROR]', error);
  }
}

export async function followProduct(productId: string) {
  try {
    const user = await getCurrentUser();
    // const product = await getProductById(productId);

    if (!user) {
      console.log('Invalid parameters or missing data.');
      return;
    }

    const isAlreadyFollowing = user.products.some(
      (userProduct: any) => userProduct.email === user.email && userProduct.isFollowing
    );

    if (isAlreadyFollowing) {
      console.log('User is already following this product.');
      return;
    }

    // const productUser = product.users.find((userProduct: any) => userProduct.email === user.email);
    const productUser = user.products.find((product: any) => product._id.toString() === productId);

    if (productUser && !productUser.isFollowing) {
      productUser.isFollowing = true;

      await user.save();

      console.log('Successfully followed the product.');
    }
  } catch (error) {
    console.log('[FOLLOW_PRODUCT_ERROR]', error);
  }
}
