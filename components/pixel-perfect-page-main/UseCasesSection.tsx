import type { ComponentType } from "react";
import { AlertTriangle, Asterisk } from "lucide-react";
import { waveBars } from "./visuals";

const useCases = [
  {
    mockup: "crisis",
    title: "Detección de ofertas falsas",
    description:
      "Savemelin identifica publicaciones con precios atípicos, tiendas no confiables y patrones sospechosos para ayudarte a evitar estafas antes de comprar.",
  },
  {
    mockup: "trend",
    title: "Detección del mejor precio",
    description:
      "Comparamos precios en tiempo real y detectamos el punto de compra más conveniente para que pagues menos por el mismo producto.",
  },
  {
    mockup: "rfp",
    title: "Resultados de múltiples sitios",
    description:
      "Reunimos resultados de marketplaces, tiendas oficiales y ecommerce en una sola vista para que tomes decisiones rápidas y con contexto completo.",
  },
  {
    mockup: "deals",
    title: "Ahorro masivo",
    description:
      "Activá alertas de baja de precio y oportunidades de descuento para comprar en el momento exacto y maximizar tu ahorro mensual.",
  },
  {
    mockup: "competitive",
    title: "Seguimiento de productos",
    description:
      "Guardá productos clave y monitoreá cambios de precio, disponibilidad y promociones sin tener que buscar manualmente todos los días.",
  },
  {
    mockup: "retain",
    title: "Historial de precios de los productos",
    description:
      "Visualizá la evolución histórica de cada precio para saber si una oferta es real o si conviene esperar una mejor oportunidad.",
  },
  {
    mockup: "kyc",
    title: "Análisis de precios de competencia",
    description:
      "Si vendés online, compará tus precios contra la competencia y ajustá tu estrategia para mantener margen sin perder conversiones.",
  },
  {
    mockup: "compliance",
    title: "Reporte de seguridad del sitio",
    description:
      "Evaluamos señales de confianza del sitio, reputación del vendedor y riesgos de compra para que operes con mayor seguridad.",
  },
  {
    mockup: "reporting",
    title: "Comparación local e internacional",
    description:
      "Contrastá precios locales e internacionales en la misma búsqueda para elegir la opción más rentable según costo final y tiempos de entrega.",
  },
];

function CrisisMockup() {
  return (
    <div className="bg-secondary/10 rounded-t-lg p-4 h-52 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-semibold text-foreground">
          Oferta sospechosa
        </span>
      </div>
      <div className="bg-background rounded-lg p-3 text-xs flex-1">
        <p className="text-muted-foreground font-medium mb-1">
          Publicacion detectada
        </p>
        <p className="text-foreground font-semibold text-[11px] mb-1">
          iPhone 17 Pro 256GB - $999.999
        </p>
        <p className="text-muted-foreground text-[10px] leading-relaxed mb-3">
          Precio 58% por debajo del promedio de mercado, dominio nuevo y sin
          reputacion validada.
        </p>
        <div className="flex gap-6 border-t border-border pt-2">
          <div>
            <p className="text-[10px] text-muted-foreground">Riesgo</p>
            <p className="text-xs font-bold text-amber-600 animate-[pulse_2.8s_ease-in-out_infinite]">
              Alto
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Diferencia</p>
            <p className="text-xs font-bold text-foreground animate-[pulse_2.6s_ease-in-out_infinite]">
              -58%
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Accion</p>
            <p className="text-xs font-bold text-primary">Bloquear</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrendMockup() {
  return (
    <div className="bg-secondary/10 rounded-t-lg p-4 h-52 flex flex-col">
      <div className="flex items-center gap-4 mb-3 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-foreground/30 rounded-sm" />
          <span className="text-foreground font-medium">Historico</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-primary rounded-sm" />
          <span className="text-foreground font-medium">Mejor precio</span>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mb-1 animate-[pulse_3.2s_ease-in-out_infinite]">
        Precio promedio: $1.889.400
      </p>
      <p className="text-[10px] text-muted-foreground mb-2 animate-[pulse_2.2s_ease-in-out_infinite]">
        Minimo detectado: $1.799.999
      </p>
      <div className="flex-1 relative">
        <svg
          viewBox="0 0 200 60"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <polyline
            points="0,20 30,24 60,27 90,33 120,36 140,42 160,46 200,52"
            fill="none"
            stroke="hsl(220 14% 65%)"
            strokeWidth="2"
          />
          <circle
            cx="200"
            cy="52"
            r="4"
            fill="hsl(var(--primary))"
            className="animate-[pulse_2.5s_ease-in-out_infinite]"
          />
        </svg>
      </div>
    </div>
  );
}

function RfpMockup() {
  return (
    <div className="bg-secondary/10 rounded-t-lg p-4 h-52 flex flex-col text-[10px]">
      <div className="mb-2">
        <span className="text-foreground font-medium">Fuentes consultadas</span>
        <span className="ml-1 bg-primary/20 text-primary px-1 rounded text-[9px]">
          6
        </span>
      </div>
      <div className="space-y-1.5 bg-background rounded-lg p-2.5 flex-1">
        {[
          "Mercado Libre",
          "Amazon",
          "Fravega",
          "Cetrogar",
          "Musimundo",
          "Tienda oficial",
        ].map((source, idx) => (
          <div key={source} className="flex items-center justify-between">
            <span className="text-muted-foreground">{source}</span>
            <span
              className="text-primary text-[9px] animate-[pulse_3s_ease-in-out_infinite]"
              style={{ animationDelay: `${idx * 180}ms` }}
            >
              Validado
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DealsMockup() {
  return (
    <div className="bg-secondary/10 rounded-t-lg p-4 h-52 flex flex-col justify-end">
      <p className="text-[10px] text-muted-foreground self-end mb-2">
        Ahorro mensual
      </p>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-20 h-6 bg-muted rounded animate-[pulse_3s_ease-in-out_infinite]" />
          <span className="text-[10px] text-muted-foreground">
            Sin Savemelin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Asterisk className="w-4 h-4 text-primary" strokeWidth={3} />
          <div className="flex-1 h-6 bg-primary rounded animate-[pulse_2.4s_ease-in-out_infinite]" />
          <span className="text-lg font-bold text-foreground animate-[pulse_2.2s_ease-in-out_infinite]">
            +84k
          </span>
        </div>
      </div>
    </div>
  );
}

function CompetitiveMockup() {
  return (
    <div className="bg-secondary/10 rounded-t-lg p-4 h-52 flex flex-col text-[10px]">
      <div className="flex items-center gap-1 mb-2">
        <div className="w-2 h-2 bg-primary rounded-sm animate-[pulse_2.5s_ease-in-out_infinite]" />
        <span className="text-muted-foreground">
          Seguimiento activo: 12 productos
        </span>
      </div>
      <div className="bg-background rounded-lg p-3 flex-1">
        <div className="space-y-2">
          {[
            "iPhone 17 Pro 256GB",
            "AirPods Pro 2da Gen",
            "PlayStation 5 Slim",
          ].map((product, idx) => (
            <div
              key={product}
              className={`flex items-center justify-between rounded px-2 py-1 ${
                idx === 0 ? "bg-primary/10" : ""
              }`}
            >
              <span className="text-foreground">{product}</span>
              <span
                className={`text-[9px] font-medium ${
                  idx === 0 ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {idx === 0 ? "-18%" : "sin cambios"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RetainMockup() {
  return (
    <div className="bg-secondary/10 rounded-t-lg p-4 h-52 flex items-center justify-center">
      <svg viewBox="0 0 200 100" className="w-full h-full">
        <polyline
          points="10,80 30,60 50,70 70,40 90,50 110,30 130,45 150,20 170,35 190,15"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {[10, 30, 50, 70, 90, 110, 130, 150, 170, 190].map((x, index) => {
          const y = [80, 60, 70, 40, 50, 30, 45, 20, 35, 15][index];

          return (
            <circle
              key={x}
              cx={x}
              cy={y}
              r="3"
              fill="hsl(var(--primary))"
              className="animate-[pulse_3s_ease-in-out_infinite]"
              style={{ animationDelay: `${index * 120}ms` }}
            />
          );
        })}
      </svg>
    </div>
  );
}

function KycMockup() {
  return (
    <div className="bg-secondary/10 rounded-t-lg p-4 h-52 flex flex-col text-[10px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground">Tu producto</span>
        <span className="bg-primary/15 text-primary px-2 py-0.5 rounded text-[9px] font-medium">
          Competitivo
        </span>
      </div>
      <p className="text-foreground font-medium text-[11px] mb-4 animate-[pulse_2.9s_ease-in-out_infinite]">
        iPhone 17 Pro 256GB - $1.829.999
      </p>
      <div className="bg-background rounded-lg p-3 mt-auto">
        <div className="flex items-center gap-1 mb-1">
          <Asterisk className="w-3 h-3 text-primary" strokeWidth={3} />
          <span className="font-medium text-foreground">Competencia</span>
          <span className="text-muted-foreground text-[9px]">actualizado</span>
        </div>
        <p className="font-bold text-foreground mb-0.5">
          Promedio mercado: $1.861.300
        </p>
        <p className="text-primary text-[9px] animate-[pulse_2.8s_ease-in-out_infinite]">
          Ventaja actual: +1.7% mejor precio
        </p>
      </div>
    </div>
  );
}

function ComplianceMockup() {
  const bars = waveBars(40, 2.1);

  return (
    <div className="bg-foreground rounded-t-lg p-4 h-52 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 flex items-end gap-[2px] px-4 pb-8 opacity-20">
        {bars.map((height, index) => (
          <div
            key={index}
            className="flex-1 bg-primary/60 rounded-t-sm animate-[pulse_2.6s_ease-in-out_infinite]"
            style={{
              height: `${10 + height * 70}%`,
              animationDelay: `${index * 90}ms`,
            }}
          />
        ))}
      </div>
      <div className="relative flex items-center gap-2 text-background">
        <Asterisk
          className="w-5 h-5 text-primary animate-[spin_2.8s_linear_infinite]"
          strokeWidth={3}
        />
        <div>
          <p className="text-sm font-medium">Escaneo de seguridad</p>
          <p className="text-[10px] text-background/80">
            SSL, reputacion, antiguedad y riesgo
          </p>
        </div>
      </div>
    </div>
  );
}

function ReportingMockup() {
  return (
    <div className="bg-secondary/10 rounded-t-lg p-4 h-52 flex flex-col text-[10px]">
      <div className="bg-background rounded-lg p-3 flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-foreground">
            Comparativa AR vs US
          </span>
          <span className="text-muted-foreground text-[9px]">actual</span>
        </div>
        <p className="font-bold text-foreground text-[11px] mb-1">
          iPhone 17 Pro 256GB
        </p>
        <p className="text-muted-foreground text-[9px] leading-relaxed mb-2">
          Comparamos precio local e internacional con envio e impuestos para
          recomendar el costo final mas conveniente.
        </p>
        <div className="space-y-1.5 mb-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Argentina</span>
            <span className="font-medium text-foreground animate-[pulse_3s_ease-in-out_infinite]">
              $1.799.999
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">USA + importacion</span>
            <span className="font-medium text-foreground animate-[pulse_3s_ease-in-out_infinite]">
              $1.921.300
            </span>
          </div>
        </div>
        <div className="border-t border-border pt-1.5 flex items-center justify-between">
          <p className="text-[9px] text-muted-foreground font-medium">
            Mejor opcion
          </p>
          <p className="text-[9px] text-primary font-semibold animate-[pulse_3s_ease-in-out_infinite]">
            Comprar local
          </p>
        </div>
      </div>
    </div>
  );
}

const mockupComponents: Record<string, ComponentType> = {
  crisis: CrisisMockup,
  trend: TrendMockup,
  rfp: RfpMockup,
  deals: DealsMockup,
  competitive: CompetitiveMockup,
  retain: RetainMockup,
  kyc: KycMockup,
  compliance: ComplianceMockup,
  reporting: ReportingMockup,
};

export default function PixelPerfectUseCasesSection() {
  return (
    <section className="p-12 bg-white">
      <div className="max-w-[94rem] mx-auto padding-global">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-primary">⊢</span>
              <span className="text-sm font-medium text-primary">
                Mejora tu experiencia de compra
              </span>
              <span className="text-primary">⊣</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-foreground max-w-md">
              Los motivos por los que debes usar Savemelin para comprar al mejor
              precio
            </h2>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed max-w-md lg:pt-8">
            Desde evolución de precios, detección de ofertas falsas y resultados
            de múltiples sitios — soportamos todas las instancias desde que
            buscas el producto hasta que realizas la compra para que tengas la
            mejor información posible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
          {useCases.map((useCase, index) => {
            const Mockup = mockupComponents[useCase.mockup];

            return (
              <div
                key={index}
                className="flex flex-col"
                style={{ backgroundColor: "#fafafa" }}
              >
                <Mockup />
                <div className="p-5 flex-1">
                  <h3 className="text-base font-bold text-foreground mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
