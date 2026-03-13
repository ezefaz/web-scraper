export type FeaturedCategoryId = "tech" | "gaming" | "sneakers" | "appliances";

export type FeaturedProductItem = {
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
  demandScore: number;
  variationScore: number;
  impulseScore: number;
  totalScore: number;
  qualityTier: "strict" | "high" | "medium" | "broad";
};

export type FeaturedCategories = Record<FeaturedCategoryId, FeaturedProductItem[]>;

export const FEATURED_CATEGORY_IDS: FeaturedCategoryId[] = [
  "tech",
  "gaming",
  "sneakers",
  "appliances",
];

const EMPTY: FeaturedCategories = {
  tech: [],
  gaming: [],
  sneakers: [],
  appliances: [],
};

const CATEGORY_PATTERNS: Record<FeaturedCategoryId, RegExp[]> = {
  gaming: [
    /gaming|gamer|playstation|ps5|ps4|xbox|nintendo|switch|steam deck/i,
    /joystick|gamepad|mouse gamer|teclado gamer|silla gamer/i,
    /placa de video|gpu|rtx|monitor gamer|auricular gamer/i,
  ],
  sneakers: [
    /zapatilla|zapatillas|sneaker|sneakers|running|deportiva|nike|adidas|puma/i,
    /new balance|asics|under armour|jordan/i,
  ],
  appliances: [
    /electrodom/i,
    /pava el[eé]ctrica|freidora de aire|air fryer|aspiradora|robot aspiradora/i,
    /cafetera|microondas|lavarropas|heladera|licuadora|procesadora/i,
  ],
  tech: [
    /tecnolog/i,
    /iphone|celular|smartphone|tablet|notebook|laptop|monitor|smartwatch/i,
    /auricular|airpods|parlante|c[aá]mara|impresora|ssd|disco/i,
  ],
};

function clamp(value: number, min = 0, max = 1): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function parseNumericFromText(raw: unknown): number {
  if (typeof raw === "number") return raw;
  const text = String(raw ?? "").trim();
  if (!text) return 0;

  // Keep first numeric-like chunk and normalize decimal separators.
  const match = text.match(/-?\d+(?:[.,]\d+)?/);
  if (!match) return 0;
  const normalized = match[0].replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function inferFeaturedCategoryFromProduct(product: any): FeaturedCategoryId {
  const categoryText = String(product?.category || "").toLowerCase();
  const titleText = String(product?.title || "").toLowerCase();
  const combined = `${categoryText} ${titleText}`;

  // Priority matters: more specific categories first.
  const priority: FeaturedCategoryId[] = [
    "gaming",
    "sneakers",
    "appliances",
    "tech",
  ];

  for (const category of priority) {
    if (CATEGORY_PATTERNS[category].some((pattern) => pattern.test(combined))) {
      return category;
    }
  }

  return "tech";
}

function computeDiscountRate(product: any): number {
  const currentPrice = Number(product?.currentPrice) || 0;
  const originalPrice = Number(product?.originalPrice) || 0;

  if (originalPrice > 0 && currentPrice > 0 && originalPrice > currentPrice) {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  return Math.max(0, Math.round(Number(product?.discountRate) || 0));
}

function getStoreName(product: any): string {
  const rawStore = String(product?.storeName || "").trim();
  if (!rawStore) return "Marketplace";

  const match = rawStore.match(/\((.*?)\)/);
  if (match?.[1]) return match[1].trim();
  return rawStore;
}

function getShippingLabel(product: any): string {
  if (product?.isFreeShipping) return "Envío full";
  if (product?.isFreeReturning) return "Devolución gratis";
  return "Consultar envío";
}

function getVariationRatio(product: any): number {
  const highest = Number(product?.highestPrice) || 0;
  const lowest = Number(product?.lowestPrice) || 0;
  const average = Number(product?.averagePrice) || 0;

  if (highest > 0 && lowest > 0 && average > 0 && highest > lowest) {
    return (highest - lowest) / average;
  }

  const history: Array<{ price?: number }> = Array.isArray(product?.priceHistory)
    ? product.priceHistory
    : [];
  if (!history.length) return 0;

  const prices = history
    .map((entry) => Number(entry?.price) || 0)
    .filter((value) => value > 0);

  if (prices.length < 2) return 0;

  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const avg = prices.reduce((sum, value) => sum + value, 0) / prices.length;

  if (!avg || max <= min) return 0;
  return (max - min) / avg;
}

function reputationValue(product: any): number {
  return parseNumericFromText(product?.stars);
}

function hasHighReputation(product: any): boolean {
  const stars = reputationValue(product);
  return stars >= 4;
}

function salesValue(product: any): number {
  return Math.max(0, Number(product?.reviewsCount) || 0);
}

function hasFullShipping(product: any): boolean {
  return Boolean(product?.isFreeShipping);
}

function hasAnyGoodShipping(product: any): boolean {
  return Boolean(product?.isFreeShipping || product?.isFreeReturning);
}

function demandScore(product: any): number {
  const salesProxy = salesValue(product);
  return clamp(Math.log10(salesProxy + 1) / Math.log10(1001));
}

function variationScore(product: any): number {
  const ratio = getVariationRatio(product);
  // 25%+ spread is considered very good.
  return clamp(ratio / 0.25);
}

function impulseScore(product: any): number {
  const discount = computeDiscountRate(product);
  // 35%+ discount is considered strong impulse trigger.
  return clamp(discount / 35);
}

function scoreProduct(product: any): number {
  const dScore = demandScore(product);
  const vScore = variationScore(product);
  const iScore = impulseScore(product);
  const reputationMultiplier = hasHighReputation(product) ? 1 : 0.65;

  const weighted = dScore * 0.45 + vScore * 0.35 + iScore * 0.2;
  return clamp(weighted * reputationMultiplier);
}

function baseRequiredFields(product: any): boolean {
  const image = String(product?.image || "").trim();
  const title = String(product?.title || "").trim();
  const currentPrice = Number(product?.currentPrice) || 0;

  return Boolean(image && title && currentPrice > 0);
}

type EligibilityTier = 0 | 1 | 2 | 3 | 4;

function getEligibilityTier(product: any): EligibilityTier {
  if (!baseRequiredFields(product)) return 0;

  const sales = salesValue(product);
  const reputation = reputationValue(product);
  const fullShipping = hasFullShipping(product);
  const goodShipping = hasAnyGoodShipping(product);

  // Tier 1 (strict): original requested constraints.
  if (sales > 50 && reputation >= 4 && fullShipping) return 1;

  // Tier 2: keep full shipping + high reputation, relax demand a bit.
  if (sales > 35 && reputation >= 4 && fullShipping) return 2;

  // Tier 3: allow free return with slightly lower reputation.
  if (sales > 25 && reputation >= 3.9 && goodShipping) return 3;

  // Tier 4: broad fallback to avoid empty sections.
  if (sales > 15 && reputation >= 3.7 && goodShipping) return 4;

  return 0;
}

type BuildOptions = {
  maxTotal?: number;
  maxPerCategory?: number;
};

export function emptyFeaturedCategories(): FeaturedCategories {
  return {
    tech: [],
    gaming: [],
    sneakers: [],
    appliances: [],
  };
}

export function buildFeaturedSnapshotFromProducts(
  products: any[],
  options: BuildOptions = {},
): FeaturedCategories {
  const maxTotal = options.maxTotal ?? 10;
  const maxPerCategory = options.maxPerCategory ?? 10;

  const groupedCandidates: Record<
    FeaturedCategoryId,
    Array<{
      product: any;
      score: number;
      d: number;
      v: number;
      i: number;
      tier: EligibilityTier;
    }>
  > = {
    tech: [],
    gaming: [],
    sneakers: [],
    appliances: [],
  };

  const dedupe = new Set<string>();

  for (const product of products) {
    const tier = getEligibilityTier(product);
    if (!tier) continue;

    const url = String(product?.url || "").trim();
    if (!url || dedupe.has(url)) continue;
    dedupe.add(url);

    const d = demandScore(product);
    const v = variationScore(product);
    const i = impulseScore(product);
    const score = scoreProduct(product);
    const category = inferFeaturedCategoryFromProduct(product);

    groupedCandidates[category].push({ product, score, d, v, i, tier });
  }

  for (const category of FEATURED_CATEGORY_IDS) {
    groupedCandidates[category].sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      if (b.score !== a.score) return b.score - a.score;
      return (
        new Date(b.product?.updatedAt || 0).getTime() -
        new Date(a.product?.updatedAt || 0).getTime()
      );
    });
  }

  const selected: FeaturedCategories = emptyFeaturedCategories();
  let pickedTotal = 0;

  // Round-robin pick to keep category coverage balanced.
  let cursor = 0;
  while (pickedTotal < maxTotal) {
    const category = FEATURED_CATEGORY_IDS[cursor % FEATURED_CATEGORY_IDS.length];
    cursor += 1;

    if (selected[category].length >= maxPerCategory) {
      if (
        FEATURED_CATEGORY_IDS.every(
          (cat) =>
            selected[cat].length >= maxPerCategory || groupedCandidates[cat].length === 0,
        )
      ) {
        break;
      }
      continue;
    }

    const next = groupedCandidates[category].shift();
    if (!next) {
      if (FEATURED_CATEGORY_IDS.every((cat) => groupedCandidates[cat].length === 0)) {
        break;
      }
      continue;
    }

    const currentPrice = Number(next.product?.currentPrice) || 0;
    const originalPrice = Number(next.product?.originalPrice) || currentPrice;

    selected[category].push({
      id: String(next.product?._id || ""),
      url: String(next.product?.url || ""),
      image: String(next.product?.image || ""),
      store: getStoreName(next.product),
      name: String(next.product?.title || "Producto"),
      price: currentPrice,
      oldPrice: originalPrice,
      discountRate: computeDiscountRate(next.product),
      shipping: getShippingLabel(next.product),
      currency: String(next.product?.currency || "$"),
      updatedAt: new Date(next.product?.updatedAt || Date.now()).toISOString(),
      demandScore: Number(next.d.toFixed(3)),
      variationScore: Number(next.v.toFixed(3)),
      impulseScore: Number(next.i.toFixed(3)),
      totalScore: Number(next.score.toFixed(3)),
      qualityTier:
        next.tier === 1
          ? "strict"
          : next.tier === 2
            ? "high"
            : next.tier === 3
              ? "medium"
              : "broad",
    });

    pickedTotal += 1;
  }

  return selected;
}

export const FEATURED_EMPTY_GROUPS = EMPTY;
