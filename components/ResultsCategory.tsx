"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import ProductResults from "./ProductResults";
import { scrapeGoogleShoppingSearchProducts } from "@/lib/scraper/google-shopping";
import { scrapeProductSearchPageML } from "@/lib/scraper/product-search-page-ml";

const PAGE_SIZE = 12;

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
}

export default function ResultsCategory() {
  const searchParams = useSearchParams();
  const product = searchParams.get("search");
  const formattedProduct = decodeURIComponent(product ?? "").replace(/-/g, " ");

  const [scrapingInProgress, setScrapingInProgress] = useState(false);
  const [mercadolibreData, setMercadolibreData] = useState<any[]>([]);
  const [googleShoppingData, setGoogleShoppingData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const isMercadoLibreUrl = (url: string) =>
      /mercadolibre\.com|mercadolivre\.com|mercadolibre\.com\.ar|mercadolibre\.com\.co|mercadolibre\.com\.uy|mercadolibre\.cl/i.test(
        String(url || ""),
      );
    const isLocalDevUrl = (url: string) =>
      /localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|::1/i.test(String(url || ""));

    const fetchData = async () => {
      if (!product) {
        setMercadolibreData([]);
        setGoogleShoppingData([]);
        return;
      }

      setScrapingInProgress(true);
      try {
        const [mlResult, googleResult] = await Promise.allSettled([
          scrapeProductSearchPageML(product),
          scrapeGoogleShoppingSearchProducts(product),
        ]);

        const mlItems =
          mlResult.status === "fulfilled" && Array.isArray(mlResult.value)
            ? mlResult.value.filter(
                (item: any) =>
                  item?.source === "mercadolibre" ||
                  isMercadoLibreUrl(item?.url),
              )
            : [];

        const googleItems =
          googleResult.status === "fulfilled" &&
          Array.isArray(googleResult.value)
            ? googleResult.value.filter(
                (item: any) =>
                  item?.source === "google-shopping" &&
                  !isMercadoLibreUrl(item?.url) &&
                  !isLocalDevUrl(item?.url),
              )
            : [];

        setMercadolibreData(mlItems);
        setGoogleShoppingData(googleItems);
      } catch (error) {
        console.error("Error comparing prices:", error);
      } finally {
        setScrapingInProgress(false);
      }
    };

    fetchData();
  }, [product]);

  const allProducts = useMemo(() => {
    const merged = [...mercadolibreData, ...googleShoppingData];

    const uniqueByUrl = new Map<string, any>();
    for (const item of merged) {
      const key = String(
        item?.url || `${item?.title || "item"}-${item?.currentPrice || 0}`,
      );
      if (!uniqueByUrl.has(key)) {
        uniqueByUrl.set(key, item);
      }
    }

    return [...uniqueByUrl.values()].sort((a: any, b: any) => {
      const aPrice = Number(a?.currentPrice) || 0;
      const bPrice = Number(b?.currentPrice) || 0;
      return aPrice - bPrice;
    });
  }, [mercadolibreData, googleShoppingData]);

  const totalPages = Math.max(1, Math.ceil(allProducts.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [product, allProducts.length]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return allProducts.slice(start, start + PAGE_SIZE);
  }, [allProducts, currentPage]);

  const visiblePages = useMemo(
    () => getVisiblePages(currentPage, totalPages),
    [currentPage, totalPages],
  );

  if (scrapingInProgress) {
    return (
      <div className="py-14">
        <div className="flex flex-col items-center justify-center gap-3 border border-border/70 bg-section-grey py-14">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="text-lg font-medium text-foreground">
            Buscando producto...
          </p>
          <p className="text-sm text-muted-foreground">
            {formattedProduct
              ? `Consultando resultados para ${formattedProduct}`
              : "Procesando búsqueda"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 border-b border-border/70 pb-4 flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm text-muted-foreground">Listado de productos</p>
          <p className="text-base lg:text-lg text-foreground font-medium">
            {allProducts.length} resultados{" "}
            {formattedProduct ? `para "${formattedProduct}"` : ""}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </p>
      </div>

      <ProductResults data={paginatedProducts} />

      {allProducts.length > PAGE_SIZE && (
        <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="h-10 px-4 border border-border bg-background text-sm text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          {visiblePages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`h-10 min-w-10 px-3 border text-sm font-medium transition-colors ${
                currentPage === page
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-section-grey"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="h-10 px-4 border border-border bg-background text-sm text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
