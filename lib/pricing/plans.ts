export const SUBSCRIPTION_TIERS = {
  BASIC: "basic",
  PLUS: "plus",
  PRO: "pro",
  TEAM: "team",
  PREMIUM_LEGACY: "premium",
} as const;

export const ACTIVE_PLAN_TIERS = [
  SUBSCRIPTION_TIERS.BASIC,
  SUBSCRIPTION_TIERS.PLUS,
  SUBSCRIPTION_TIERS.PRO,
  SUBSCRIPTION_TIERS.TEAM,
] as const;

export type SubscriptionTier = (typeof ACTIVE_PLAN_TIERS)[number];

type PlanLimits = {
  id: SubscriptionTier;
  label: string;
  monthlyPriceUsd: number;
  monthlyPriceArsReference: number;
  maxSavedProducts: number;
  maxFollowedProducts: number;
  serperMonthlyCredits: number;
  priceHistoryDays: number;
  scanCadence: string;
  multiStoreComparison: boolean;
  supportLevel: string;
};

export const PLAN_LIMITS: Record<SubscriptionTier, PlanLimits> = {
  [SUBSCRIPTION_TIERS.BASIC]: {
    id: SUBSCRIPTION_TIERS.BASIC,
    label: "Gratis",
    monthlyPriceUsd: 0,
    monthlyPriceArsReference: 0,
    maxSavedProducts: 10,
    maxFollowedProducts: 10,
    serperMonthlyCredits: 0,
    priceHistoryDays: 30,
    scanCadence: "Semanal",
    multiStoreComparison: false,
    supportLevel: "Comunidad",
  },
  [SUBSCRIPTION_TIERS.PLUS]: {
    id: SUBSCRIPTION_TIERS.PLUS,
    label: "Plus",
    monthlyPriceUsd: 5.99,
    monthlyPriceArsReference: 7990,
    maxSavedProducts: 100,
    maxFollowedProducts: 100,
    serperMonthlyCredits: 60,
    priceHistoryDays: 365,
    scanCadence: "Cada 3 días",
    multiStoreComparison: true,
    supportLevel: "Email",
  },
  [SUBSCRIPTION_TIERS.PRO]: {
    id: SUBSCRIPTION_TIERS.PRO,
    label: "Pro",
    monthlyPriceUsd: 17.99,
    monthlyPriceArsReference: 23990,
    maxSavedProducts: 500,
    maxFollowedProducts: 500,
    serperMonthlyCredits: 300,
    priceHistoryDays: Number.POSITIVE_INFINITY,
    scanCadence: "Diaria",
    multiStoreComparison: true,
    supportLevel: "Prioritario",
  },
  [SUBSCRIPTION_TIERS.TEAM]: {
    id: SUBSCRIPTION_TIERS.TEAM,
    label: "Negocios",
    monthlyPriceUsd: 79,
    monthlyPriceArsReference: 105000,
    maxSavedProducts: 5000,
    maxFollowedProducts: 5000,
    serperMonthlyCredits: 3000,
    priceHistoryDays: Number.POSITIVE_INFINITY,
    scanCadence: "Horaria",
    multiStoreComparison: true,
    supportLevel: "SLA dedicado",
  },
};

export const PLAN_COST_MATRIX = [
  {
    feature: "Precio por mes",
    [SUBSCRIPTION_TIERS.BASIC]: "Gratis",
    [SUBSCRIPTION_TIERS.PLUS]: "USD 5.99",
    [SUBSCRIPTION_TIERS.PRO]: "USD 17.99",
    [SUBSCRIPTION_TIERS.TEAM]: "USD 79",
  },
  {
    feature: "Productos para seguir",
    [SUBSCRIPTION_TIERS.BASIC]: "10",
    [SUBSCRIPTION_TIERS.PLUS]: "100",
    [SUBSCRIPTION_TIERS.PRO]: "500",
    [SUBSCRIPTION_TIERS.TEAM]: "5000",
  },
  {
    feature: "Alertas activas",
    [SUBSCRIPTION_TIERS.BASIC]: "10",
    [SUBSCRIPTION_TIERS.PLUS]: "100",
    [SUBSCRIPTION_TIERS.PRO]: "500",
    [SUBSCRIPTION_TIERS.TEAM]: "5000",
  },
  {
    feature: "Comparar en otras tiendas",
    [SUBSCRIPTION_TIERS.BASIC]: "Solo Mercado Libre",
    [SUBSCRIPTION_TIERS.PLUS]: "Sí",
    [SUBSCRIPTION_TIERS.PRO]: "Sí",
    [SUBSCRIPTION_TIERS.TEAM]: "Sí",
  },
  {
    feature: "Monitoreo de catálogo propio vs competencia",
    [SUBSCRIPTION_TIERS.BASIC]: "No",
    [SUBSCRIPTION_TIERS.PLUS]: "No",
    [SUBSCRIPTION_TIERS.PRO]: "No",
    [SUBSCRIPTION_TIERS.TEAM]: "Sí",
  },
  {
    feature: "Frecuencia de actualización",
    [SUBSCRIPTION_TIERS.BASIC]: "1 vez por semana",
    [SUBSCRIPTION_TIERS.PLUS]: "Cada 3 días",
    [SUBSCRIPTION_TIERS.PRO]: "1 vez por día",
    [SUBSCRIPTION_TIERS.TEAM]: "Cada 1 hora",
  },
  {
    feature: "Historial disponible",
    [SUBSCRIPTION_TIERS.BASIC]: "30 días",
    [SUBSCRIPTION_TIERS.PLUS]: "12 meses",
    [SUBSCRIPTION_TIERS.PRO]: "Completo",
    [SUBSCRIPTION_TIERS.TEAM]: "Completo",
  },
  {
    feature: "Búsquedas mensuales en otras tiendas",
    [SUBSCRIPTION_TIERS.BASIC]: "0",
    [SUBSCRIPTION_TIERS.PLUS]: "60",
    [SUBSCRIPTION_TIERS.PRO]: "300",
    [SUBSCRIPTION_TIERS.TEAM]: "3000",
  },
] as const;

export function resolveSubscriptionTier(
  subscription?: string | null
): SubscriptionTier {
  if (subscription === SUBSCRIPTION_TIERS.PREMIUM_LEGACY) {
    return SUBSCRIPTION_TIERS.PRO;
  }

  if (
    subscription === SUBSCRIPTION_TIERS.PLUS ||
    subscription === SUBSCRIPTION_TIERS.PRO ||
    subscription === SUBSCRIPTION_TIERS.TEAM
  ) {
    return subscription;
  }

  return SUBSCRIPTION_TIERS.BASIC;
}

export function getPlanLimits(subscription?: string | null) {
  const tier = resolveSubscriptionTier(subscription);
  return PLAN_LIMITS[tier];
}

export function isFreePlan(subscription?: string | null) {
  return resolveSubscriptionTier(subscription) === SUBSCRIPTION_TIERS.BASIC;
}

export function isPaidPlan(subscription?: string | null) {
  return !isFreePlan(subscription);
}
