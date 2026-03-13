import {
  ArrowRight,
  BellRing,
  CalendarClock,
  Globe2,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./button";
import { PLAN_LIMITS, SUBSCRIPTION_TIERS } from "@/lib/pricing/plans";

const freePlanLimits = PLAN_LIMITS[SUBSCRIPTION_TIERS.BASIC];

const freeItems = [
  {
    icon: Search,
    title: `Hasta ${freePlanLimits.maxSavedProducts} productos guardados`,
    subtitle: `Y seguimiento activo de hasta ${freePlanLimits.maxFollowedProducts} productos en tu dashboard.`,
  },
  {
    icon: BellRing,
    title: "Alertas básicas de precio",
    subtitle: "Recibe avisos cuando haya cambios relevantes en productos seguidos.",
  },
  {
    icon: CalendarClock,
    title: "Actualización diaria",
    subtitle: "Ideal para compras no urgentes y monitoreo simple de oportunidades.",
  },
  {
    icon: ShieldCheck,
    title: "Chequeo de seguridad de compra",
    subtitle: "Señales básicas de confianza del vendedor y del sitio.",
  },
];

const premiumItems = [
  {
    icon: Sparkles,
    title: "Productos y seguimiento ilimitado",
    subtitle: "Sin tope de guardados para monitorear todas tus compras importantes.",
  },
  {
    icon: Globe2,
    title: "Análisis de múltiples tiendas",
    subtitle:
      "Comparamos el mismo producto entre diferentes vendedores y marketplaces para recomendar la mejor opción real.",
  },
  {
    icon: BellRing,
    title: "Alertas prioritarias",
    subtitle: "Notificaciones más rápidas para aprovechar ofertas antes que se agoten.",
  },
  {
    icon: Search,
    title: "Comparación local e internacional",
    subtitle: "Análisis completo entre marketplaces y fuentes externas de precio.",
  },
  {
    icon: CalendarClock,
    title: "Historial extendido y análisis avanzado",
    subtitle: "Más contexto para detectar tendencias reales y falsos descuentos.",
  },
];

const sharedBenefits = [
  "Dashboard personal con productos guardados y resumen de ahorro",
  "Conversión ARS/USD con cotización actualizada semanalmente",
  "Detección de oportunidades y variaciones de precio por tienda",
];

function PlanCard({
  eyebrow,
  title,
  description,
  items,
  ctaHref,
  ctaLabel,
  secondaryLabel,
  highlighted = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: typeof freeItems;
  ctaHref: string;
  ctaLabel: string;
  secondaryLabel: string;
  highlighted?: boolean;
}) {
  const accentText = highlighted ? "text-primary" : "text-foreground";
  const accentBg = highlighted ? "bg-primary" : "bg-foreground";

  return (
    <article
      className={`p-7 lg:p-8 ${
        highlighted
          ? "relative shadow-[inset_0_0_0_1px_hsl(var(--primary))]"
          : ""
      }`}
    >
      {highlighted && (
        <span className="absolute right-7 top-7 inline-flex items-center border border-primary/40 bg-primary/10 px-3 py-1 text-[0.95rem] font-medium tracking-tight text-primary">
          Popular
        </span>
      )}
      <p className={`inline-flex items-center gap-2 text-[1.05rem] ${accentText}`}>
        <span className={`w-2 h-2 ${accentBg}`} />
        {eyebrow}
        <span className={`w-2 h-2 ${accentBg}`} />
      </p>

      <h3 className="text-[2rem] lg:text-[2.2rem] tracking-tight leading-none font-medium text-foreground mt-5">
        {title}
      </h3>

      <p className="text-[1.45rem] leading-[1.4] text-muted-foreground mt-4 max-w-[44rem]">
        {description}
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Link
          href={ctaHref}
          className={`inline-flex items-center justify-between gap-4 min-w-[14rem] h-12 px-5 text-[1.15rem] leading-none ${
            highlighted ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
          }`}
        >
          <span>{ctaLabel}</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Button variant="secondary" className="h-12 px-5 text-[1.15rem]">
          {secondaryLabel}
        </Button>
      </div>

      <div className="mt-7">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`py-5 ${index !== items.length - 1 ? "border-b border-border/70" : ""}`}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={`w-5 h-5 mt-1 shrink-0 ${highlighted ? "text-primary" : "text-foreground"}`}
                />
                <div>
                  <p className="text-[1.35rem] leading-[1.22] text-foreground">{item.title}</p>
                  <p className="text-[1.05rem] leading-[1.35] text-muted-foreground mt-1">
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
    <section className="border-t border-border/70">
      <div className="max-w-[94rem] mx-auto padding-global">
        <div className="border-x border-border/70">
          <div className="bg-background border-b border-border/70 px-6 py-14 lg:py-16 text-center">
            <p className="inline-flex items-center gap-2 text-[1.1rem] text-muted-foreground">
              <span className="w-2 h-2 bg-primary" />
              Planes Savemelin
              <span className="w-2 h-2 bg-primary" />
            </p>
            <h2 className="text-[4rem] lg:text-[5rem] leading-[0.95] tracking-tight font-medium text-foreground mt-5">
              Ahorrá a tu ritmo
            </h2>
            <p className="text-[1.65rem] text-muted-foreground leading-[1.4] max-w-[56rem] mx-auto mt-6">
              El plan gratuito cubre seguimiento esencial. Premium concentra lo
              más costoso en infraestructura: monitoreo avanzado, más fuentes y
              mayor velocidad para detectar oportunidades reales.
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
              <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-border/70">
                <PlanCard
                  eyebrow="Plan gratuito"
                  title="Savemelin Free"
                  description={`Guardá y seguí hasta ${freePlanLimits.maxSavedProducts} productos con alertas básicas para compras inteligentes sin costo.`}
                  items={freeItems}
                  ctaHref="/sign-up"
                  ctaLabel="Comenzar gratis"
                  secondaryLabel="Ver dashboard"
                />
                <PlanCard
                  highlighted
                  eyebrow="Plan premium"
                  title="Savemelin Premium"
                  description="Desbloqueá capacidad y velocidad: seguimiento sin límites, más cobertura de fuentes y mejores señales para ahorrar más."
                  items={premiumItems}
                  ctaHref="/sign-up"
                  ctaLabel="Quiero Premium"
                  secondaryLabel="Comparar planes"
                />
              </div>
            </div>

            <div className="relative mt-2 border border-border/70 bg-primary/10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/70">
              {sharedBenefits.map((benefit) => (
                <div key={benefit} className="py-6 px-5 text-center">
                  <div className="inline-flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground text-xs">
                    ✓
                  </div>
                  <p className="mt-4 text-[1.25rem] leading-[1.35] text-foreground">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>

            <div className="relative mt-3 rounded-sm border border-border/70 bg-background px-5 py-4">
              <p className="text-[1rem] text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground inline-flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  Límite Free activo:
                </span>{" "}
                hasta {freePlanLimits.maxSavedProducts} productos guardados y
                seguidos por cuenta. Premium elimina este tope.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
