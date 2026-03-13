import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { scrapeMLProduct } from "@/lib/scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "@/lib/utils";

export const maxDuration = 60;
export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_CONCURRENCY = 3;

const getWeekKey = (date: Date) => {
  const normalizedDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  normalizedDate.setUTCDate(
    normalizedDate.getUTCDate() + 4 - (normalizedDate.getUTCDay() || 7),
  );
  const yearStart = new Date(Date.UTC(normalizedDate.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((normalizedDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return `${normalizedDate.getUTCFullYear()}-${weekNo}`;
};

const normalizeDolarValue = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) return null;
  return value < 20 ? value * 1000 : value;
};

const isAuthorized = (request: Request) => {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (cronSecret) {
    return authHeader === `Bearer ${cronSecret}`;
  }

  if (process.env.NODE_ENV === "production") return false;
  return true;
};

const mapWithConcurrency = async <T, R>(
  values: T[],
  limit: number,
  worker: (value: T, index: number) => Promise<R>,
) => {
  const results: R[] = new Array(values.length);
  let nextIndex = 0;

  const runWorker = async () => {
    while (nextIndex < values.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await worker(values[currentIndex], currentIndex);
    }
  };

  const workers = Array.from(
    { length: Math.max(1, Math.min(limit, values.length)) },
    () => runWorker(),
  );

  await Promise.all(workers);
  return results;
};

export async function GET(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { message: "Unauthorized cron request." },
        { status: 401 },
      );
    }

    await connectToDb();

    const products = await Product.find(
      {},
      { _id: 1, url: 1, priceHistory: 1, dolarHistory: 1, currentDolar: 1 },
    ).lean();

    if (!products.length) {
      return NextResponse.json({
        message: "No hay productos para actualizar.",
        updatedProducts: 0,
        pushedPriceHistory: 0,
        pushedDolarHistory: 0,
      });
    }

    const now = new Date();
    const currentWeekKey = getWeekKey(now);

    type UpdateOperation = {
      updateOne: {
        filter: { _id: any };
        update: {
          $set: Record<string, any>;
          $push?: Record<string, any>;
        };
      };
    };

    let skippedProducts = 0;
    let failedProducts = 0;
    let pushedPriceHistory = 0;
    let pushedDolarHistory = 0;
    const failureSamples: Array<{ url: string; reason: string }> = [];
    const skippedSamples: Array<{ url: string; reason: string; currentPrice?: number }> = [];
    const skippedByReason: Record<string, number> = {
      empty_scrape: 0,
      invalid_price: 0,
    };

    const operations = await mapWithConcurrency(products as any[], MAX_CONCURRENCY, async (currentProduct) => {
      try {
        const scrapedProduct: any = await scrapeMLProduct(currentProduct.url);
        if (!scrapedProduct) {
          skippedProducts += 1;
          skippedByReason.empty_scrape += 1;
          if (skippedSamples.length < 10) {
            skippedSamples.push({
              url: String(currentProduct?.url || ""),
              reason: "empty_scrape",
            });
          }
          return null;
        }

        const scrapedCurrentPrice = Number(scrapedProduct.currentPrice || 0);
        const scrapedOriginalPrice = Number(
          scrapedProduct.originalPrice || scrapedCurrentPrice || 0,
        );

        if (!Number.isFinite(scrapedCurrentPrice) || scrapedCurrentPrice <= 0) {
          skippedProducts += 1;
          skippedByReason.invalid_price += 1;
          if (skippedSamples.length < 10) {
            skippedSamples.push({
              url: String(currentProduct?.url || ""),
              reason: "invalid_price",
              currentPrice: scrapedCurrentPrice,
            });
          }
          return null;
        }

        const existingPriceHistory = Array.isArray(currentProduct.priceHistory)
          ? currentProduct.priceHistory
          : [];
        const lastPriceEntry = existingPriceHistory.length
          ? existingPriceHistory[existingPriceHistory.length - 1]
          : null;
        const lastPriceDate = lastPriceEntry?.date
          ? new Date(lastPriceEntry.date)
          : null;
        const lastPriceWeekKey =
          lastPriceDate && !Number.isNaN(lastPriceDate.getTime())
            ? getWeekKey(lastPriceDate)
            : null;

        const shouldPushPrice = lastPriceWeekKey !== currentWeekKey;
        const nextPriceHistory = shouldPushPrice
          ? [...existingPriceHistory, { price: scrapedCurrentPrice, date: now }]
          : existingPriceHistory;

        if (shouldPushPrice) pushedPriceHistory += 1;

        const scrapedDolarValue = normalizeDolarValue(
          Number(scrapedProduct?.currentDolar?.value),
        );
        const existingDolarHistory = Array.isArray(currentProduct.dolarHistory)
          ? currentProduct.dolarHistory
          : [];

        let nextCurrentDolar = currentProduct.currentDolar;
        let shouldPushDolar = false;

        if (scrapedDolarValue) {
          nextCurrentDolar = { value: scrapedDolarValue, date: now };

          const lastDolarEntry = existingDolarHistory.length
            ? existingDolarHistory[existingDolarHistory.length - 1]
            : null;
          const lastDolarDate = lastDolarEntry?.date
            ? new Date(lastDolarEntry.date)
            : null;
          const lastDolarWeekKey =
            lastDolarDate && !Number.isNaN(lastDolarDate.getTime())
              ? getWeekKey(lastDolarDate)
              : null;

          shouldPushDolar = lastDolarWeekKey !== currentWeekKey;
          if (shouldPushDolar) pushedDolarHistory += 1;
        }

        const updateOperation: UpdateOperation = {
          updateOne: {
            filter: { _id: currentProduct._id },
            update: {
              $set: {
                currency: scrapedProduct.currency || "$",
                image: scrapedProduct.image || "",
                title: scrapedProduct.title || "",
                currentPrice: scrapedCurrentPrice,
                originalPrice: scrapedOriginalPrice,
                discountRate: Number(scrapedProduct.discountRate || 0),
                description: scrapedProduct.description || "",
                category: scrapedProduct.category || "",
                reviewsCount: Number(scrapedProduct.reviewsCount || 0),
                stockAvailable: scrapedProduct.stockAvailable || "",
                stars: scrapedProduct.stars || "",
                isOutOfStock: Boolean(scrapedProduct.isOutOfStock),
                isFreeReturning: Boolean(scrapedProduct.isFreeReturning),
                isFreeShipping: Boolean(scrapedProduct.isFreeShipping),
                status: scrapedProduct.status || "",
                storeName: scrapedProduct.storeName || "",
                productReviews: Array.isArray(scrapedProduct.productReviews)
                  ? scrapedProduct.productReviews
                  : [],
                currentDolar: nextCurrentDolar,
                priceHistory: nextPriceHistory,
                lowestPrice: getLowestPrice(nextPriceHistory),
                highestPrice: getHighestPrice(nextPriceHistory),
                averagePrice: getAveragePrice(nextPriceHistory),
              },
            },
          },
        };

        if (shouldPushDolar && scrapedDolarValue) {
          updateOperation.updateOne.update.$push = {
            dolarHistory: { value: scrapedDolarValue, date: now },
          };
        }

        return updateOperation;
      } catch (error: any) {
        failedProducts += 1;
        if (failureSamples.length < 10) {
          failureSamples.push({
            url: String(currentProduct?.url || ""),
            reason: String(error?.message || "Unknown error"),
          });
        }
        return null;
      }
    });

    const validOperations = operations.filter(Boolean) as UpdateOperation[];

    if (validOperations.length) {
      await Product.bulkWrite(validOperations, { ordered: false });
    }

    return NextResponse.json({
      message: "Actualización semanal de productos completada.",
      productsFound: products.length,
      updatedProducts: validOperations.length,
      skippedProducts,
      failedProducts,
      pushedPriceHistory,
      pushedDolarHistory,
      skippedByReason,
      skippedSamples,
      failureSamples,
      week: currentWeekKey,
      executedAt: now.toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: `Error en cron semanal de productos: ${error?.message || "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}
