"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Globe, Tag, Target, Zap } from "lucide-react";

type TabItem = {
  id: string;
  label: string;
  icon: typeof Zap;
};

type ProductCard = {
  store: string;
  name: string;
  price: string;
  oldPrice: string;
  discount: string;
  shipping: string;
};

type CategoryContent = {
  title: string;
  description: string;
  products: ProductCard[];
};

const AUTO_SWITCH_MS = 6000;

const tabs: TabItem[] = [
  { id: "electronics", label: "Electrónica", icon: Zap },
  { id: "fashion", label: "Vestimenta y Accesorios", icon: Eye },
  { id: "food", label: "Alimentos", icon: Globe },
  { id: "appliances", label: "Electrodomésticos", icon: Target },
];

const tabContent: Record<string, CategoryContent> = {
  electronics: {
    title: "Destacados en Electrónica",
    description:
      "SaveMelin detecta en tiempo real los mejores precios publicados para productos tecnológicos y te muestra ofertas comparables entre marketplaces.",
    products: [
      {
        store: "Mercado Libre",
        name: "iPhone 17 Pro 256GB",
        price: "$1.799.999",
        oldPrice: "$2.199.999",
        discount: "-18%",
        shipping: "Envío gratis",
      },
      {
        store: "Amazon",
        name: "Samsung S24 Ultra 512GB",
        price: "$2.349.999",
        oldPrice: "$2.799.999",
        discount: "-16%",
        shipping: "Full",
      },
      {
        store: "eBay",
        name: "AirPods Pro (2da gen)",
        price: "$649.999",
        oldPrice: "$799.999",
        discount: "-19%",
        shipping: "Retiro hoy",
      },
      {
        store: "Google Shopping",
        name: "PlayStation 5 Slim 1TB",
        price: "$999.999",
        oldPrice: "$1.169.999",
        discount: "-14%",
        shipping: "Entrega 24h",
      },
      {
        store: "Frávega",
        name: "Smart TV 55\" 4K",
        price: "$739.999",
        oldPrice: "$889.999",
        discount: "-17%",
        shipping: "Envío gratis",
      },
      {
        store: "Cetrogar",
        name: "Notebook i7 16GB RAM",
        price: "$1.259.999",
        oldPrice: "$1.449.999",
        discount: "-13%",
        shipping: "6 cuotas",
      },
    ],
  },
  fashion: {
    title: "Destacados en Vestimenta y Accesorios",
    description:
      "Comparamos variaciones de precio por talle, color y tienda para mostrarte qué publicación conviene más antes de comprar.",
    products: [
      {
        store: "Mercado Libre",
        name: "Zapatillas Running Hombre",
        price: "$119.999",
        oldPrice: "$154.999",
        discount: "-22%",
        shipping: "Envío gratis",
      },
      {
        store: "Amazon",
        name: "Campera impermeable mujer",
        price: "$94.999",
        oldPrice: "$129.999",
        discount: "-27%",
        shipping: "Entrega 48h",
      },
      {
        store: "eBay",
        name: "Smartwatch deportivo",
        price: "$84.999",
        oldPrice: "$109.999",
        discount: "-23%",
        shipping: "Retiro hoy",
      },
      {
        store: "Google Shopping",
        name: "Mochila urbana 22L",
        price: "$39.999",
        oldPrice: "$54.999",
        discount: "-26%",
        shipping: "Envío gratis",
      },
      {
        store: "Dafiti",
        name: "Jeans slim fit",
        price: "$45.999",
        oldPrice: "$58.999",
        discount: "-21%",
        shipping: "3 cuotas",
      },
      {
        store: "Netshoes",
        name: "Remera dry-fit",
        price: "$21.999",
        oldPrice: "$29.999",
        discount: "-26%",
        shipping: "Envío gratis",
      },
    ],
  },
  food: {
    title: "Destacados en Alimentos",
    description:
      "El motor identifica promociones reales en supermercados online y te ayuda a detectar cuándo conviene stockearte.",
    products: [
      {
        store: "Mercado Libre",
        name: "Pack Yerba Mate x6",
        price: "$26.999",
        oldPrice: "$33.999",
        discount: "-21%",
        shipping: "Full",
      },
      {
        store: "Amazon",
        name: "Cápsulas de café x60",
        price: "$19.999",
        oldPrice: "$26.999",
        discount: "-26%",
        shipping: "Envío gratis",
      },
      {
        store: "Carrefour",
        name: "Aceite de oliva 500ml x3",
        price: "$16.499",
        oldPrice: "$21.499",
        discount: "-23%",
        shipping: "Retiro hoy",
      },
      {
        store: "Coto Digital",
        name: "Arroz largo fino 1kg x12",
        price: "$18.999",
        oldPrice: "$24.999",
        discount: "-24%",
        shipping: "Entrega 24h",
      },
      {
        store: "Jumbo",
        name: "Leche descremada x12",
        price: "$15.999",
        oldPrice: "$19.999",
        discount: "-20%",
        shipping: "Envío gratis",
      },
      {
        store: "Disco",
        name: "Atún al natural x8",
        price: "$13.999",
        oldPrice: "$17.499",
        discount: "-20%",
        shipping: "2 cuotas",
      },
    ],
  },
  appliances: {
    title: "Destacados en Electrodomésticos",
    description:
      "Monitoreamos cambios de precio diarios en línea blanca y pequeños electrodomésticos para mostrarte oportunidades de ahorro concretas.",
    products: [
      {
        store: "Mercado Libre",
        name: "Heladera No Frost 420L",
        price: "$1.689.999",
        oldPrice: "$2.049.999",
        discount: "-18%",
        shipping: "Envío gratis",
      },
      {
        store: "Amazon",
        name: "Lavarropas Inverter 9kg",
        price: "$1.099.999",
        oldPrice: "$1.349.999",
        discount: "-19%",
        shipping: "Entrega 48h",
      },
      {
        store: "Frávega",
        name: "Microondas digital 28L",
        price: "$259.999",
        oldPrice: "$319.999",
        discount: "-19%",
        shipping: "Retiro hoy",
      },
      {
        store: "Garbarino",
        name: "Aspiradora ciclónica",
        price: "$189.999",
        oldPrice: "$239.999",
        discount: "-20%",
        shipping: "Envío gratis",
      },
      {
        store: "Cetrogar",
        name: "Cafetera automática",
        price: "$329.999",
        oldPrice: "$419.999",
        discount: "-21%",
        shipping: "6 cuotas",
      },
      {
        store: "Google Shopping",
        name: "Freidora de aire 6.5L",
        price: "$219.999",
        oldPrice: "$279.999",
        discount: "-21%",
        shipping: "Entrega 24h",
      },
    ],
  },
};

function nextTabId(currentTabId: string): string {
  const currentIndex = tabs.findIndex((tab) => tab.id === currentTabId);
  const nextIndex = (currentIndex + 1) % tabs.length;
  return tabs[nextIndex].id;
}

export default function PixelPerfectFeaturesTabSection() {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const [progress, setProgress] = useState(0);
  const [restartKey, setRestartKey] = useState(0);

  const activeCategory = useMemo(() => tabContent[activeTab], [activeTab]);
  const activeTabMeta = useMemo(
    () => tabs.find((tab) => tab.id === activeTab) ?? tabs[0],
    [activeTab],
  );
  const ActiveIcon = activeTabMeta.icon;

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

  const handleTabClick = (tabId: string) => {
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
              Productos destacados por categoría
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
                {activeCategory.title}
              </h3>

              <p className="text-sm leading-relaxed text-muted-foreground mb-5">
                {activeCategory.description}
              </p>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="text-foreground font-medium">
                    {activeCategory.products.length}
                  </span>{" "}
                  productos destacados
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {activeCategory.products.map((product) => (
                  <article
                    key={`${activeTab}-${product.store}-${product.name}`}
                    className="bg-section-grey border border-border/70 p-4 min-h-[11.5rem] flex flex-col gap-3"
                  >
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
                        Destacado
                      </span>
                    </header>

                    <div className="mt-auto">
                      <div className="flex items-end gap-2 flex-wrap">
                        <span className="text-xl font-semibold text-foreground tracking-tight">
                          {product.price}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          {product.oldPrice}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2 gap-3">
                        <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground">
                          {product.discount}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {product.shipping}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
