"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, MousePointer2, Store, BadgePercent } from "lucide-react";

function CenterBurst() {
  const rays = [
    { deg: 0, len: 34 },
    { deg: 42, len: 20 },
    { deg: 88, len: 28 },
    { deg: 132, len: 24 },
    { deg: 178, len: 34 },
    { deg: 222, len: 20 },
    { deg: 268, len: 28 },
    { deg: 312, len: 26 },
  ];

  return (
    <div className="relative h-[8.2cqw] w-[8.2cqw]">
      {rays.map((ray, index) => (
        <span
          key={`${ray.deg}-${index}`}
          className="absolute left-1/2 top-1/2 block w-[1.05cqw] -translate-x-1/2 -translate-y-1/2"
          style={{
            height: `${ray.len / 10}cqw`,
            transform: `translate(-50%, -50%) rotate(${ray.deg}deg)`,
          }}
        >
          <span className="absolute left-0 top-0 block h-[1.9cqw] w-full bg-primary" />
        </span>
      ))}
      <span className="absolute left-1/2 top-1/2 h-[2.25cqw] w-[2.25cqw] -translate-x-1/2 -translate-y-1/2 rounded-[0.24cqw] bg-background" />
    </div>
  );
}

export default function PixelPerfectDataVisualization() {
  const query = "iPhone 17 Pro 256GB";
  const [typedText, setTypedText] = useState("");
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    setTypedText("");
    setShowCards(false);

    let index = 0;
    let revealTimeout: ReturnType<typeof setTimeout> | undefined;

    const interval = setInterval(() => {
      index += 1;
      setTypedText(query.slice(0, index));

      if (index >= query.length) {
        clearInterval(interval);
        revealTimeout = setTimeout(() => setShowCards(true), 250);
      }
    }, 75);

    return () => {
      clearInterval(interval);
      if (revealTimeout) {
        clearTimeout(revealTimeout);
      }
    };
  }, []);

  const bars = useMemo(
    () =>
      Array.from({ length: 240 }, (_, index) => {
        const column = index % 60;
        const row = Math.floor(index / 60);
        const x = column * 1.67 + ((column * 17) % 9) * 0.03;
        const yBase = row * 11.8 + ((column * 31 + row * 7) % 14) * 0.28;
        const y = 2 + (yBase % 45);
        const h = 1.4 + ((column * 13 + row * 11) % 30) * 0.1;
        const w = 0.8 + ((column * 7 + row * 5) % 8) * 0.08;
        const opacities = [0.09, 0.14, 0.18, 0.24, 0.3];

        return {
          x,
          y,
          h,
          w,
          opacity: opacities[(column + row) % opacities.length],
        };
      }),
    [],
  );

  return (
    <div className="relative w-full aspect-square overflow-hidden border-l border-border bg-muted/60 [container-type:inline-size]">
      <div className="absolute inset-0">
        {bars.map((bar, index) => (
          <div
            key={index}
            className="absolute rounded-[1px] bg-primary"
            style={{
              left: `${bar.x}%`,
              top: `${bar.y}%`,
              width: `${bar.w}%`,
              height: `${bar.h}%`,
              opacity: bar.opacity as number,
            }}
          />
        ))}
      </div>

      <div className="absolute left-1/2 top-[13%] w-[40.8%] -translate-x-1/2 rounded-[0.12cqw] border border-foreground/70 bg-background px-[2.1%] py-[1.65%]">
        <div className="flex items-center gap-[1.2cqw]">
          <Search
            className="h-[2.65cqw] w-[2.65cqw] text-muted-foreground"
            strokeWidth={1.6}
          />
          <span className="text-[3.35cqw] font-medium leading-none text-foreground">
            {typedText}
            {!showCards && (
              <span className="ml-[0.2cqw] animate-pulse text-muted-foreground">
                |
              </span>
            )}
          </span>
        </div>
      </div>

      <div className="absolute left-0 right-0 top-[49.2%] h-[0.34%] bg-primary" />

      <article
        className={`absolute left-[11%] top-[21.1%] w-[28.7%] rounded-[0.15cqw] border border-border bg-background px-[1.35%] py-[1.15%] transition-all duration-500 ${
          showCards
            ? "translate-y-0 opacity-100"
            : "translate-y-[1.4cqw] opacity-0"
        }`}
      >
        <div className="mb-[0.65cqw] flex items-center gap-[0.45cqw]">
          <Store className="h-[1.35cqw] w-[1.35cqw] text-primary" />
          <p className="text-[1.7cqw] font-medium text-foreground">
            Mercado Libre
          </p>
          <span className="text-[1.05cqw] text-muted-foreground">4h ago</span>
        </div>
        <p className="mb-[0.58cqw] text-[2.05cqw] leading-[1.25] text-foreground">
          iPhone 17 Pro 256GB
        </p>
        <div className="mb-[0.6cqw] flex items-end gap-[0.75cqw]">
          <span className="text-[1.45cqw] text-muted-foreground line-through">
            $2.199.999
          </span>
          <span className="text-[2.15cqw] font-semibold text-primary">
            $1.799.999
          </span>
        </div>
        <div className="mb-[0.5cqw] h-[0.84cqw] w-full bg-muted" />
        <div className="mb-[0.5cqw] h-[0.84cqw] w-[84%] bg-muted" />
        <div className="mt-[0.62cqw] flex items-center justify-between">
          <span className="text-[1.1cqw] text-muted-foreground">
            12 cuotas sin interés
          </span>
          <span className="rounded-[0.18cqw] bg-primary-green px-[0.42cqw] py-[0.14cqw] text-[1.05cqw] font-semibold text-white">
            -18% OFF
          </span>
        </div>
      </article>

      <article
        className={`absolute left-[43.2%] top-[33.2%] w-[30%] rounded-[0.15cqw] border border-border bg-background px-[1.15%] py-[1.15%] transition-all duration-500 ${
          showCards
            ? "translate-y-0 opacity-100"
            : "translate-y-[1.4cqw] opacity-0"
        }`}
        style={{ transitionDelay: showCards ? "120ms" : "0ms" }}
      >
        <div className="mb-[0.62cqw] flex items-center gap-[0.55cqw]">
          <BadgePercent className="h-[1.25cqw] w-[1.25cqw] text-primary" />
          <p className="text-[1.82cqw] font-medium leading-none text-foreground">
            Oferta destacada
          </p>
          <span className="text-[1.05cqw] text-muted-foreground">2h ago</span>
        </div>
        <p className="text-[1.96cqw] leading-[1.3] text-foreground">
          Samsung S24 Ultra 512GB
        </p>
        <div className="mt-[0.65cqw] flex items-end gap-[0.68cqw]">
          <span className="text-[1.38cqw] text-muted-foreground line-through">
            $2.999.999
          </span>
          <span className="text-[2.1cqw] font-semibold text-primary">
            $2.349.999
          </span>
        </div>
        <div className="mt-[0.55cqw] h-[0.84cqw] w-full bg-muted" />
        <div className="mt-[0.55cqw] h-[0.84cqw] w-[88%] bg-muted" />
        <div className="mt-[0.72cqw] flex items-center justify-between">
          <span className="text-[1.1cqw] text-muted-foreground">
            Envío gratis · Full
          </span>
          <span className="rounded-[0.18cqw] bg-primary-green px-[0.42cqw] py-[0.14cqw] text-[1.05cqw] font-semibold text-white">
            -22% OFF
          </span>
        </div>
      </article>

      <article
        className={`absolute right-[1.9%] top-[25.5%] w-[20.8%] rounded-[0.15cqw] border border-border bg-background px-[1.05%] py-[1.05%] transition-all duration-500 ${
          showCards
            ? "translate-y-0 opacity-100"
            : "translate-y-[1.4cqw] opacity-0"
        }`}
        style={{ transitionDelay: showCards ? "220ms" : "0ms" }}
      >
        <div className="mb-[0.72cqw] flex items-center gap-[0.62cqw]">
          <span className="h-[2.2cqw] w-[2.2cqw] rounded bg-muted" />
          <span className="h-[0.7cqw] w-[7.5cqw] bg-muted" />
        </div>
        <div className="mb-[0.62cqw] h-[13.1cqw] bg-muted/90" />
        <p className="mb-[0.35cqw] text-[1.1cqw] font-semibold text-muted-foreground">
          1h ago · Frávega
        </p>
        <p className="text-[1.88cqw] leading-[1.3] text-foreground">
          AirPods Pro (2da gen)
        </p>
        <div className="mt-[0.5cqw] flex items-end gap-[0.55cqw]">
          <span className="text-[1.24cqw] text-muted-foreground line-through">
            $799.999
          </span>
          <span className="text-[1.86cqw] font-semibold text-primary">
            $649.999
          </span>
        </div>
        <div className="mt-[0.42cqw] flex items-center justify-between text-[1.05cqw] text-muted-foreground">
          <span>Retiro hoy</span>
          <span className="rounded-[0.18cqw] bg-primary-green px-[0.38cqw] py-[0.14cqw] font-semibold text-white">
            -19% OFF
          </span>
        </div>
      </article>

      <div className="absolute left-1/2 top-[49.2%] z-10 h-[14%] w-[14%] -translate-x-1/2 -translate-y-1/2 border-[0.18cqw] border-primary/70 bg-primary/10 flex items-center justify-center">
        <CenterBurst />
      </div>

      <div className="absolute left-1/2 top-[56.2%] h-[5.2%] w-[0.2%] -translate-x-1/2 border-l-[0.2cqw] border-dashed border-border" />
      <div className="absolute left-[45.6%] top-[61.8%] h-[3.2%] w-[0.2%] border-l-[0.2cqw] border-dashed border-border" />
      <div className="absolute left-[63.7%] top-[61.8%] h-[4.2%] w-[0.2%] border-l-[0.2cqw] border-dashed border-border" />
      <div className="absolute left-[44.1%] top-[61.8%] h-[0.7%] w-[1.7%] bg-primary" />
      <div className="absolute left-[50.1%] top-[63.2%] h-[1.7%] w-[0.95%] bg-primary" />
      <div className="absolute left-[63.6%] top-[64.1%] h-[1.65%] w-[0.95%] bg-primary" />

      <div className="absolute left-1/2 top-[65.2%] w-[75.6%] -translate-x-1/2 border border-border bg-background px-[2.5%] py-[1.6%]">
        <div className="flex items-center gap-[1.5cqw] whitespace-nowrap">
          <div className="flex gap-[0.5cqw]">
            {Array.from({ length: 8 }).map((_, index) => (
              <span
                key={index}
                className="h-[1.55cqw] w-[0.62cqw] bg-primary"
              />
            ))}
          </div>
          <p className="text-[1.85cqw] font-medium leading-none text-foreground">
            384,589
          </p>
          <p className="text-[1.8cqw] leading-none text-muted-foreground">
            productos con descuento
          </p>
          <p className="ml-[0.7cqw] text-[1.7cqw] leading-none text-muted-foreground">
            Exportar
          </p>
          <p className="text-[1.7cqw] leading-none text-foreground">API Call</p>
          <p className="text-[1.7cqw] leading-none text-foreground">CSV/XLS</p>
        </div>
      </div>

      <div className="absolute left-1/2 top-[71.8%] h-[24%] w-[75.6%] -translate-x-1/2 overflow-hidden border border-border bg-background px-[5.7%] py-[3.3%]">
        <div className="mb-[1.1cqw] flex items-center gap-[1.8cqw] text-[1.85cqw] text-muted-foreground/35">
          <span>Tiempo real</span>
          <span>Tiendas</span>
        </div>
        <p className="text-[2.25cqw] leading-[1.26] text-muted-foreground/40">
          iPhone 17 Pro 256GB bajó un 18% en Mercado Libre. Activá alerta para
          próximos cambios de precio.
        </p>
        <div className="mt-[1.5cqw] flex items-center gap-[1.8cqw] text-[1.65cqw] text-muted-foreground/35">
          <span>@savemelin</span>
          <span>Hoy, 16:25</span>
        </div>
        <div className="mt-[1.3cqw] flex items-center gap-[1.8cqw] text-[1.65cqw] text-muted-foreground/35">
          <span>♡ 156</span>
          <span>↗ 32</span>
        </div>
      </div>

      <div className="absolute left-1/2 top-[96%] w-[75.6%] h-[3.4%] -translate-x-1/2 border border-border bg-background" />

      <MousePointer2 className="absolute right-[10.9%] top-[79.2%] h-[2.65cqw] w-[2.65cqw] text-muted-foreground" />
    </div>
  );
}
