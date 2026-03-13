export const SUBSCRIPTION_TIERS = {
  BASIC: "basic",
  PREMIUM: "premium",
} as const;

export type SubscriptionTier =
  (typeof SUBSCRIPTION_TIERS)[keyof typeof SUBSCRIPTION_TIERS];

export const PLAN_LIMITS = {
  [SUBSCRIPTION_TIERS.BASIC]: {
    maxSavedProducts: 5,
    maxFollowedProducts: 5,
    priceHistoryDays: 30,
    scanCadence: "diaria",
  },
  [SUBSCRIPTION_TIERS.PREMIUM]: {
    maxSavedProducts: Number.POSITIVE_INFINITY,
    maxFollowedProducts: Number.POSITIVE_INFINITY,
    priceHistoryDays: Number.POSITIVE_INFINITY,
    scanCadence: "prioritaria",
  },
} as const;

export function resolveSubscriptionTier(subscription?: string | null): SubscriptionTier {
  return subscription === SUBSCRIPTION_TIERS.PREMIUM
    ? SUBSCRIPTION_TIERS.PREMIUM
    : SUBSCRIPTION_TIERS.BASIC;
}

export function getPlanLimits(subscription?: string | null) {
  const tier = resolveSubscriptionTier(subscription);
  return PLAN_LIMITS[tier];
}

export function isFreePlan(subscription?: string | null) {
  return resolveSubscriptionTier(subscription) === SUBSCRIPTION_TIERS.BASIC;
}
