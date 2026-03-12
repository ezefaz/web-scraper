import {
  Asterisk,
  Search,
  Calendar,
  ArrowRight,
  CheckCircle,
  Shield,
  BarChart3,
  Award,
  MonitorSpeaker,
} from "lucide-react";
import { Button } from "./button";
import { waveBars } from "./visuals";

const stats = [
  {
    icon: CheckCircle,
    label: "98.3% uptime",
    description: "Proven reliability across sources with proactive monitoring",
  },
  {
    icon: Shield,
    label: "Enterprise security",
    description:
      "Encryption at every step with compliance-ready infrastructure",
  },
  {
    icon: BarChart3,
    label: "Massive scale",
    description: "Scale your workflow to hundreds of millions of daily fetches",
  },
  {
    icon: Award,
    label: "Industry standard",
    description: "Proven reliability across sources with proactive monitoring",
  },
  {
    icon: MonitorSpeaker,
    label: "Earned media coverage",
    description: "Detect conversations outside channels you own",
  },
];

export default function PixelPerfectSolutionSection() {
  const bars = waveBars(60, 1.2);

  return (
    <section className="p-12">
      <div className="max-w-[94rem] mx-auto padding-global">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-primary">⊢</span>
            <span className="text-sm font-medium text-primary">
              The Solution
            </span>
            <span className="text-primary">⊣</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight tracking-tight text-foreground mb-4 max-w-lg">
            Get the most complete data to power your insights
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
            Datashake provides the reliable foundation of public data that your
            business has always needed.
          </p>
        </div>

        <div className="relative bg-foreground rounded-xl overflow-hidden mb-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-10 scale-100"
            style={{ backgroundImage: "url('/assets/images/hero2.png')" }}
          />
          <div className="absolute inset-0 flex items-end gap-[3px] px-8 pb-32 pt-6 opacity-30">
            {bars.map((height, index) => (
              <div
                key={index}
                className="flex-1 bg-primary/60 rounded-t-sm"
                style={{ height: `${10 + height * 70}%` }}
              />
            ))}
          </div>

          <div className="absolute left-4 top-1/4 space-y-16">
            <span className="border border-primary/50 text-primary text-xs px-2 py-1 rounded-sm flex items-center gap-1 w-fit bg-foreground/80">
              Review Sites{" "}
              <span className="text-[10px] bg-primary/20 px-1 rounded">
                150+
              </span>
            </span>
            <span className="border border-primary/50 text-primary text-xs px-2 py-1 rounded-sm flex items-center gap-1 w-fit bg-foreground/80">
              Social Media{" "}
              <span className="text-[10px] bg-primary/20 px-1 rounded">
                10+
              </span>
            </span>
            <span className="border border-primary/50 text-primary text-xs px-2 py-1 rounded-sm flex items-center gap-1 w-fit bg-foreground/80">
              Online Forums{" "}
              <span className="text-[10px] bg-primary/20 px-1 rounded">9</span>
            </span>
          </div>

          <div className="absolute right-4 top-8 bg-background/95 rounded-lg p-4 text-xs shadow-lg">
            <p className="font-medium text-foreground mb-1">Search Result</p>
            <p className="text-foreground font-bold">
              384,585{" "}
              <span className="font-normal text-muted-foreground">results</span>
            </p>
            <div className="flex gap-3 mt-2 text-muted-foreground">
              <span>Export as</span>
              <span className="text-foreground font-medium">API</span>
            </div>
          </div>

          <div className="relative z-10 max-w-md mx-auto py-16 px-4">
            <div className="bg-background rounded-xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-5">
                <Asterisk className="w-5 h-5 text-primary" strokeWidth={3} />
                <span className="font-semibold text-foreground text-sm">
                  Datashake Engine
                </span>
              </div>

              <div className="border border-border rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">&quot;coca-cola&quot;</span>
                  <span className="text-primary text-xs font-medium bg-primary/10 px-1.5 py-0.5 rounded">
                    OR
                  </span>
                  <span className="text-foreground">&quot;pepsi&quot;</span>
                  <span className="text-primary text-xs font-medium bg-primary/10 px-1.5 py-0.5 rounded">
                    AND
                  </span>
                  <span className="text-foreground">&quot;unhealthy&quot;</span>
                </div>
                <div className="h-16" />
              </div>

              <div className="border border-border rounded-lg px-3 py-2.5 flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-foreground font-medium">This Week</span>
                  <span className="text-muted-foreground">5 Jan - 11 Jan</span>
                </div>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">Parameters</p>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="text-foreground font-medium">URL</span>
                  <span className="text-foreground font-medium">Keyword</span>
                  <span className="text-foreground font-medium">Hashtag</span>
                  <span className="text-foreground font-medium">
                    Author Name
                  </span>
                  <span className="text-foreground font-medium">
                    Boolean Search
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-16">
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
            We unify 150+ social media and online review sources into one
            resilient API, standardizing formats and absorbing platform shifts
            so your pipelines never fail. Data arrives analysis-ready while your
            team expands coverage without compounding complexity. Infrastructure
            engineered for the decisions that define your businesses success.
          </p>
          <Button
            variant="heroDashed"
            className="whitespace-nowrap flex-shrink-0"
          >
            See Datashake in action
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 border-t border-border pt-10">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div key={stat.label}>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="h-0.5 w-full bg-primary/20 rounded mb-3" />
                <h4 className="text-sm font-bold text-foreground mb-1">
                  {stat.label}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
