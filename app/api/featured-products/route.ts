import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProductCard = {
  id: string;
  url: string;
  image: string;
  store: string;
  name: string;
  price: number;
  oldPrice: number;
  discountRate: number;
  shipping: string;
  currency: string;
  updatedAt: string;
};

function computeDiscountRate(product: any): number {
  const currentPrice = Number(product?.currentPrice) || 0;
  const originalPrice = Number(product?.originalPrice) || 0;

  if (originalPrice > 0 && currentPrice > 0 && originalPrice > currentPrice) {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  return Math.max(0, Math.round(Number(product?.discountRate) || 0));
}

function getShippingLabel(product: any): string {
  if (product?.isFreeShipping) return "Envío full";
  if (product?.isFreeReturning) return "Devolución gratis";
  return "Consultar envío";
}

function getStoreName(product: any): string {
  const rawStore = String(product?.storeName || "").trim();
  if (!rawStore) return "Marketplace";

  const match = rawStore.match(/\((.*?)\)/);
  if (match?.[1]) return match[1].trim();
  return rawStore;
}

export async function GET() {
  try {
    await connectToDb();

    const products = await Product.find({
      image: { $exists: true, $ne: "" },
      title: { $exists: true, $ne: "" },
      currentPrice: { $exists: true, $gt: 0 },
    })
      .sort({ updatedAt: -1 })
      .limit(10)
      .lean();

    const data: ProductCard[] = products.map((product: any) => {
      const currentPrice = Number(product?.currentPrice) || 0;
      const oldPrice = Number(product?.originalPrice) || currentPrice;
      return {
        id: String(product?._id || ""),
        url: String(product?.url || ""),
        image: String(product?.image || ""),
        store: getStoreName(product),
        name: String(product?.title || "Producto"),
        price: currentPrice,
        oldPrice,
        discountRate: computeDiscountRate(product),
        shipping: getShippingLabel(product),
        currency: String(product?.currency || "$"),
        updatedAt: new Date(product?.updatedAt || Date.now()).toISOString(),
      };
    });

    return NextResponse.json({
      data,
      total: data.length,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[FEATURED_PRODUCTS_GET]", error);
    return NextResponse.json(
      { data: [], total: 0, error: "No se pudieron obtener los productos recientes." },
      { status: 500 },
    );
  }
}
