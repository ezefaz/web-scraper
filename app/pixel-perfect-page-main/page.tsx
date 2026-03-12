import PixelPerfectNavbar from "@/components/pixel-perfect-page-main/Navbar";
import PixelPerfectHeroSection from "@/components/pixel-perfect-page-main/HeroSection";
import PixelPerfectPlatformSection from "@/components/pixel-perfect-page-main/PlatformSection";
import PixelPerfectSolutionSection from "@/components/pixel-perfect-page-main/SolutionSection";
import PixelPerfectUseCasesSection from "@/components/pixel-perfect-page-main/UseCasesSection";
import PixelPerfectFeaturesTabSection from "@/components/pixel-perfect-page-main/FeaturesTabSection";
import PixelPerfectFooter from "@/components/pixel-perfect-page-main/Footer";

const SECTION_DIVIDER_SRC =
  "https://cdn.prod.website-files.com/69385e16d68663814109c132/6941785a4b1f2df4106341e2_Line-Divider.svg";

export default function PixelPerfectPage() {
  return (
    <div className="pixel-perfect-home relative min-h-screen bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-[60] border-l border-border/50"
        style={{ left: "max(calc((100vw - 94rem) / 2 + 2.5rem), 2.5rem)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-[60] border-r border-border/50"
        style={{ right: "max(calc((100vw - 94rem) / 2 + 2.5rem), 2.5rem)" }}
      />
      <PixelPerfectNavbar />
      <div className="relative">
        <div className="border-t border-border/70">
          <PixelPerfectHeroSection />
        </div>
        <PixelPerfectPlatformSection />
        <img
          src={SECTION_DIVIDER_SRC}
          alt=""
          aria-hidden
          className="relative z-[70] block w-full h-auto select-none pointer-events-none"
          loading="lazy"
        />
        <div className="border border-border/70">
          <PixelPerfectSolutionSection />
        </div>
        <img
          src={SECTION_DIVIDER_SRC}
          alt=""
          aria-hidden
          className="relative z-[70] block w-full h-auto select-none pointer-events-none"
          loading="lazy"
        />
        <div className="border-t border-border/70">
          <PixelPerfectUseCasesSection />
        </div>
        <img
          src={SECTION_DIVIDER_SRC}
          alt=""
          aria-hidden
          className="relative z-[70] block w-full h-auto select-none pointer-events-none"
          loading="lazy"
        />
        <div className="border-t border-border/70">
          <PixelPerfectFeaturesTabSection />
        </div>
        <img
          src={SECTION_DIVIDER_SRC}
          alt=""
          aria-hidden
          className="relative z-[70] block w-full h-auto select-none pointer-events-none"
          loading="lazy"
        />
        <PixelPerfectFooter />
      </div>
    </div>
  );
}
