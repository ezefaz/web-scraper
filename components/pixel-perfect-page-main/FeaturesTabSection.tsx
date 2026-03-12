"use client";

import { useState } from "react";
import {
  Zap,
  Eye,
  Globe,
  Target,
  CheckSquare,
  Star,
  Heart,
  Upload,
  Image,
} from "lucide-react";
import { pulseHeights, waveBars } from "./visuals";

const tabs = [
  {
    id: "speed",
    label: "Speed",
    icon: Zap,
    color: "text-amber-500",
  },
  {
    id: "depth",
    label: "Depth",
    icon: Eye,
    color: "text-violet-500",
  },
  {
    id: "coverage",
    label: "Coverage",
    icon: Globe,
    color: "text-orange-500",
  },
  {
    id: "relevance",
    label: "Relevance",
    icon: Target,
    color: "text-purple-500",
  },
];

const tabContent: Record<
  string,
  {
    title: string;
    description: string;
    bullets: string[];
    mockup: {
      stat: string;
      statLabel: string;
      mentions: string;
      reviewText: string;
      reviewer: string;
      date: string;
      stars: number;
      likes: number;
      shares: number;
    };
  }
> = {
  speed: {
    title: "Get answers in seconds",
    description:
      "Access 5+ years of historical data instantly through archive search, or collect fresh conversations in real-time when you need current information. Get data how you need it, when you need it — whether you're analyzing long-term trends or responding to emerging issues.",
    bullets: [
      "Archive search returns results in seconds",
      "Real-time collection for emerging topics",
    ],
    mockup: {
      stat: "5.66",
      statLabel: "sec",
      mentions: "89,839",
      reviewText:
        "Bought the iPhone 17 on launch day. Super smooth performance and a noticeable camera upgrade.",
      reviewer: "dant903",
      date: "July 27, 08:57",
      stars: 5,
      likes: 827,
      shares: 253,
    },
  },
  depth: {
    title: "Go deeper than surface-level data",
    description:
      "Dive into granular review and social data across 150+ sources. Understand sentiment, detect patterns, and extract actionable insights from millions of data points.",
    bullets: [
      "Full review text and metadata extraction",
      "Granular sentiment and attribute analysis",
    ],
    mockup: {
      stat: "2.4M",
      statLabel: "records",
      mentions: "142,301",
      reviewText:
        "The battery life improvement is incredible. Easily lasts two full days with moderate usage.",
      reviewer: "techfan22",
      date: "Aug 3, 14:12",
      stars: 4,
      likes: 1203,
      shares: 487,
    },
  },
  coverage: {
    title: "Unmatched source coverage",
    description:
      "Access data from 150+ review sites, 10+ social media platforms, and growing. One integration covers the breadth of the public web so you never miss a mention.",
    bullets: [
      "150+ review sites covered globally",
      "10+ social media platforms integrated",
    ],
    mockup: {
      stat: "150+",
      statLabel: "sources",
      mentions: "384,589",
      reviewText:
        "Service has been consistently excellent across all locations. Highly recommend for families.",
      reviewer: "sarah_m",
      date: "June 15, 10:33",
      stars: 5,
      likes: 542,
      shares: 198,
    },
  },
  relevance: {
    title: "Only the data that matters",
    description:
      "Advanced filtering and smart matching ensure you get precisely the data you need. No noise, no irrelevant results — just clean, structured data ready for analysis.",
    bullets: [
      "Smart deduplication and noise filtering",
      "Precision matching by entity and topic",
    ],
    mockup: {
      stat: "99.2",
      statLabel: "%",
      mentions: "56,721",
      reviewText:
        "Perfect match for our competitive monitoring needs. The accuracy of entity matching is outstanding.",
      reviewer: "analyst_pro",
      date: "Sep 1, 16:45",
      stars: 5,
      likes: 315,
      shares: 127,
    },
  },
};

export default function PixelPerfectFeaturesTabSection() {
  const [activeTab, setActiveTab] = useState("speed");
  const content = tabContent[activeTab];
  const activeTabData = tabs.find((tab) => tab.id === activeTab)!;
  const ActiveIcon = activeTabData.icon;
  const bars = waveBars(
    50,
    activeTab === "speed"
      ? 0.4
      : activeTab === "depth"
        ? 1.2
        : activeTab === "coverage"
          ? 1.9
          : 2.6,
  );
  const pulseBars = pulseHeights(
    20,
    activeTab === "speed"
      ? 0.6
      : activeTab === "depth"
        ? 1.4
        : activeTab === "coverage"
          ? 2.1
          : 2.8,
  );

  return (
    <section className="py-12">
      <div className="max-w-[94rem] mx-auto padding-global">
        <div className="grid grid-cols-4 border-b border-border mb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors cursor-pointer border-b-2 ${
                  isActive
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 ${tab.color}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[500px]">
          <div className="p-12 pr-12">
            <div className="flex items-center gap-2 mb-4">
              <ActiveIcon className={`w-5 h-5 ${activeTabData.color}`} />
              <span className="text-sm font-medium text-muted-foreground">
                {activeTabData.label}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-foreground mb-6">
              {content.title}
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed mb-16 max-w-lg">
              {content.description}
            </p>

            <div className="space-y-6">
              {content.bullets.map((bullet) => (
                <div key={bullet} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded border border-primary/30 bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckSquare className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <p className="text-base text-foreground">{bullet}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-secondary/40 py-8 px-8 border-l border-border">
            <div className="flex items-end gap-[3px] h-32 mb-4 opacity-50">
              {bars.map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-primary/40 rounded-t-sm"
                  style={{ height: `${10 + height * 80}%` }}
                />
              ))}
            </div>

            <div className="text-center mb-4">
              <p className="text-5xl font-bold text-foreground">
                {content.mockup.stat}
              </p>
              <p className="text-sm text-muted-foreground">
                {content.mockup.statLabel}
              </p>
            </div>

            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="w-3 h-5 bg-primary rounded-[1px]" />
              ))}
              <div className="flex items-end gap-[2px] ml-1">
                {pulseBars.map((height, index) => (
                  <div
                    key={index}
                    className="w-1 bg-primary/30 rounded-t-sm"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-dashed border-border pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">
                  {content.mockup.mentions}
                </span>
                <span className="text-sm text-muted-foreground">
                  mentions found
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Export as</span>
                <span className="text-foreground font-medium">API Call</span>
                <span className="text-foreground font-medium">CSV/XLS</span>
              </div>
            </div>

            <div className="bg-background rounded-lg p-5 border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-foreground">Review</span>
                </div>
                <div className="flex items-center gap-1.5 text-primary">
                  <Image className="w-4 h-4" />
                  <span className="text-sm font-medium">Post</span>
                </div>
              </div>

              <p className="text-sm text-foreground leading-relaxed mb-3">
                {content.mockup.reviewText}
              </p>

              <div className="flex items-center gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${
                      index < content.mockup.stars
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium text-foreground">
                  {content.mockup.reviewer}
                </span>
                <span className="text-xs text-muted-foreground">
                  {content.mockup.date}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs">{content.mockup.likes}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Upload className="w-4 h-4" />
                  <span className="text-xs">{content.mockup.shares}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
