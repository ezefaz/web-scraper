"use server";

import { getCurrentUser } from "@/lib/actions";
import Product from "@/lib/models/product.model";
import { connectToDb } from "@/lib/mongoose";
import { getPlanLimits, isFreePlan } from "@/lib/pricing/plans";
import { scrapeMLProduct } from "@/lib/scraper";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
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

    const limits = getPlanLimits(currentUser.subscription);
    const savedProductsCount = Array.isArray(currentUser.products)
      ? currentUser.products.length
      : 0;

    if (
      Number.isFinite(limits.maxSavedProducts) &&
      savedProductsCount >= limits.maxSavedProducts
    ) {
      return {
        requiresUpgrade: isFreePlan(currentUser.subscription),
        error: `Plan gratuito: puedes guardar y seguir hasta ${limits.maxSavedProducts} productos. Elimina uno o pasa a Premium para continuar.`,
      };
    }

    const productToSave = existingProduct ?? (await Product.create(data));
    const productSnapshot = {
      ...data,
      isFollowing: true,
    };
    currentUser.products.push(productSnapshot);
    await currentUser.save();

    if (currentUser.email) {
      try {
        const emailContent = await generateEmailBody(productSnapshot, "WELCOME");
        await sendEmail(emailContent, [currentUser.email]);
      } catch (emailError) {
        console.error("[WELCOME_EMAIL_ERROR]", emailError);
      }
    }

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
