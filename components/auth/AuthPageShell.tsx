import Link from "next/link";
import { Check } from "lucide-react";
import PixelPerfectFooter from "@/components/pixel-perfect-page-main/Footer";
import PixelPerfectNavbar from "@/components/pixel-perfect-page-main/Navbar";

interface AuthPageShellProps {
  badge: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  withDataBackground?: boolean;
  children: React.ReactNode;
}

const AuthPageShell = ({
  badge,
  title,
  description,
  ctaLabel,
  ctaHref,
  withDataBackground = false,
  children,
}: AuthPageShellProps) => {
  return (
    <main className="pixel-perfect-home relative min-h-screen bg-background text-foreground">
      <PixelPerfectNavbar />

      <div className="max-w-[90rem] mx-auto padding-global border-x border-border/70">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
          <section className="relative overflow-hidden [container-type:inline-size] border-b lg:border-b-0 lg:border-r border-border/70 bg-section-grey p-6 lg:p-8 flex flex-col justify-between">
            {withDataBackground && (
              <>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.18]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, hsl(var(--primary) / 0.32) 0 0.38cqw, transparent 0.38cqw 1.2cqw)",
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.14]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, hsl(var(--border) / 0.8) 0 0.12cqw, transparent 0.12cqw 4.8cqw)",
                  }}
                />
              </>
            )}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 border border-border px-3 py-1.5 mb-5">
                <span className="text-xs text-muted-foreground">{badge}</span>
              </div>

              <h1 className="text-2xl lg:text-4xl font-semibold tracking-tight leading-[1.08] text-foreground">
                {title}
              </h1>
              <p className="mt-4 text-sm lg:text-[0.95rem] leading-relaxed text-muted-foreground max-w-[30rem]">
                {description}
              </p>
            </div>

            <div className="relative z-10 mt-7 border border-border/70 bg-background p-4">
              <ul className="space-y-2.5 text-xs lg:text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  Alertas automáticas de cambios de precio.
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  Comparación entre múltiples tiendas en un solo lugar.
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  Historial de precios para decidir mejor cuándo comprar.
                </li>
              </ul>

              <div className="mt-4 pt-3 border-t border-border/70 text-xs lg:text-sm">
                <span className="text-muted-foreground">Acceso rápido: </span>
                <Link
                  href={ctaHref}
                  className="text-foreground font-medium hover:text-primary transition-colors"
                >
                  {ctaLabel}
                </Link>
              </div>
            </div>
          </section>

          <section className="p-6 lg:p-8 flex items-center justify-center">
            {children}
          </section>
        </div>
      </div>
      <PixelPerfectFooter />
    </main>
  );
};

export default AuthPageShell;
