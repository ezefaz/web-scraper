import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { scrapeDolarValue } from "@/lib/scraper/dolar";

export const maxDuration = 60;
export const dynamic = "force-dynamic";
export const revalidate = 0;

const getWeekKey = (date: Date) => {
  const normalizedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  normalizedDate.setUTCDate(normalizedDate.getUTCDate() + 4 - (normalizedDate.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(normalizedDate.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((normalizedDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
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

export async function GET(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ message: "Unauthorized cron request." }, { status: 401 });
    }

    await connectToDb();

    const dolarScraped = await scrapeDolarValue();
    const dolarValue = normalizeDolarValue(Number(dolarScraped));

    if (!dolarValue) {
      return NextResponse.json(
        { message: "No se pudo obtener un valor de dólar válido." },
        { status: 502 },
      );
    }

    const now = new Date();
    const currentWeekKey = getWeekKey(now);

    const products = await Product.find({}, { _id: 1, dolarHistory: 1 }).lean();

    if (!products.length) {
      return NextResponse.json({
        message: "No hay productos para actualizar.",
        dolarValue,
        updatedProducts: 0,
        pushedHistory: 0,
      });
    }

    const setResult = await Product.updateMany(
      {},
      {
        $set: {
          currentDolar: {
            value: dolarValue,
            date: now,
          },
        },
      },
    );

    const pushOperations: any[] = products.flatMap((product: any) => {
      const history = Array.isArray(product.dolarHistory) ? product.dolarHistory : [];
      const lastHistoryEntry = history.length ? history[history.length - 1] : null;

      const lastDate = lastHistoryEntry?.date ? new Date(lastHistoryEntry.date) : null;
      const lastWeekKey = lastDate && !Number.isNaN(lastDate.getTime()) ? getWeekKey(lastDate) : null;
      const lastValue = Number(lastHistoryEntry?.value || 0);

      const shouldPushHistory = lastWeekKey !== currentWeekKey || lastValue !== dolarValue;
      if (!shouldPushHistory) return [];

      return [
        {
          updateOne: {
            filter: { _id: product._id },
            update: {
              $push: {
                dolarHistory: {
                  value: dolarValue,
                  date: now,
                },
              },
            },
          },
        },
      ];
    });

    if (pushOperations.length > 0) {
      await Product.bulkWrite(pushOperations, { ordered: false });
    }

    return NextResponse.json({
      message: "Actualización semanal de dólar completada.",
      dolarValue,
      productsFound: products.length,
      matchedCount: setResult.matchedCount,
      modifiedCount: setResult.modifiedCount,
      pushedHistory: pushOperations.length,
      week: currentWeekKey,
      executedAt: now.toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: `Error en cron semanal de dólar: ${error?.message || "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}
