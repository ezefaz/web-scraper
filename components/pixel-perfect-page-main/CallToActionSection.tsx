import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PixelPerfectCallToActionSection() {
  return (
    <section className="border-t border-border/70">
      <div className="max-w-[94rem] mx-auto padding-global">
        <div className="relative overflow-hidden border-x border-border/70 bg-section-grey min-h-[32rem] lg:min-h-[36rem] flex items-center justify-center p-8 lg:p-14">
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1200 620"
            preserveAspectRatio="none"
          >
            <g
              stroke="hsl(var(--primary) / 0.35)"
              strokeWidth="1"
              strokeDasharray="8 8"
              fill="none"
              opacity="0.85"
            >
              <path d="M8 82 H210 V260 H360 V380 H500" />
              <path d="M1192 82 H988 V265 H900 V412 H700" />
              <path d="M8 534 H250 V440 H438 V486 H612 V452 H880 V560 H1192" />
              <path d="M672 620 V446 H740 V520 H940 V620" />
              <path d="M1168 16 V116 H1082 V154" />
              <path d="M548 620 V562 H620 V500" />
            </g>

            <g fill="hsl(var(--primary))">
              <rect x="242" y="298" width="12" height="16" />
              <rect x="1082" y="278" width="16" height="10" />
              <rect x="1008" y="430" width="16" height="10" />
              <rect x="700" y="506" width="12" height="18" />
              <rect x="520" y="522" width="12" height="18" />
              <rect x="1160" y="74" width="12" height="18" />
              <rect x="120" y="526" width="18" height="10" />
              <rect x="648" y="610" width="18" height="10" />
            </g>
          </svg>

          <div className="relative z-10 max-w-[42rem] text-center">
            <h3 className="text-[2.5rem] lg:text-[4.2rem] leading-[0.95] tracking-tight font-medium text-foreground">
              Para qué gastar demás?
            </h3>

            <Link
              href="/sign-up"
              className="mt-10 inline-flex items-center justify-between gap-5 bg-primary px-8 py-4 min-w-[22rem] lg:min-w-[30rem] text-primary-foreground hover:bg-primary/90 transition-colors text-[1.05rem] lg:text-[1.35rem] leading-none tracking-tight"
            >
              <span>Proba Savemelin Gratis.</span>
              <ArrowRight className="w-7 h-7 lg:w-8 lg:h-8 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
