import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import FeaturedSnapshot from "@/lib/models/featuredSnapshot.model";
import {
  buildFeaturedSnapshotFromProducts,
  FEATURED_EMPTY_GROUPS,
} from "@/lib/featured/engine";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await connectToDb();

    const snapshot: any = await FeaturedSnapshot.findOne({ scope: "homepage" })
      .sort({ generatedAt: -1 })
      .lean();

    const existingTotalOffers = Number(snapshot?.totalOffers) || 0;
    if (snapshot?.categories && existingTotalOffers >= 6) {
      return NextResponse.json({
        data: snapshot.categories,
        generatedAt: snapshot.generatedAt,
        totalOffers: existingTotalOffers,
      });
    }

    // Self-heal if snapshot is missing or too short.
    const products = await Product.find({
      image: { $exists: true, $ne: "" },
      title: { $exists: true, $ne: "" },
      currentPrice: { $exists: true, $gt: 0 },
    })
      .sort({ updatedAt: -1 })
      .limit(1800)
      .lean();

    const categories = buildFeaturedSnapshotFromProducts(products, {
      maxTotal: 10,
      maxPerCategory: 10,
    });

    const totalOffers = Object.values(categories).reduce(
      (sum, list) => sum + list.length,
      0,
    );

    const generatedAt = new Date();
    await FeaturedSnapshot.findOneAndUpdate(
      { scope: "homepage" },
      {
        categories,
        generatedAt,
        totalOffers,
        sourceProducts: products.length,
        criteriaVersion: "v1-weekly-scored",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return NextResponse.json({ data: categories, generatedAt, totalOffers });
  } catch (error: any) {
    console.error("[FEATURED_PRODUCTS_GET]", error);
    return NextResponse.json(
      { data: FEATURED_EMPTY_GROUPS, error: "No se pudieron obtener los productos destacados." },
      { status: 500 },
    );
  }
}
