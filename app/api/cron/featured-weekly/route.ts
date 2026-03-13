import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import FeaturedSnapshot from "@/lib/models/featuredSnapshot.model";
import {
  buildFeaturedSnapshotFromProducts,
  FEATURED_CATEGORY_IDS,
  inferFeaturedCategoryFromProduct,
  type FeaturedCategories,
  type FeaturedCategoryId,
} from "@/lib/featured/engine";
import { scrapeMLProduct } from "@/lib/scraper";
import { scrapeProductSearchPageML } from "@/lib/scraper/product-search-page-ml";

export const maxDuration = 120;
export const dynamic = "force-dynamic";
export const revalidate = 0;

const MIN_ITEMS_PER_CATEGORY = 2;
const MAX_SEED_URLS = 12;

const SEED_QUERIES: Record<FeaturedCategoryId, string[]> = {
  tech: [
    "iphone samsung celular",
    "notebook laptop",
    "auriculares inalambricos",
  ],
  gaming: [
    "playstation 5",
    "mouse gamer",
    "teclado gamer",
    "xbox series",
  ],
  sneakers: [
    "zapatillas nike running",
    "zapatillas adidas hombre",
    "zapatillas deportivas mujer",
  ],
  appliances: [
    "freidora de aire",
    "pava electrica",
    "aspiradora robot",
    "cafetera",
  ],
};

function isAuthorizedCronRequest(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== "production") return true;

  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;

  return authHeader === `Bearer ${cronSecret}`;
}

function countByCategory(categories: FeaturedCategories): Record<FeaturedCategoryId, number> {
  return FEATURED_CATEGORY_IDS.reduce(
    (acc, category) => {
      acc[category] = Array.isArray(categories[category]) ? categories[category].length : 0;
      return acc;
    },
    { tech: 0, gaming: 0, sneakers: 0, appliances: 0 },
  );
}

function getDeficits(counts: Record<FeaturedCategoryId, number>): Record<FeaturedCategoryId, number> {
  return FEATURED_CATEGORY_IDS.reduce(
    (acc, category) => {
      acc[category] = Math.max(MIN_ITEMS_PER_CATEGORY - (counts[category] || 0), 0);
      return acc;
    },
    { tech: 0, gaming: 0, sneakers: 0, appliances: 0 },
  );
}

function hasCoverageGaps(categories: FeaturedCategories): boolean {
  const counts = countByCategory(categories);
  return FEATURED_CATEGORY_IDS.some((category) => counts[category] < MIN_ITEMS_PER_CATEGORY);
}

async function collectSeedUrls(deficits: Record<FeaturedCategoryId, number>): Promise<string[]> {
  const globalSeen = new Set<string>();
  const byCategory: Record<FeaturedCategoryId, string[]> = {
    tech: [],
    gaming: [],
    sneakers: [],
    appliances: [],
  };

  for (const category of FEATURED_CATEGORY_IDS) {
    if (deficits[category] <= 0) continue;

    for (const query of SEED_QUERIES[category]) {
      if (globalSeen.size >= MAX_SEED_URLS) break;
      if (byCategory[category].length >= deficits[category] * 3) break;

      const results = await scrapeProductSearchPageML(query);
      for (const result of results) {
        const url = String(result?.url || "").trim();
        if (!url || globalSeen.has(url)) continue;

        const guessedCategory = inferFeaturedCategoryFromProduct({
          title: result?.title || "",
          category: "",
        });

        // Keep category quality for narrow tabs, allow broader matches for tech.
        if (category !== "tech" && guessedCategory !== category) continue;

        globalSeen.add(url);
        byCategory[category].push(url);

        if (globalSeen.size >= MAX_SEED_URLS) break;
        if (byCategory[category].length >= deficits[category] * 3) break;
      }
    }
  }

  const prioritized: string[] = [];
  for (const category of FEATURED_CATEGORY_IDS) {
    const needed = Math.max(deficits[category], 1);
    prioritized.push(...byCategory[category].slice(0, needed * 2));
  }

  return Array.from(new Set(prioritized)).slice(0, MAX_SEED_URLS);
}

async function seedProducts(urls: string[]): Promise<number> {
  let seeded = 0;

  for (const url of urls) {
    try {
      const scraped: any = await scrapeMLProduct(url);
      if (!scraped?.url || !scraped?.title || !scraped?.image) continue;

      await Product.findOneAndUpdate(
        { url: scraped.url },
        {
          $set: {
            url: scraped.url,
            currency: scraped.currency,
            image: scraped.image,
            title: scraped.title,
            currentPrice: scraped.currentPrice,
            originalPrice: scraped.originalPrice,
            currentDolar: scraped.currentDolar,
            discountRate: scraped.discountRate,
            category: scraped.category,
            reviewsCount: scraped.reviewsCount,
            stars: scraped.stars,
            stockAvailable: scraped.stockAvailable,
            isOutOfStock: scraped.isOutOfStock,
            description: scraped.description,
            lowestPrice: scraped.lowestPrice,
            highestPrice: scraped.highestPrice,
            averagePrice: scraped.averagePrice,
            isFreeReturning: scraped.isFreeReturning,
            storeName: scraped.storeName,
            status: scraped.status,
            isFreeShipping: scraped.isFreeShipping,
            productReviews: scraped.productReviews,
          },
          $setOnInsert: {
            priceHistory: [],
            dolarHistory: [],
            users: [],
          },
        },
        { upsert: true, setDefaultsOnInsert: true },
      );

      seeded += 1;
    } catch (error) {
      console.error("[CRON_FEATURED_WEEKLY_SEED_ITEM]", { url, error });
    }
  }

  return seeded;
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthorizedCronRequest(request)) {
      return NextResponse.json(
        { message: "Unauthorized cron request." },
        { status: 401 },
      );
    }

    await connectToDb();

    let products = await Product.find({
      image: { $exists: true, $ne: "" },
      title: { $exists: true, $ne: "" },
      currentPrice: { $exists: true, $gt: 0 },
    })
      .sort({ updatedAt: -1 })
      .limit(4000)
      .lean();

    const categories = buildFeaturedSnapshotFromProducts(products, {
      maxTotal: 10,
      maxPerCategory: 10,
    });

    let seededCandidates = 0;
    let seededProducts = 0;
    let nextCategories = categories;

    if (hasCoverageGaps(categories)) {
      const deficits = getDeficits(countByCategory(categories));
      const seedUrls = await collectSeedUrls(deficits);
      seededCandidates = seedUrls.length;

      if (seedUrls.length > 0) {
        seededProducts = await seedProducts(seedUrls);
      }

      if (seededProducts > 0) {
        products = await Product.find({
          image: { $exists: true, $ne: "" },
          title: { $exists: true, $ne: "" },
          currentPrice: { $exists: true, $gt: 0 },
        })
          .sort({ updatedAt: -1 })
          .limit(4500)
          .lean();

        nextCategories = buildFeaturedSnapshotFromProducts(products, {
          maxTotal: 10,
          maxPerCategory: 10,
        });
      }
    }

    const totalOffers = Object.values(nextCategories).reduce(
      (sum, list) => sum + list.length,
      0,
    );

    const generatedAt = new Date();

    await FeaturedSnapshot.findOneAndUpdate(
      { scope: "homepage" },
      {
        categories: nextCategories,
        generatedAt,
        totalOffers,
        sourceProducts: products.length,
        criteriaVersion: "v1-weekly-scored",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();

    return NextResponse.json({
      ok: true,
      message: "Featured snapshot weekly updated.",
      generatedAt,
      totalOffers,
      sourceProducts: products.length,
      seededCandidates,
      seededProducts,
    });
  } catch (error: any) {
    console.error("[CRON_FEATURED_WEEKLY]", error);
    return NextResponse.json(
      {
        ok: false,
        message: `Error en cron semanal de destacados: ${
          error?.message || "Unknown error"
        }`,
      },
      { status: 500 },
    );
  }
}
