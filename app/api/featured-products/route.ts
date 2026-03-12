import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongoose';
import Product from '@/lib/models/product.model';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type FeaturedCategoryId = 'electronics' | 'fashion' | 'food' | 'appliances';

type FeaturedProductItem = {
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

const EMPTY_GROUPS: Record<FeaturedCategoryId, FeaturedProductItem[]> = {
  electronics: [],
  fashion: [],
  food: [],
  appliances: [],
};

const CATEGORY_PATTERNS: Record<FeaturedCategoryId, RegExp[]> = {
  electronics: [
    /electr[oó]n/i,
    /smartphone|iphone|samsung|celular|m[oó]vil|notebook|laptop|tablet/i,
    /auricular|audio|monitor|tv|consola|gaming|playstation|xbox|c[aá]mara/i,
  ],
  fashion: [
    /moda|ropa|vestimenta|accesorio|calzado|zapat/i,
    /remera|campera|jean|pantal[oó]n|bolso|mochila|perfume|reloj/i,
  ],
  food: [
    /alimento|comida|bebida|supermercado|yerba|cafe|caf[eé]|harina|aceite/i,
    /leche|arroz|snack|golosina|at[uú]n|fideos|gallet/i,
  ],
  appliances: [
    /electrodom/i,
    /heladera|lavarropas|microondas|aspiradora|cafetera|freidora|licuadora/i,
    /hogar|cocina|aire acondicionado|calefacci[oó]n/i,
  ],
};

function inferCategory(product: any): FeaturedCategoryId {
  const categoryText = String(product?.category || '').toLowerCase();
  const titleText = String(product?.title || '').toLowerCase();
  const combined = `${categoryText} ${titleText}`;

  for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS) as [
    FeaturedCategoryId,
    RegExp[],
  ][]) {
    if (patterns.some((pattern) => pattern.test(combined))) {
      return category;
    }
  }

  return 'electronics';
}

function computeDiscountRate(product: any): number {
  const currentPrice = Number(product?.currentPrice) || 0;
  const originalPrice = Number(product?.originalPrice) || 0;

  if (originalPrice > 0 && currentPrice > 0 && originalPrice > currentPrice) {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  return Math.max(0, Math.round(Number(product?.discountRate) || 0));
}

function getShippingLabel(product: any): string {
  if (product?.isFreeShipping) return 'Envío gratis';
  if (product?.isFreeReturning) return 'Devolución gratis';
  return 'Consultar envío';
}

function getStoreName(product: any): string {
  const rawStore = String(product?.storeName || '').trim();
  if (!rawStore) return 'Marketplace';

  const match = rawStore.match(/\((.*?)\)/);
  if (match?.[1]) return match[1].trim();
  return rawStore;
}

export async function GET() {
  try {
    await connectToDb();

    const products = await Product.find({
      image: { $exists: true, $ne: '' },
      title: { $exists: true, $ne: '' },
      currentPrice: { $exists: true, $gt: 0 },
    })
      .sort({ updatedAt: -1 })
      .limit(240)
      .lean();

    const grouped: Record<FeaturedCategoryId, FeaturedProductItem[]> = {
      ...EMPTY_GROUPS,
    };

    for (const product of products) {
      const category = inferCategory(product);
      const currentPrice = Number(product?.currentPrice) || 0;
      if (!currentPrice) continue;

      const originalPrice = Number(product?.originalPrice) || currentPrice;
      const item: FeaturedProductItem = {
        id: String(product?._id),
        url: String(product?.url || ''),
        image: String(product?.image || ''),
        store: getStoreName(product),
        name: String(product?.title || 'Producto'),
        price: currentPrice,
        oldPrice: originalPrice,
        discountRate: computeDiscountRate(product),
        shipping: getShippingLabel(product),
        currency: String(product?.currency || '$'),
        updatedAt: new Date(product?.updatedAt || Date.now()).toISOString(),
      };

      grouped[category].push(item);
    }

    const featured = (Object.keys(grouped) as FeaturedCategoryId[]).reduce(
      (acc, category) => {
        acc[category] = grouped[category]
          .sort((a, b) => {
            if (b.discountRate !== a.discountRate) {
              return b.discountRate - a.discountRate;
            }
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          })
          .slice(0, 6);

        return acc;
      },
      { ...EMPTY_GROUPS },
    );

    return NextResponse.json({ data: featured });
  } catch (error: any) {
    console.error('[FEATURED_PRODUCTS_GET]', error);
    return NextResponse.json(
      { error: 'No se pudieron obtener los productos destacados.' },
      { status: 500 },
    );
  }
}
