"use client";

import { useEffect, useMemo, useState } from "react";
import { BellRing, CheckCircle2, Search, Store, TrendingDown } from "lucide-react";

const INITIAL_PRICE = 2_199_999;
const FINAL_PRICE = 1_799_999;
const OTHER_SITE_A_PRICE = 1_869_999;
const OTHER_SITE_B_PRICE = 1_909_999;

function formatArs(value: number) {
  return `$${Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

export default function PixelPerfectDataVisualization() {
  const query = "iPhone 17 Pro 256GB";
  const [typedText, setTypedText] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [dropActive, setDropActive] = useState(false);
  const [animatedPrice, setAnimatedPrice] = useState(INITIAL_PRICE);

  const savings = INITIAL_PRICE - FINAL_PRICE;
  const discountPct = Math.round((savings / INITIAL_PRICE) * 100);

  useEffect(() => {
    setTypedText("");
    setShowResult(false);
    setDropActive(false);
    setAnimatedPrice(INITIAL_PRICE);

    let index = 0;
    let showTimeout: ReturnType<typeof setTimeout> | undefined;
    let dropTimeout: ReturnType<typeof setTimeout> | undefined;

    const typingInterval = setInterval(() => {
      index += 1;
      setTypedText(query.slice(0, index));

      if (index >= query.length) {
        clearInterval(typingInterval);
        showTimeout = setTimeout(() => setShowResult(true), 180);
        dropTimeout = setTimeout(() => setDropActive(true), 620);
      }
    }, 62);

    return () => {
      clearInterval(typingInterval);
      if (showTimeout) {
        clearTimeout(showTimeout);
      }
      if (dropTimeout) {
        clearTimeout(dropTimeout);
      }
    };
  }, []);

  useEffect(() => {
    if (!dropActive) {
      return;
    }

    let rafId = 0;
    const start = performance.now();
    const duration = 720;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const value = INITIAL_PRICE - (INITIAL_PRICE - FINAL_PRICE) * eased;
      setAnimatedPrice(value);

      if (progress < 1) {
        rafId = window.requestAnimationFrame(step);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [dropActive]);

  const trendBars = useMemo(() => [72, 74, 73, 71, 69, 66, 54], []);
  const scanLines = useMemo(
    () => [
      { id: "trunk", x1: 50, y1: 18, x2: 50, y2: 22, delay: 60 },
      { id: "branch-left", x1: 50, y1: 22, x2: 18.25, y2: 22, delay: 140 },
      { id: "branch-right", x1: 50, y1: 22, x2: 81.75, y2: 22, delay: 140 },
      { id: "drop-main", x1: 50, y1: 22, x2: 50, y2: 26, delay: 240 },
      { id: "drop-left", x1: 18.25, y1: 22, x2: 18.25, y2: 31.2, delay: 300 },
      { id: "drop-right", x1: 81.75, y1: 22, x2: 81.75, y2: 31.2, delay: 300 },
    ],
    [],
  );
  const dashedScanLines = useMemo(
    () =>
      scanLines.map((line) => {
        const dx = line.x2 - line.x1;
        const dy = line.y2 - line.y1;
        const totalLength = Math.hypot(dx, dy) || 1;
        const ux = dx / totalLength;
        const uy = dy / totalLength;
        const dashLength = line.id === "trunk" || line.id === "drop-main" ? 1.1 : 1.3;
        const gapLength = line.id === "trunk" || line.id === "drop-main" ? 0.85 : 1;
        const stride = dashLength + gapLength;

        const segments: Array<{
          x1: number;
          y1: number;
          x2: number;
          y2: number;
          index: number;
        }> = [];

        for (let i = 0; i * stride < totalLength; i += 1) {
          const startDistance = i * stride;
          const endDistance = Math.min(startDistance + dashLength, totalLength);

          segments.push({
            x1: line.x1 + ux * startDistance,
            y1: line.y1 + uy * startDistance,
            x2: line.x1 + ux * endDistance,
            y2: line.y1 + uy * endDistance,
            index: i,
          });
        }

        return { ...line, segments };
      }),
    [scanLines],
  );
  const resultFlowLines = useMemo(
    () => [
      { id: "to-summary", x1: 50, y1: 49.2, x2: 50, y2: 59.5, delay: 120 },
      { id: "to-recommendation", x1: 50, y1: 65.6, x2: 50, y2: 70.5, delay: 260 },
    ],
    [],
  );
  const dashedResultFlowLines = useMemo(
    () =>
      resultFlowLines.map((line) => {
        const dx = line.x2 - line.x1;
        const dy = line.y2 - line.y1;
        const totalLength = Math.hypot(dx, dy) || 1;
        const ux = dx / totalLength;
        const uy = dy / totalLength;
        const dashLength = 1.1;
        const gapLength = 0.85;
        const stride = dashLength + gapLength;

        const segments: Array<{
          x1: number;
          y1: number;
          x2: number;
          y2: number;
          index: number;
        }> = [];

        for (let i = 0; i * stride < totalLength; i += 1) {
          const startDistance = i * stride;
          const endDistance = Math.min(startDistance + dashLength, totalLength);

          segments.push({
            x1: line.x1 + ux * startDistance,
            y1: line.y1 + uy * startDistance,
            x2: line.x1 + ux * endDistance,
            y2: line.y1 + uy * endDistance,
            index: i,
          });
        }

        return { ...line, segments };
      }),
    [resultFlowLines],
  );

  return (
    <div className="relative w-full aspect-square overflow-hidden border-l border-border bg-muted/45 [container-type:inline-size]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, hsl(var(--primary) / 0.32) 0 0.38cqw, transparent 0.38cqw 1.2cqw)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, hsl(var(--border) / 0.8) 0 0.12cqw, transparent 0.12cqw 4.8cqw)",
        }}
      />

      <div className="absolute left-1/2 top-[12.5%] w-[43%] -translate-x-1/2 rounded-[0.12cqw] border border-foreground/70 bg-background px-[2%] py-[1.55%]">
        <div className="flex items-center gap-[1.1cqw]">
          <Search
            className="h-[2.5cqw] w-[2.5cqw] text-muted-foreground"
            strokeWidth={1.7}
          />
          <span className="text-[2.8cqw] font-normal leading-none text-foreground">
            {typedText}
            {!showResult && (
              <span className="ml-[0.25cqw] animate-pulse text-muted-foreground">
                |
              </span>
            )}
          </span>
        </div>
      </div>

      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0"
      >
        {dashedScanLines.map((line) => (
          <g key={line.id}>
            {line.segments.map((segment) => (
              <line
                key={`${line.id}-${segment.index}`}
                x1={segment.x1}
                y1={segment.y1}
                x2={segment.x2}
                y2={segment.y2}
                strokeWidth={0.18}
                strokeLinecap="square"
                style={{
                  stroke: showResult
                    ? "hsl(var(--primary))"
                    : "hsl(var(--border))",
                  opacity: typedText.length > 0 ? (showResult ? 0.9 : 0.62) : 0,
                  transition: "stroke 220ms ease-out, opacity 200ms ease-out",
                  transitionDelay: showResult
                    ? `${line.delay + segment.index * 48}ms`
                    : "0ms",
                }}
              />
            ))}
            <circle
              cx={
                line.id === "drop-left"
                  ? 18.25
                  : line.id === "drop-right"
                    ? 81.75
                    : 50
              }
              cy={
                line.id === "drop-left" || line.id === "drop-right" ? 31.2 : 26
              }
              r="0.38"
              fill="hsl(var(--primary))"
              style={{
                opacity:
                  showResult &&
                  (line.id === "drop-main" ||
                    line.id === "drop-left" ||
                    line.id === "drop-right")
                    ? 0.85
                    : 0,
                transition: "opacity 180ms ease-out",
                transitionDelay: showResult
                  ? `${line.delay + line.segments.length * 48 + 40}ms`
                  : "0ms",
              }}
            />
          </g>
        ))}
        {dashedResultFlowLines.map((line) => (
          <g key={line.id}>
            {line.segments.map((segment) => (
              <line
                key={`${line.id}-${segment.index}`}
                x1={segment.x1}
                y1={segment.y1}
                x2={segment.x2}
                y2={segment.y2}
                strokeWidth={0.18}
                strokeLinecap="square"
                style={{
                  stroke: dropActive
                    ? "hsl(var(--primary))"
                    : "hsl(var(--border))",
                  opacity: showResult ? (dropActive ? 0.9 : 0.4) : 0,
                  transition: "stroke 220ms ease-out, opacity 200ms ease-out",
                  transitionDelay: dropActive
                    ? `${line.delay + segment.index * 46}ms`
                    : "0ms",
                }}
              />
            ))}
            <circle
              cx={50}
              cy={line.id === "to-summary" ? 59.5 : 70.5}
              r="0.34"
              fill="hsl(var(--primary))"
              style={{
                opacity: dropActive ? 0.85 : 0,
                transition: "opacity 180ms ease-out",
                transitionDelay: dropActive
                  ? `${line.delay + line.segments.length * 46 + 30}ms`
                  : "0ms",
              }}
            />
          </g>
        ))}
      </svg>

      <article
        className={`absolute left-1/2 top-[26%] w-[46%] -translate-x-1/2 rounded-[0.2cqw] border border-border bg-background px-[2.15%] py-[1.9%] shadow-sm transition-all duration-500 ${
          showResult
            ? "translate-y-0 opacity-100"
            : "translate-y-[1.6cqw] opacity-0"
        }`}
      >
        <div className="mb-[0.82cqw] flex items-center gap-[0.55cqw]">
          <Store className="h-[1.45cqw] w-[1.45cqw] text-primary" />
          <p className="text-[1.65cqw] font-medium text-foreground">Mercado Libre</p>
          <span className="text-[1.05cqw] text-muted-foreground">hace 4h</span>
        </div>

        <p className="mb-[0.72cqw] text-[2.15cqw] leading-[1.3] text-foreground">
          iPhone 17 Pro 256GB
        </p>

        <div className="mb-[0.95cqw] flex items-end gap-[0.8cqw]">
          <span className="text-[1.45cqw] text-muted-foreground line-through">
            {formatArs(INITIAL_PRICE)}
          </span>
          <span className="text-[2.35cqw] font-semibold text-primary">
            {formatArs(animatedPrice)}
          </span>
        </div>

        <div className="mb-[0.68cqw] flex items-center justify-between">
          <span className="text-[1.14cqw] text-muted-foreground">
            Precio detectado hoy
          </span>
          <span className="rounded-[0.2cqw] bg-primary-green px-[0.42cqw] py-[0.15cqw] text-[1.02cqw] font-semibold text-white">
            -{discountPct}% OFF
          </span>
        </div>

        <div className="h-[6.4cqw] rounded-[0.14cqw] bg-muted/55 p-[0.55cqw]">
          <div className="flex h-full items-end gap-[0.45cqw]">
            {trendBars.map((height, index) => (
              <span
                key={index}
                className={`w-[0.62cqw] rounded-t-[0.12cqw] transition-[height] duration-500 ${
                  index === trendBars.length - 1 ? "bg-primary" : "bg-foreground/20"
                }`}
                style={{
                  height: `${dropActive ? height : 28}%`,
                  transitionDelay: dropActive ? `${index * 50}ms` : "0ms",
                }}
              />
            ))}
          </div>
        </div>
      </article>

      <article
        className={`absolute left-[7%] top-[31.2%] w-[22.5%] rounded-[0.18cqw] border border-border bg-background px-[1.3%] py-[1.2%] shadow-sm transition-all duration-500 ${
          showResult
            ? "translate-y-0 opacity-100"
            : "translate-y-[1.4cqw] opacity-0"
        }`}
        style={{ transitionDelay: showResult ? "120ms" : "0ms" }}
      >
        <div className="mb-[0.52cqw] flex items-center gap-[0.42cqw]">
          <Store className="h-[1.12cqw] w-[1.12cqw] text-muted-foreground" />
          <p className="text-[1.22cqw] font-medium text-foreground">Frávega</p>
        </div>
        <p className="mb-[0.45cqw] text-[1.16cqw] leading-[1.2] text-muted-foreground">
          iPhone 17 Pro 256GB
        </p>
        <p className="text-[1.48cqw] font-semibold text-foreground">
          {formatArs(OTHER_SITE_A_PRICE)}
        </p>
        <div className="mt-[0.58cqw] flex items-center gap-[0.34cqw] text-[0.95cqw] text-muted-foreground">
          <CheckCircle2 className="h-[1cqw] w-[1cqw] text-primary-green" />
          <span>Precio verificado</span>
        </div>
      </article>

      <article
        className={`absolute right-[7%] top-[31.2%] w-[22.5%] rounded-[0.18cqw] border border-border bg-background px-[1.3%] py-[1.2%] shadow-sm transition-all duration-500 ${
          showResult
            ? "translate-y-0 opacity-100"
            : "translate-y-[1.4cqw] opacity-0"
        }`}
        style={{ transitionDelay: showResult ? "200ms" : "0ms" }}
      >
        <div className="mb-[0.52cqw] flex items-center gap-[0.42cqw]">
          <Store className="h-[1.12cqw] w-[1.12cqw] text-muted-foreground" />
          <p className="text-[1.22cqw] font-medium text-foreground">
            Cetrogar
          </p>
        </div>
        <p className="mb-[0.45cqw] text-[1.16cqw] leading-[1.2] text-muted-foreground">
          iPhone 17 Pro 256GB
        </p>
        <p className="text-[1.48cqw] font-semibold text-foreground">
          {formatArs(OTHER_SITE_B_PRICE)}
        </p>
        <div className="mt-[0.58cqw] flex items-center gap-[0.34cqw] text-[0.95cqw] text-muted-foreground">
          <CheckCircle2 className="h-[1cqw] w-[1cqw] text-primary-green" />
          <span>Precio verificado</span>
        </div>
      </article>

      <div
        className={`absolute left-1/2 top-[59.5%] w-[58%] -translate-x-1/2 rounded-[0.16cqw] border border-border bg-background px-[2.05%] py-[1.35%] transition-all duration-500 ${
          dropActive ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center justify-between gap-[1cqw]">
          <div className="flex items-center gap-[0.65cqw]">
            <TrendingDown className="h-[1.5cqw] w-[1.5cqw] text-primary" />
            <p className="text-[1.55cqw] text-foreground">
              Ahorro detectado:{" "}
              <span className="font-semibold text-primary">
                {formatArs(savings)}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-[0.45cqw] text-muted-foreground">
            <BellRing className="h-[1.28cqw] w-[1.28cqw]" />
            <span className="text-[1.15cqw]">Alerta activa</span>
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 top-[70.5%] w-[58%] -translate-x-1/2 border border-border bg-background px-[2.05%] py-[1.7%]">
        <p className="mb-[0.62cqw] text-[1.12cqw] text-muted-foreground">
          Recomendación de compra
        </p>
        <p className="text-[1.7cqw] leading-[1.34] text-foreground">
          Comprá hoy: precio en mínimo semanal y tendencia bajista confirmada.
        </p>
      </div>
    </div>
  );
}
