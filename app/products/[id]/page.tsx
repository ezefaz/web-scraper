import Link from "next/link";
import { redirect } from "next/navigation";
import PixelPerfectNavbar from "@/components/pixel-perfect-page-main/Navbar";
import PixelPerfectFooter from "@/components/pixel-perfect-page-main/Footer";
import Searchbar from "@/components/Searchbar";
import BarChart from "@/components/charts/BarChart";
import DolarBasedChart from "@/components/charts/LineChart";
import ScraperButton from "@/components/ScraperButton";
import {
  formatNumber,
  formatUSD,
  getAnnualDolarData,
  getAnnualMonthlyData,
  getCurrentMonthlyDolarData,
  getCurrentWeekDolarData,
  getMonthlyData,
  getWeeklyData,
} from "@/lib/utils";
import {
  getCurrentUser,
  getProductById,
  getProductByURL,
  getSimilarProducts,
} from "@/lib/actions";
import { ProductType } from "@/types";
import { Button } from "@/components/pixel-perfect-page-main/button";
import { ExternalLink, History, Package, Sparkles } from "lucide-react";
import FollowProductButton from "@/components/FollowProductButton";

type Props = {
  params: { id: string };
  searchParams?: { url?: string };
};

const ProductDetailsPage = async ({ params: { id }, searchParams }: Props) => {
  const currentUser = await getCurrentUser();
  const foundedProduct = await getProductById(id);
  const userProduct = currentUser?.products?.find(
    (product: any) => product._id.toString() === id,
  );
  const fallbackUrl = (() => {
    if (!searchParams?.url) return "";
    try {
      return decodeURIComponent(searchParams.url).trim();
    } catch {
      return searchParams.url.trim();
    }
  })();

  const productUrl = foundedProduct?.url || userProduct?.url || fallbackUrl;
  if (!productUrl) redirect("/");

  const product: ProductType = await getProductByURL(productUrl);
  if (!product) redirect("/");

  const {
    currentDolar,
    priceHistory = [],
    currentPrice,
    dolarHistory = [],
    originalPrice,
    currency,
    title,
    image,
    storeName,
    status,
    isFreeShipping,
    isFreeReturning,
    category,
    averagePrice,
    highestPrice,
    lowestPrice,
  } = product;

  const rawDolarValue = Number(currentDolar?.value || 0);
  const dolarValue =
    rawDolarValue > 0 && rawDolarValue < 20
      ? rawDolarValue * 1000
      : rawDolarValue;
  const normalizedCurrentPrice = Number(currentPrice || 0);
  const normalizedHighestPrice = Number(highestPrice || 0);
  const normalizedLowestPrice = Number(lowestPrice || 0);
  const historicalPrices = (priceHistory || [])
    .map((item: any) => Number(item?.price))
    .filter((value: number) => Number.isFinite(value) && value > 0);
  const effectiveHighestPrice = Math.max(
    normalizedHighestPrice,
    normalizedCurrentPrice,
    ...historicalPrices,
  );
  const effectiveLowestPrice =
    historicalPrices.length > 0
      ? Math.min(
          normalizedLowestPrice > 0 ? normalizedLowestPrice : Infinity,
          normalizedCurrentPrice > 0 ? normalizedCurrentPrice : Infinity,
          ...historicalPrices,
        )
      : normalizedCurrentPrice;

  const priceBasedOnDolar =
    dolarValue > 0 && normalizedCurrentPrice > 0
      ? normalizedCurrentPrice / dolarValue
      : 0;

  const dayLabel = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
  }).format(new Date());
  const monthLabel = new Intl.DateTimeFormat("es-AR", {
    month: "short",
    year: "numeric",
  }).format(new Date());
  const currentDolarDate = currentDolar?.date ? new Date(currentDolar.date) : null;
  const currentDolarDateLabel =
    currentDolarDate && !Number.isNaN(currentDolarDate.getTime())
      ? currentDolarDate.toLocaleDateString("es-AR")
      : null;

  const monthlyDataRaw = getMonthlyData(priceHistory, currency);
  const weeklyDataRaw = getWeeklyData(priceHistory);
  const productAnualDataRaw = getAnnualMonthlyData(priceHistory, currency);
  const dolarWeeklyDataRaw = getCurrentWeekDolarData(dolarHistory, currentPrice);
  const dolarMonthlyDataRaw = getCurrentMonthlyDolarData(
    dolarHistory,
    currentPrice,
  );
  const dolarAnualDataRaw = getAnnualDolarData(currentPrice, dolarHistory);

  const fallbackPricePoint =
    normalizedCurrentPrice > 0
      ? { Period: dayLabel, Month: dayLabel, Mayor: normalizedCurrentPrice, Menor: normalizedCurrentPrice }
      : null;
  const fallbackAnnualPricePoint =
    normalizedCurrentPrice > 0
      ? { Period: monthLabel, Month: monthLabel, Mayor: normalizedCurrentPrice, Menor: normalizedCurrentPrice }
      : null;

  const weeklyData =
    weeklyDataRaw.length > 0
      ? weeklyDataRaw
      : fallbackPricePoint
        ? [fallbackPricePoint]
        : [];
  const monthlyData =
    monthlyDataRaw.length > 0
      ? monthlyDataRaw
      : fallbackPricePoint
        ? [fallbackPricePoint]
        : [];
  const productAnualData =
    productAnualDataRaw.length > 0
      ? productAnualDataRaw
      : fallbackAnnualPricePoint
        ? [fallbackAnnualPricePoint]
        : [];

  const fallbackDolarPoint =
    normalizedCurrentPrice > 0 && dolarValue > 0
      ? {
          Period: dayLabel,
          "Valor Producto USD": normalizedCurrentPrice / dolarValue,
          "Dólar ARS": dolarValue,
        }
      : null;
  const fallbackAnnualDolarPoint =
    normalizedCurrentPrice > 0 && dolarValue > 0
      ? {
          Period: monthLabel,
          "Valor Producto USD": normalizedCurrentPrice / dolarValue,
          "Dólar ARS": dolarValue,
        }
      : null;

  const dolarWeeklyData =
    dolarWeeklyDataRaw.length > 0
      ? dolarWeeklyDataRaw
      : fallbackDolarPoint
        ? [fallbackDolarPoint]
        : [];
  const dolarMonthlyData =
    dolarMonthlyDataRaw.length > 0
      ? dolarMonthlyDataRaw
      : fallbackDolarPoint
        ? [fallbackDolarPoint]
        : [];
  const dolarAnualData =
    dolarAnualDataRaw.length > 0
      ? dolarAnualDataRaw
      : fallbackAnnualDolarPoint
        ? [fallbackAnnualDolarPoint]
        : [];

  const similarProducts = await getSimilarProducts(id);
  const hasDiscount = Number(originalPrice || 0) > Number(currentPrice || 0);

  return (
    <div className="pixel-perfect-home relative min-h-screen bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-[60] border-l border-border/50"
        style={{ left: "max(calc((100vw - 94rem) / 2 + 2.5rem), 2.5rem)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-[60] border-r border-border/50"
        style={{ right: "max(calc((100vw - 94rem) / 2 + 2.5rem), 2.5rem)" }}
      />

      <PixelPerfectNavbar />

      <section className="border-y border-border/70">
        <div className="max-w-[94rem] mx-auto padding-global border-x border-border/70 py-6 lg:py-7">
          <div className="grid grid-cols-1 px-12 gap-6 items-end">
            <Searchbar initialValue={title} />
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-[94rem] mx-auto padding-global border-x border-border/70">
          <div className="py-12 lg:py-14">
            <div
              id="information"
              className="border border-border/70 bg-section-grey p-6 md:p-8 lg:p-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-8 lg:gap-10">
                <div className="border border-border/70 bg-background p-4">
                  <div className="aspect-square w-full overflow-hidden bg-white">
                    <img
                      src={image}
                      alt={title}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-flex items-center border border-border/70 px-2.5 py-1 text-xs text-muted-foreground bg-background">
                      {storeName || "Marketplace"}
                    </span>
                    {category && (
                      <span className="inline-flex items-center border border-border/70 px-2.5 py-1 text-xs text-muted-foreground bg-background">
                        {category}
                      </span>
                    )}
                    {status && (
                      <span className="inline-flex items-center border border-border/70 px-2.5 py-1 text-xs text-muted-foreground bg-background">
                        {status}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center border px-2.5 py-1 text-xs ${
                        isFreeShipping
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {isFreeShipping ? "Envío gratis" : "Envío con cargo"}
                    </span>
                    <span
                      className={`inline-flex items-center border px-2.5 py-1 text-xs ${
                        isFreeReturning
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {isFreeReturning
                        ? "Devolución gratis"
                        : "Devolución con cargo"}
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-semibold leading-tight text-foreground max-w-4xl">
                    {title}
                  </h1>

                  <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-2">
                    <p className="text-3xl md:text-4xl font-semibold text-foreground">
                      {currency} {formatNumber(currentPrice)}
                    </p>
                    {hasDiscount && (
                      <p className="text-lg text-muted-foreground line-through">
                        {currency} {formatNumber(originalPrice)}
                      </p>
                    )}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href={product.url} target="_blank">
                      <Button variant="primary">
                        <span className="inline-flex items-center gap-2">
                          Comprar ahora
                          <ExternalLink className="h-4 w-4" />
                        </span>
                      </Button>
                    </Link>
                    <FollowProductButton productUrl={product.url} />
                  </div>

                  <Link
                    href={product.url}
                    target="_blank"
                    className="mt-4 flex justify-end items-end gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Ver publicación original
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 border border-border/70 bg-background p-6 md:p-8">
              <div className="mb-5 flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <h2 className="text-lg md:text-xl font-medium text-foreground">
                  Resumen de precios
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                <div className="border border-border/70 bg-section-grey p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Precio actual
                  </p>
                  <p className="mt-2 text-lg font-semibold text-foreground">
                    {currency} {formatNumber(currentPrice)}
                  </p>
                </div>
                <div className="border border-orange-200 bg-orange-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-[#c46a1b]">
                    Precio promedio
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[#c46a1b]">
                    {currency} {formatNumber(averagePrice)}
                  </p>
                </div>
                <div className="border border-red-200 bg-red-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-[#dc2626]">
                    Precio más alto
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[#dc2626]">
                    {currency} {formatNumber(effectiveHighestPrice)}
                  </p>
                </div>
                <div className="border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-[#16a34a]">
                    Precio más bajo
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[#16a34a]">
                    {currency} {formatNumber(effectiveLowestPrice)}
                  </p>
                </div>
                <div className="border border-border/70 bg-section-grey p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Valor en USD
                  </p>
                  <p className="mt-2 text-lg font-semibold text-foreground">
                    {priceBasedOnDolar > 0
                      ? formatUSD(priceBasedOnDolar)
                      : "N/A"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {dolarValue > 0
                      ? `Cotización tomada: $${formatNumber(dolarValue)}${
                          currentDolarDateLabel ? ` (${currentDolarDateLabel})` : ""
                        }`
                      : "Cotización no disponible"}
                  </p>
                </div>
              </div>
            </div>

            <div
              id="history"
              className="mt-8 border border-border/70 bg-background p-6 md:p-8"
            >
              <div className="mb-6 flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                  Historial de precios
                </h2>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <BarChart
                  productTitle={title}
                  lowestPrice={effectiveLowestPrice}
                  highestPrice={effectiveHighestPrice}
                  monthlyData={monthlyData}
                  weeklyData={weeklyData}
                  anualData={productAnualData}
                  currency={currency}
                />
                {currentUser?.country === "argentina" ? (
                  <DolarBasedChart
                    weeklyData={dolarWeeklyData}
                    monthlyData={dolarMonthlyData}
                    anualData={dolarAnualData}
                  />
                ) : (
                  <div className="border border-border/70 bg-section-grey p-6 text-sm text-muted-foreground">
                    El análisis en dólar está disponible para usuarios con
                    perfil de Argentina.
                  </div>
                )}
              </div>
            </div>

            <div
              id="priceCompare"
              className="mt-8 border border-border/70 bg-background p-6 md:p-8"
            >
              <div className="mb-6">
                <p className="text-sm text-primary font-medium">
                  Comparación inteligente
                </p>
                <h2 className="mt-1 text-2xl md:text-3xl font-semibold text-foreground">
                  Alternativas más baratas para este producto
                </h2>
                <p className="mt-2 text-sm md:text-base text-muted-foreground">
                  Comparamos precios locales y de otros sitios para mostrarte
                  oportunidades reales de ahorro.
                </p>
              </div>
              <ScraperButton productTitle={title} productPrice={currentPrice} />
            </div>

            {similarProducts && similarProducts.length > 0 && (
              <div
                className="mt-8 border border-border/70 bg-background p-6 md:p-8"
                id="trending"
              >
                <div className="mb-6 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                    Otros productos relacionados
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {similarProducts.map((item: any) => (
                    <Link
                      key={item._id?.toString()}
                      href={`/products/${item._id}`}
                      className="group border border-border/70 bg-section-grey p-4 flex flex-col gap-3 hover:bg-background transition-colors"
                    >
                      <div className="h-40 bg-background border border-border/70 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-contain p-2"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.category || "Producto"}
                      </p>
                      <p className="text-base font-medium text-foreground line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {item.currency} {formatNumber(item.currentPrice)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <PixelPerfectFooter />
    </div>
  );
};

export default ProductDetailsPage;
