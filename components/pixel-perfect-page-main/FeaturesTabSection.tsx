"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Globe, Tag, Target, Zap } from "lucide-react";
import { formatNumber } from "@/lib/utils";

type CategoryId = "electronics" | "fashion" | "food" | "appliances";

type TabItem = {
  id: CategoryId;
  label: string;
  icon: typeof Zap;
};

type ProductCard = {
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
};

type CategoryContent = {
  title: string;
  description: string;
};

const AUTO_SWITCH_MS = 6000;

const tabs: TabItem[] = [
  { id: "electronics", label: "Electrónica", icon: Zap },
  { id: "fashion", label: "Vestimenta y Accesorios", icon: Eye },
  { id: "food", label: "Alimentos", icon: Globe },
  { id: "appliances", label: "Electrodomésticos", icon: Target },
];

const categoryContent: Record<CategoryId, CategoryContent> = {
  electronics: {
    title: "Destacados en Electrónica",
    description:
      "Productos guardados en SaveMelin para tecnología y consumo digital.",
  },
  fashion: {
    title: "Destacados en Vestimenta y Accesorios",
    description:
      "Selección de productos de moda guardados con oportunidades de precio.",
  },
  food: {
    title: "Destacados en Alimentos",
    description:
      "Productos de consumo frecuente guardados y agrupados por categoría.",
  },
  appliances: {
    title: "Destacados en Electrodomésticos",
    description:
      "Línea blanca y pequeños electrodomésticos guardados en la base de datos.",
  },
};

function createEmptyProductsByCategory(): Record<CategoryId, ProductCard[]> {
  return {
    electronics: [],
    fashion: [],
    food: [],
    appliances: [],
  };
}

function nextTabId(currentTabId: CategoryId): CategoryId {
  const currentIndex = tabs.findIndex((tab) => tab.id === currentTabId);
  const nextIndex = (currentIndex + 1) % tabs.length;
  return tabs[nextIndex].id;
}

function getDiscountLabel(product: ProductCard): string {
  if (product.discountRate > 0) return `-${product.discountRate}%`;
  if (product.oldPrice > product.price && product.oldPrice > 0) {
    const computed = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
    return computed > 0 ? `-${computed}%` : "Sin descuento";
  }
  return "Sin descuento";
}

export default function PixelPerfectFeaturesTabSection() {
  const [activeTab, setActiveTab] = useState<CategoryId>(tabs[0].id);
  const [progress, setProgress] = useState(0);
  const [restartKey, setRestartKey] = useState(0);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsByCategory, setProductsByCategory] = useState<
    Record<CategoryId, ProductCard[]>
  >(createEmptyProductsByCategory);

  const activeCategoryMeta = useMemo(
    () => categoryContent[activeTab],
    [activeTab],
  );
  const activeProducts = useMemo(
    () => productsByCategory[activeTab] || [],
    [productsByCategory, activeTab],
  );
  const activeTabMeta = useMemo(
    () => tabs.find((tab) => tab.id === activeTab) ?? tabs[0],
    [activeTab],
  );
  const ActiveIcon = activeTabMeta.icon;

  useEffect(() => {
    let mounted = true;

    const fetchFeaturedProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const response = await fetch("/api/featured-products", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch featured products");
        }

        const payload = await response.json();
        const data = payload?.data ?? {};
        const nextState = createEmptyProductsByCategory();

        for (const tab of tabs) {
          const rawItems = Array.isArray(data?.[tab.id]) ? data[tab.id] : [];
          nextState[tab.id] = rawItems;
        }

        if (mounted) {
          setProductsByCategory(nextState);
        }
      } catch (error) {
        console.error("[FEATURES_TAB_FETCH]", error);
        if (mounted) {
          setProductsByCategory(createEmptyProductsByCategory());
        }
      } finally {
        if (mounted) {
          setIsLoadingProducts(false);
        }
      }
    };

    fetchFeaturedProducts();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let frameId = 0;
    let startTime = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const nextProgress = Math.min((elapsed / AUTO_SWITCH_MS) * 100, 100);
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        setActiveTab((current) => nextTabId(current));
        return;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [activeTab, restartKey]);

  const handleTabClick = (tabId: CategoryId) => {
    setActiveTab(tabId);
    setProgress(0);
    setRestartKey((prev) => prev + 1);
  };

  const secondsToNextCategory = Math.max(
    1,
    Math.ceil((AUTO_SWITCH_MS * (100 - progress)) / 100 / 1000),
  );

  return (
    <section className="py-12">
      <div className="max-w-[94rem] mx-auto padding-global">
        <div className="border border-border/70 bg-background">
          <div className="px-6 lg:px-8 py-6 border-b border-border/70">
            <p className="text-sm text-muted-foreground mb-2">Destacados</p>
            <h2 className="text-2xl lg:text-3xl tracking-tight text-foreground font-semibold">
              Productos guardados por categoría
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-border/70">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;
              const isLast = index === tabs.length - 1;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative px-4 py-4 lg:px-5 lg:py-5 text-left transition-colors cursor-pointer ${
                    isLast ? "" : "border-r border-border/70"
                  } ${
                    isActive
                      ? "text-foreground bg-section-grey"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-[0.95rem] lg:text-base font-medium leading-tight">
                      {tab.label}
                    </span>
                  </div>

                  <span className="absolute left-0 bottom-0 h-[1px] w-full bg-border/70" />
                  {isActive && (
                    <span
                      className="absolute left-0 bottom-0 h-[2px] bg-primary transition-[width] duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[18rem_minmax(0,1fr)]">
            <aside className="border-b xl:border-b-0 xl:border-r border-border/70 p-6 lg:p-8 bg-section-grey">
              <div className="inline-flex items-center gap-2 border border-border rounded-sm px-3 py-1.5 mb-4">
                <Tag className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs text-muted-foreground">
                  Actualización automática
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <ActiveIcon className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {activeTabMeta.label}
                </span>
              </div>

              <h3 className="text-xl font-semibold tracking-tight text-foreground leading-tight mb-3">
                {activeCategoryMeta.title}
              </h3>

              <p className="text-sm leading-relaxed text-muted-foreground mb-5">
                {activeCategoryMeta.description}
              </p>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="text-foreground font-medium">
                    {activeProducts.length}
                  </span>{" "}
                  productos guardados
                </p>
                <p>
                  Próxima categoría en{" "}
                  <span className="text-foreground font-medium">
                    {secondsToNextCategory}s
                  </span>
                </p>
              </div>
            </aside>

            <div className="p-6 lg:p-8">
              {isLoadingProducts ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`featured-skeleton-${index}`}
                      className="border border-border/70 bg-section-grey p-4 h-[17rem] animate-pulse"
                    />
                  ))}
                </div>
              ) : activeProducts.length === 0 ? (
                <div className="border border-border/70 bg-section-grey p-6 text-sm text-muted-foreground">
                  No hay productos guardados en esta categoría todavía.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {activeProducts.map((product) => {
                    const hasOldPrice =
                      Number(product.oldPrice) > 0 &&
                      Number(product.oldPrice) > Number(product.price);
                    const discountLabel = getDiscountLabel(product);

                    return (
                      <article
                        key={`${activeTab}-${product.id}`}
                        className="bg-section-grey border border-border/70 p-4 min-h-[17rem] flex flex-col gap-3"
                      >
                        <div className="h-28 border border-border/70 bg-background overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-contain p-2"
                            loading="lazy"
                          />
                        </div>

                        <header className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {product.store}
                            </p>
                            <p className="text-sm text-foreground font-medium leading-snug line-clamp-2 mt-1">
                              {product.name}
                            </p>
                          </div>
                          <span className="text-[11px] px-2 py-0.5 border border-primary/30 text-primary bg-primary/10">
                            Guardado
                          </span>
                        </header>

                        <div className="mt-auto">
                          <div className="flex items-end gap-2 flex-wrap">
                            <span className="text-xl font-semibold text-foreground tracking-tight">
                              {product.currency} {formatNumber(product.price)}
                            </span>
                            {hasOldPrice && (
                              <span className="text-xs text-muted-foreground line-through">
                                {product.currency} {formatNumber(product.oldPrice)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2 gap-3">
                            <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground">
                              {discountLabel}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {product.shipping}
                            </span>
                          </div>

                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Ver publicación
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
