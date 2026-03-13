import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/actions";
import PixelPerfectNavbar from "@/components/pixel-perfect-page-main/Navbar";
import PixelPerfectFooter from "@/components/pixel-perfect-page-main/Footer";
import ProfileDashboardClient from "@/components/profile/ProfileDashboardClient";
import {
  getPlanLimits,
  resolveSubscriptionTier,
} from "@/lib/pricing/plans";

const verticalLineOffset = "max(calc((100vw - 94rem) / 2 + 2.5rem), 2.5rem)";

type DashboardProduct = {
  id: string;
  title: string;
  image: string;
  currency: string;
  currentPrice: number;
  originalPrice: number;
  isFollowing: boolean;
  category: string;
  url: string;
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const validCountries = ["argentina", "brasil", "colombia", "uruguay"] as const;
  const selectedCountry = validCountries.includes(user.country)
    ? user.country
    : "argentina";

  const productsRaw = Array.isArray(user.products) ? user.products : [];

  const products: DashboardProduct[] = productsRaw.map((product: any) => ({
    id: String(product._id),
    title: product.title || "Producto sin título",
    image: product.image || "/assets/icons/bag.svg",
    currency: product.currency || "$",
    currentPrice: Number(product.currentPrice || 0),
    originalPrice: Number(product.originalPrice || 0),
    isFollowing: Boolean(product.isFollowing),
    category: product.category || "General",
    url: product.url || "",
  }));

  const accumulatedSavings = products.reduce((total: number, product) => {
    const diff = product.originalPrice - product.currentPrice;
    return diff > 0 ? total + diff : total;
  }, 0);

  const metrics = {
    savedProducts: products.length,
    alertsEnabled: products.filter((item) => item.isFollowing).length,
    productsWithDiscount: products.filter(
      (item) => item.originalPrice > item.currentPrice
    ).length,
    accumulatedSavings,
  };

  const subscriptionTier = resolveSubscriptionTier(user.subscription);
  const planLimits = getPlanLimits(user.subscription);

  return (
    <div className="pixel-perfect-home relative min-h-screen bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-[60] border-l border-border/50"
        style={{ left: verticalLineOffset }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-[60] border-r border-border/50"
        style={{ right: verticalLineOffset }}
      />

      <PixelPerfectNavbar />

      <section className="border-y border-border/70">
        <div className="max-w-[94rem] mx-auto padding-global border-x border-border/70">
          <ProfileDashboardClient
            user={{
              name: user.name || "Usuario",
              email: user.email || "",
              country: selectedCountry,
            }}
            products={products}
            metrics={metrics}
            subscription={{
              tier: subscriptionTier,
              maxSavedProducts: Number.isFinite(planLimits.maxSavedProducts)
                ? planLimits.maxSavedProducts
                : null,
              maxFollowedProducts: Number.isFinite(planLimits.maxFollowedProducts)
                ? planLimits.maxFollowedProducts
                : null,
              scanCadence: planLimits.scanCadence,
            }}
          />
        </div>
      </section>

      <PixelPerfectFooter />
    </div>
  );
}
