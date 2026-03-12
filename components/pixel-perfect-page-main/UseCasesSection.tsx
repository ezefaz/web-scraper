import type { ComponentType } from "react";
import { AlertTriangle, Asterisk } from "lucide-react";
import { waveBars } from "./visuals";

const useCases = [
  {
    mockup: "crisis",
    title: "Detección de ofertas falsas",
    description:
      "Detect potential crises before they escalate. Monitor reputation threats, product issues, and negative sentiment spikes in real-time across all channels.",
  },
  {
    mockup: "trend",
    title: "Detección del mejor precio",
    description:
      "Identify emerging trends before they become mainstream. Track conversation volume and topic evolution across any source you need.",
  },
  {
    mockup: "rfp",
    title: "Resultados de múltiples sitios",
    description:
      "Win enterprise contracts with deep coverage from 150+ sources that becomes the deciding factor in RFP evaluations.",
  },
  {
    mockup: "deals",
    title: "Ahorro masivo",
    description:
      "Close more deals when you integrate Datashake data. Get access to coverage that becomes undeniable competitive differentiation",
  },
  {
    mockup: "competitive",
    title: "Seguimiento de productos",
    description: "",
  },
  {
    mockup: "retain",
    title: "Historial de precios de los productos",
    description:
      "Retains your most valuable enterprise customers by delivering the comprehensive data your clients need across global markets.",
  },
  {
    mockup: "kyc",
    title: "Análisis de precios de competencia",
    description:
      "Si sos vendedor, podes utilizar la plataforma para comparar precios de tus productos.",
  },
  {
    mockup: "compliance",
    title: "Reporte de seguridad del sitio",
    description:
      "Realizamos un análisis del sitio web para verificar que tan confiable es y evitar problemas en tus compras.",
  },
  {
    mockup: "reporting",
    title: "Comparación local e internacional",
    description:
      "Agencies deliver stronger client insights with comprehensive data coverage, flexible access, and predictable pricing.",
  },
];

function CrisisMockup() {
  return (
    <div className="bg-secondary/50 rounded-t-lg p-4 h-52 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-semibold text-foreground">
          Potential Risk
        </span>
      </div>
      <div className="bg-background rounded-lg p-3 text-xs flex-1">
        <p className="text-muted-foreground font-medium mb-1">
          Social Platform
        </p>
        <p className="text-foreground font-semibold text-[11px] mb-1">
          Ethical Concerns Dominate Discussions.
        </p>
        <p className="text-muted-foreground text-[10px] leading-relaxed mb-3">
          The ethical implications of AI, including bias, misuse, and potential
          threats, are central themes in the conversations.
        </p>
        <div className="flex gap-6 border-t border-border pt-2">
          <div>
            <p className="text-[10px] text-muted-foreground">Audience</p>
            <p className="text-xs font-bold text-foreground">151.1K</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Likes</p>
            <p className="text-xs font-bold text-foreground">137.2K</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Resonance</p>
            <p className="text-xs font-bold text-primary">High</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrendMockup() {
  return (
    <div className="bg-secondary/50 rounded-t-lg p-4 h-52 flex flex-col">
      <div className="flex items-center gap-4 mb-3 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-sm" />
          <span className="text-foreground font-medium">Current</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-primary rounded-sm" />
          <span className="text-foreground font-medium">Predicted</span>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mb-1">
        89,3948 in volume
      </p>
      <p className="text-[10px] text-muted-foreground mb-2">
        293,488 in volume
      </p>
      <div className="flex-1 relative">
        <svg
          viewBox="0 0 200 60"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <polyline
            points="0,50 30,45 60,48 90,30 120,35 140,20 160,25 200,15"
            fill="none"
            stroke="hsl(217, 91%, 60%)"
            strokeWidth="2"
          />
          <polyline
            points="140,20 160,30 180,22 200,28"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
        </svg>
      </div>
    </div>
  );
}

function RfpMockup() {
  return (
    <div className="bg-secondary/50 rounded-t-lg p-4 h-52 flex flex-col text-[10px]">
      <div className="mb-2">
        <span className="text-foreground font-medium">Review Sites</span>
        <span className="ml-1 bg-primary/20 text-primary px-1 rounded text-[9px]">
          150+
        </span>
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {["E-Commerce", "Product", "Service", "Physical Shop"].map((tag) => (
          <span
            key={tag}
            className="border border-border rounded px-1.5 py-0.5 text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {["Product Listings", "Metadata Physical Stores"].map((tag) => (
          <span
            key={tag}
            className="border border-dashed border-border rounded px-1.5 py-0.5 text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mb-2">
        <span className="text-foreground font-medium">
          Social Media Platforms
        </span>
        <span className="ml-1 bg-violet-100 text-violet-500 px-1 rounded text-[9px]">
          7
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {[
          "Posts",
          "User Profiles",
          "Pages",
          "Profile Bios",
          "Reactions",
          "Videos",
          "Comments",
          "Reviews",
        ].map((tag) => (
          <span
            key={tag}
            className="border border-border rounded px-1.5 py-0.5 text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function DealsMockup() {
  return (
    <div className="bg-secondary/50 rounded-t-lg p-4 h-52 flex flex-col justify-end">
      <p className="text-[10px] text-muted-foreground self-end mb-2">
        Deals Closed
      </p>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-20 h-6 bg-muted rounded" />
          <span className="text-[10px] text-muted-foreground">
            Without Datashake
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Asterisk className="w-4 h-4 text-primary" strokeWidth={3} />
          <div className="flex-1 h-6 bg-primary rounded" />
          <span className="text-lg font-bold text-foreground">3x</span>
        </div>
      </div>
    </div>
  );
}

function CompetitiveMockup() {
  return (
    <div className="bg-secondary/50 rounded-t-lg p-4 h-52 flex flex-col text-[10px]">
      <div className="flex items-center gap-1 mb-2">
        <div className="w-2 h-2 bg-primary rounded-sm" />
        <span className="text-muted-foreground">373,478 total results</span>
      </div>
      <div className="bg-background rounded-lg p-3 flex-1">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-purple-500">≡</span>
          <span className="font-semibold text-foreground">Forum Threads</span>
          <span className="text-muted-foreground text-[9px]">2d ago</span>
        </div>
        <p className="font-bold text-foreground mb-1">Washing Machine</p>
        <p className="text-muted-foreground text-[9px] leading-relaxed mb-2">
          If you&apos;re in need of a washing machine, now is the perfect time
          to get one! One of the best models in the market is now on sale for
          $275 less than retail value. Don&apos;t miss out on this!
        </p>
        <div className="flex items-center justify-between border-t border-border pt-1.5">
          <span className="text-muted-foreground">74 replies</span>
          <span className="text-foreground font-medium">View all</span>
        </div>
      </div>
    </div>
  );
}

function RetainMockup() {
  return (
    <div className="bg-secondary/50 rounded-t-lg p-4 h-52 flex items-center justify-center">
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
            <circle key={x} cx={x} cy={y} r="3" fill="hsl(var(--primary))" />
          );
        })}
      </svg>
    </div>
  );
}

function KycMockup() {
  return (
    <div className="bg-secondary/50 rounded-t-lg p-4 h-52 flex flex-col text-[10px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground">Task</span>
        <span className="bg-primary/15 text-primary px-2 py-0.5 rounded text-[9px] font-medium">
          ✓ Approved
        </span>
      </div>
      <p className="text-foreground font-medium text-[11px] mb-4">
        Hire 2 software engineers to improve face ID
      </p>
      <div className="bg-background rounded-lg p-3 mt-auto">
        <div className="flex items-center gap-1 mb-1">
          <Asterisk className="w-3 h-3 text-primary" strokeWidth={3} />
          <span className="font-medium text-foreground">Social Media</span>
          <span className="text-muted-foreground text-[9px]">4d ago</span>
        </div>
        <p className="font-bold text-foreground mb-0.5">iPhone 17 face ID</p>
        <p className="text-muted-foreground text-[9px]">
          Face ID feels much slower than my 14 Pro.
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
            className="flex-1 bg-primary/60 rounded-t-sm"
            style={{ height: `${10 + height * 70}%` }}
          />
        ))}
      </div>
      <div className="relative flex items-center gap-2 text-background">
        <Asterisk className="w-5 h-5 text-primary" strokeWidth={3} />
        <span className="text-sm font-medium">Scanning...</span>
      </div>
    </div>
  );
}

function ReportingMockup() {
  return (
    <div className="bg-secondary/50 rounded-t-lg p-4 h-52 flex flex-col text-[10px]">
      <div className="bg-background rounded-lg p-3 flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-foreground">Report</span>
          <span className="text-muted-foreground text-[9px]">Q4</span>
        </div>
        <p className="font-bold text-foreground text-[11px] mb-1">
          Great customer response to new features
        </p>
        <p className="text-muted-foreground text-[9px] leading-relaxed mb-2">
          We identified an overwhelming positive response across multiple review
          sites and social media platforms about the new features that have been
          released. Here are some main points:
        </p>
        <p className="text-primary text-[9px] font-medium mb-2">
          11,234 mentions
        </p>
        <div className="border-t border-border pt-1.5">
          <p className="text-[9px] text-muted-foreground font-medium">
            Actions
          </p>
          <p className="text-[9px] text-foreground">
            Continue pushing marketing initiative to highlight these new
            features.
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
    <section className="p-12 bg-section-grey">
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
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md lg:pt-8">
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
              <div key={index} className="bg-background flex flex-col">
                <Mockup />
                <div className="p-5 flex-1">
                  <h3 className="text-sm font-bold text-foreground mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
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
