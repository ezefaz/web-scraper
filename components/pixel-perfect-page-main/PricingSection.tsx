import { ArrowRight, CalendarClock, Eye, Flag, MapPin, Share2, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "./button";

const leftItems = [
  {
    icon: Share2,
    title: "Visual query builder with Boolean search and 15+ filters",
    subtitle: "",
  },
  {
    icon: Eye,
    title: "Preview results instantly before exporting",
    subtitle: "",
  },
  {
    icon: CalendarClock,
    title: "Schedule automatic updates for continuous monitoring",
    subtitle: "",
  },
  {
    icon: Flag,
    title: "Save complex queries to reuse across projects",
    subtitle: "",
  },
];

const rightItems = [
  {
    icon: Sparkles,
    title: "Social Media API",
    subtitle: "Collect conversations across 150+ social sources",
  },
  {
    icon: Star,
    title: "Review Data API",
    subtitle: "Access customer feedback without scraping infrastructure",
  },
  {
    icon: MapPin,
    title: "Location Search API",
    subtitle: "Automate business profile discovery at scale",
  },
  {
    icon: Share2,
    title: "E-Commerce Data API",
    subtitle: "Aggregate product data from online retailers",
  },
];

const benefits = [
  "Access to all 150+ sources within one integration",
  "Full conversation threads with complete context",
  "Comprehensive metadata and engagement metrics",
];

function SideCard({
  tone,
  eyebrow,
  title,
  description,
  items,
}: {
  tone: "primary" | "blue";
  eyebrow: string;
  title: string;
  description: string;
  items: typeof leftItems;
}) {
  const isPrimary = tone === "primary";
  const accentText = isPrimary ? "text-primary" : "text-[#3f7cf0]";
  const accentBg = isPrimary ? "bg-primary" : "bg-[#3f7cf0]";

  return (
    <article className="p-7 lg:p-8">
      <p className={`inline-flex items-center gap-2 text-sm ${accentText}`}>
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
          href="/sign-up"
          className={`inline-flex items-center justify-between gap-4 min-w-[14rem] h-12 px-5 text-[1.35rem] leading-none ${
            isPrimary ? "bg-primary text-primary-foreground" : "bg-[#3f7cf0] text-white"
          }`}
        >
          <span>Book a call</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Button variant="secondary" className="h-12 px-5 text-[1.35rem]">
          Learn more
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
                <Icon className={`w-5 h-5 mt-1 shrink-0 ${accentText}`} />
                <div>
                  <p className="text-[1.6rem] leading-[1.2] text-foreground">{item.title}</p>
                  <p className="text-[1.15rem] leading-[1.35] text-muted-foreground mt-1">
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
              Choose Your Data Access
              <span className="w-2 h-2 bg-primary" />
            </p>
            <h2 className="text-[4rem] lg:text-[5rem] leading-[0.95] tracking-tight font-medium text-foreground mt-5">
              No code? No problem
            </h2>
            <p className="text-[1.65rem] text-muted-foreground leading-[1.4] max-w-[52rem] mx-auto mt-6">
              Whether you need instant insights or you’re building data products,
              Datashake delivers the same comprehensive coverage through two
              flexible access methods.
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
                <SideCard
                  tone="primary"
                  eyebrow="For Analysts & Data Scientists"
                  title="Datashake Hub"
                  description="No-code user interface to collect and distribute data for analysis in your social listening and/or BI tools."
                  items={leftItems}
                />
                <SideCard
                  tone="blue"
                  eyebrow="For Engineers & Product Managers"
                  title="Datashake APIs"
                  description="Integrate directly into your products, dashboards, ML pipelines, and automated workflows."
                  items={rightItems}
                />
              </div>
            </div>

            <div className="relative mt-2 border border-border/70 bg-primary/10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/70">
              {benefits.map((benefit) => (
                <div key={benefit} className="py-6 px-5 text-center">
                  <div className="inline-flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground text-xs">
                    ✓
                  </div>
                  <p className="mt-4 text-[1.45rem] leading-[1.35] text-foreground">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
