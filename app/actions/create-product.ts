"use server";

import { getCurrentUser } from "@/lib/actions";
import Product from "@/lib/models/product.model";
import { connectToDb } from "@/lib/mongoose";
import { scrapeMLProduct } from "@/lib/scraper";
import { ProductType } from "@/types";

export const createProduct = async (productUrl: string) => {
  if (!productUrl) return;

  try {
    // await connectToDb();

    const data: any = await scrapeMLProduct(productUrl);

    const existingProduct = await Product.findOne({ url: data.url });
    const currentUser = await getCurrentUser();

    const isProductAlreadyAdded = currentUser.products.some(
      (product: ProductType) => product.url === data.url
    );

    if (existingProduct && currentUser && !isProductAlreadyAdded) {
      await currentUser.products.push(existingProduct);
      await currentUser.save();

      return { message: "El producto fue añadido correctamente." };
    }

    const newProduct = new Product(data);
    await newProduct.save();

    if (currentUser && !isProductAlreadyAdded) {
      await currentUser.products.push(newProduct);

      await currentUser.save();

      return { message: "El producto fue añadido correctamente." };
    } else {
      return { error: "El producto no pudo ser añadido o esta duplicado." };
    }
  } catch (error) {
    console.log("[CREATE_PRODUCT_ERROR]", error);
  }
};
