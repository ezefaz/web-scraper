import {
  ArrowRight,
  BellRing,
  CalendarClock,
  Globe2,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import { Button } from "./button";
import {
  PLAN_COST_MATRIX,
  PLAN_LIMITS,
  SUBSCRIPTION_TIERS,
  type SubscriptionTier,
} from "@/lib/pricing/plans";

const PLAN_ORDER: SubscriptionTier[] = [
  SUBSCRIPTION_TIERS.BASIC,
  SUBSCRIPTION_TIERS.PLUS,
  SUBSCRIPTION_TIERS.PRO,
  SUBSCRIPTION_TIERS.TEAM,
];

const PLAN_UI: Record<
  SubscriptionTier,
  {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    secondaryLabel: string;
    highlighted?: boolean;
  }
> = {
  [SUBSCRIPTION_TIERS.BASIC]: {
    eyebrow: "Para empezar",
    title: "Plan Gratis",
    description:
      "Empezá a seguir precios y recibí alertas sin costo para tus compras del día a día.",
    ctaLabel: "Crear cuenta gratis",
    ctaHref: "/sign-up",
    secondaryLabel: "Ver beneficios",
  },
  [SUBSCRIPTION_TIERS.PLUS]: {
    eyebrow: "Para ahorrar más",
    title: "Plan Plus",
    description:
      "Ideal si comprás seguido y querés comparar más productos para encontrar mejores oportunidades.",
    ctaLabel: "Quiero Plus",
    ctaHref: "/sign-up",
    secondaryLabel: "Conocer Plus",
  },
  [SUBSCRIPTION_TIERS.PRO]: {
    eyebrow: "Máximo ahorro",
    title: "Plan Pro",
    description:
      "Para usuarios intensivos que quieren detectar ofertas antes y seguir muchos productos al mismo tiempo.",
    ctaLabel: "Quiero Pro",
    ctaHref: "/sign-up",
    secondaryLabel: "Comparar planes",
    highlighted: true,
  },
  [SUBSCRIPTION_TIERS.TEAM]: {
    eyebrow: "Para equipos",
    title: "Plan Negocios",
    description:
      "Monitoreá precios de tus productos y comparalos contra la competencia para reaccionar más rápido.",
    ctaLabel: "Hablar con el equipo",
    ctaHref: "/sign-up",
    secondaryLabel: "Más información",
  },
};

function formatHistoryDays(days: number) {
  if (!Number.isFinite(days)) return "Histórico completo";
  if (days >= 365) return "Histórico 12 meses";
  return `Histórico ${days} días`;
}

function formatPriceLabel(usd: number, arsReference: number) {
  if (usd === 0) return "Gratis";
  return `USD ${usd.toFixed(2)} por mes (aprox. ARS ${arsReference.toLocaleString(
    "es-AR"
  )})`;
}

function PlanCard({ tier }: { tier: SubscriptionTier }) {
  const ui = PLAN_UI[tier];
  const plan = PLAN_LIMITS[tier];
  const highlighted = Boolean(ui.highlighted);

  const accentText = highlighted ? "text-primary" : "text-foreground";
  const accentBg = highlighted ? "bg-primary" : "bg-foreground";

  const items = [
    {
      icon: Wallet,
      title: formatPriceLabel(plan.monthlyPriceUsd, plan.monthlyPriceArsReference),
      subtitle: "Pagás solo si necesitás más seguimiento y más comparaciones.",
    },
    {
      icon: Search,
      title:
        tier === SUBSCRIPTION_TIERS.TEAM
          ? `Hasta ${plan.maxSavedProducts} productos de tu catálogo`
          : `Hasta ${plan.maxSavedProducts} productos para seguir`,
      subtitle:
        tier === SUBSCRIPTION_TIERS.TEAM
          ? `Activá alertas competitivas en hasta ${plan.maxFollowedProducts} productos.`
          : `Podés activar alertas en hasta ${plan.maxFollowedProducts} productos.`,
    },
    {
      icon: CalendarClock,
      title: `Actualización ${plan.scanCadence.toLowerCase()}`,
      subtitle: formatHistoryDays(plan.priceHistoryDays),
    },
    {
      icon: Globe2,
      title:
        tier === SUBSCRIPTION_TIERS.TEAM
          ? "Precio propio vs precios de competencia"
          : plan.multiStoreComparison
            ? "Comparación en múltiples tiendas"
            : "Comparación en Mercado Libre",
      subtitle:
        tier === SUBSCRIPTION_TIERS.TEAM
          ? "Compará automáticamente tus publicaciones con otros vendedores del mercado."
          : plan.serperMonthlyCredits > 0
          ? `Incluye hasta ${plan.serperMonthlyCredits} búsquedas mensuales en otras tiendas.`
          : "En este plan solo se muestran resultados dentro de Mercado Libre.",
    },
    {
      icon: BellRing,
      title: "Alertas de precio y soporte",
      subtitle: `Nivel de atención: ${plan.supportLevel}.`,
    },
    {
      icon: ShieldCheck,
      title: "Compra con más confianza",
      subtitle: "Comparamos opciones para ayudarte a decidir mejor antes de comprar.",
    },
  ];

  return (
    <article
      className={`p-7 lg:p-8 ${
        highlighted ? "relative shadow-[inset_0_0_0_1px_hsl(var(--primary))]" : ""
      }`}
    >
      {highlighted && (
        <span className="absolute right-7 top-7 inline-flex items-center border border-primary/40 bg-primary/10 px-3 py-1 text-[0.95rem] font-medium tracking-tight text-primary">
          Popular
        </span>
      )}
      <p className={`inline-flex items-center gap-2 text-[1.05rem] ${accentText}`}>
        <span className={`w-2 h-2 ${accentBg}`} />
        {ui.eyebrow}
        <span className={`w-2 h-2 ${accentBg}`} />
      </p>

      <h3 className="text-[2rem] lg:text-[2.2rem] tracking-tight leading-none font-medium text-foreground mt-5">
        {ui.title}
      </h3>

      <p className="text-[1.25rem] leading-[1.4] text-muted-foreground mt-4 max-w-[44rem]">
        {ui.description}
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Link
          href={ui.ctaHref}
          className={`inline-flex items-center justify-between gap-4 min-w-[14rem] h-12 px-5 text-[1.15rem] leading-none ${
            highlighted
              ? "bg-primary text-primary-foreground"
              : "bg-foreground text-background"
          }`}
        >
          <span>{ui.ctaLabel}</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Button variant="secondary" className="h-12 px-5 text-[1.15rem]">
          {ui.secondaryLabel}
        </Button>
      </div>

      <div className="mt-7">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`py-4 ${index !== items.length - 1 ? "border-b border-border/70" : ""}`}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={`w-5 h-5 mt-1 shrink-0 ${highlighted ? "text-primary" : "text-foreground"}`}
                />
                <div>
                  <p className="text-[1.12rem] leading-[1.3] text-foreground">{item.title}</p>
                  <p className="text-[0.98rem] leading-[1.35] text-muted-foreground mt-1">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export default function PixelPerfectPricingSection() {
  return (
    <section id="pricing" className="border-t border-border/70">
      <div className="max-w-[94rem] mx-auto padding-global">
        <div className="border-x border-border/70">
          <div className="bg-background border-b border-border/70 px-6 py-14 lg:py-16 text-center">
            <p className="inline-flex items-center gap-2 text-[1.1rem] text-muted-foreground">
              <span className="w-2 h-2 bg-primary" />
              Planes Savemelin
              <span className="w-2 h-2 bg-primary" />
            </p>
            <h2 className="text-[3.4rem] lg:text-[4.2rem] leading-[0.95] tracking-tight font-medium text-foreground mt-5">
              Elegí el plan que mejor te ayude a ahorrar
            </h2>
            <p className="text-[1.4rem] text-muted-foreground leading-[1.4] max-w-[62rem] mx-auto mt-6">
              Empezá gratis y mejorá tu plan cuando necesites más productos, más alertas
              y comparación entre más tiendas.
            </p>
          </div>

          <div className="relative bg-section-grey px-6 lg:px-10 py-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-35"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, hsl(var(--border) / 0.55) 0 1px, transparent 1px 14px)",
              }}
            />

            <div className="relative border border-border/70 bg-background">
              <div className="grid grid-cols-1 2xl:grid-cols-2 divide-y 2xl:divide-y-0 2xl:divide-x divide-border/70">
                {PLAN_ORDER.map((tier) => (
                  <PlanCard key={tier} tier={tier} />
                ))}
              </div>
            </div>

            <div className="relative mt-4 border border-border/70 bg-background overflow-x-auto">
              <table className="w-full min-w-[880px] text-left">
                <thead className="border-b border-border/70 bg-section-grey">
                  <tr>
                    <th className="px-4 py-3 text-sm text-muted-foreground font-medium">
                      Comparativa de planes
                    </th>
                    {PLAN_ORDER.map((tier) => (
                      <th
                        key={tier}
                        className="px-4 py-3 text-sm text-foreground font-medium whitespace-nowrap"
                      >
                        {PLAN_LIMITS[tier].label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PLAN_COST_MATRIX.map((row) => (
                    <tr key={row.feature} className="border-b border-border/50 last:border-b-0">
                      <td className="px-4 py-3 text-sm text-foreground font-medium">{row.feature}</td>
                      {PLAN_ORDER.map((tier) => (
                        <td key={`${row.feature}-${tier}`} className="px-4 py-3 text-sm text-muted-foreground">
                          {row[tier]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
