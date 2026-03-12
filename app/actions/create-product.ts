"use server";

import { getCurrentUser } from "@/lib/actions";
import Product from "@/lib/models/product.model";
import { connectToDb } from "@/lib/mongoose";
import { scrapeMLProduct } from "@/lib/scraper";
import { ProductType } from "@/types";

export const createProduct = async (productUrl: string) => {
  const normalizedUrl = productUrl?.trim();
  if (!normalizedUrl) {
    return { error: "URL de producto inválida." };
  }

  try {
    await connectToDb();

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        requiresAuth: true,
        error: "Necesitas una cuenta para guardar productos.",
      };
    }

    const data: any = await scrapeMLProduct(normalizedUrl);
    if (!data?.url) {
      return { error: "No pudimos obtener información del producto." };
    }

    const existingProduct = await Product.findOne({ url: data.url });
    const isProductAlreadyAdded =
      currentUser?.products?.some((product: ProductType) => product.url === data.url) ?? false;

    if (isProductAlreadyAdded) {
      return {
        alreadySaved: true,
        message: "Este producto ya estaba en tus guardados.",
      };
    }

    const productToSave = existingProduct ?? (await Product.create(data));
    const productSnapshot = {
      ...data,
      isFollowing: true,
    };
    currentUser.products.push(productSnapshot);
    await currentUser.save();

    return {
      success: true,
      message: "El producto fue añadido correctamente.",
      productId: String(productToSave._id),
    };
  } catch (error) {
    console.log("[CREATE_PRODUCT_ERROR]", error);
    return { error: "No pudimos guardar el producto. Intenta nuevamente." };
  }
};
