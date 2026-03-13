"use client";

import { useEffect, useState } from "react";
import { Clock3, Tag } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

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
  updatedAt: string;
};

function getDiscountLabel(product: ProductCard): string {
  if (product.discountRate > 0) return `-${product.discountRate}%`;
  if (product.oldPrice > product.price && product.oldPrice > 0) {
    const computed = Math.round(
      ((product.oldPrice - product.price) / product.oldPrice) * 100,
    );
    return computed > 0 ? `-${computed}%` : "Sin descuento";
  }
  return "Sin descuento";
}

export default function PixelPerfectFeaturesTabSection() {
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [products, setProducts] = useState<ProductCard[]>([]);

  useEffect(() => {
    let mounted = true;

    const fetchLatestProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const response = await fetch("/api/featured-products", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch latest products");
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : [];

        if (mounted) {
          setProducts(data);
        }
      } catch (error) {
        console.error("[LATEST_PRODUCTS_FETCH]", error);
        if (mounted) {
          setProducts([]);
        }
      } finally {
        if (mounted) {
          setIsLoadingProducts(false);
        }
      }
    };

    fetchLatestProducts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="py-12">
      <div className="max-w-[94rem] mx-auto padding-global">
        <div className="border border-border/70 bg-background">
          <div className="px-6 lg:px-8 py-6 border-b border-border/70">
            <p className="text-[1.1rem] text-muted-foreground mb-2">Destacados</p>
            <h2 className="text-[3rem] lg:text-[4rem] leading-[0.95] tracking-tight text-foreground font-medium">
              Últimos productos buscados por usuarios
            </h2>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[18rem_minmax(0,1fr)]">
            <aside className="border-b xl:border-b-0 xl:border-r border-border/70 p-6 lg:p-8 bg-section-grey">
              <div className="inline-flex items-center gap-2 border border-border rounded-sm px-3 py-1.5 mb-4">
                <Clock3 className="w-3.5 h-3.5 text-primary" />
                <span className="text-[0.95rem] text-muted-foreground">
                  Ordenado por fecha
                </span>
              </div>

              <h3 className="text-[2.2rem] font-medium tracking-tight text-foreground leading-[1.05] mb-3">
                Actividad reciente de búsqueda
              </h3>

              <p className="text-[1.3rem] leading-[1.4] text-muted-foreground mb-5">
                Mostramos los últimos productos incorporados a la base por
                búsquedas de usuarios, sin curación semanal.
              </p>

              <p className="text-[1.2rem] text-muted-foreground">
                <span className="text-foreground font-medium">
                  {products.length}
                </span>{" "}
                productos recientes
              </p>
            </aside>

            <div className="p-6 lg:p-8">
              {isLoadingProducts ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`latest-skeleton-${index}`}
                      className="border border-border/70 bg-section-grey p-4 h-[17rem] animate-pulse"
                    />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="border border-border/70 bg-section-grey p-6 text-sm text-muted-foreground">
                  Todavía no hay productos recientes disponibles.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {products.map((product) => {
                    const hasOldPrice =
                      Number(product.oldPrice) > 0 &&
                      Number(product.oldPrice) > Number(product.price);
                    const discountLabel = getDiscountLabel(product);

                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="bg-section-grey border border-border/70 p-4 min-h-[17rem] flex flex-col gap-3 transition-colors hover:bg-background"
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
                            <p className="text-[0.95rem] text-muted-foreground">
                              {product.store}
                            </p>
                            <p className="text-[1.15rem] text-foreground font-medium leading-snug line-clamp-2 mt-1">
                              {product.name}
                            </p>
                          </div>
                          <span className="text-[11px] px-2 py-0.5 border border-primary/30 text-primary bg-primary/10">
                            Reciente
                          </span>
                        </header>

                        <div className="mt-auto">
                          <div className="flex items-end gap-2 flex-wrap">
                            <span className="text-[1.65rem] font-semibold text-foreground tracking-tight">
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

                          <span className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Tag className="w-3 h-3" />
                            Ver detalle
                          </span>
                        </div>
                      </Link>
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
