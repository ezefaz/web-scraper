import PixelPerfectFooter from "@/components/pixel-perfect-page-main/Footer";
import PixelPerfectNavbar from "@/components/pixel-perfect-page-main/Navbar";
import { privacyPolicyData } from "@/data/privacy";

export default function PrivacyPolicyPage() {
  return (
    <main className="pixel-perfect-home relative min-h-screen bg-background text-foreground">
      <PixelPerfectNavbar />
      <div className="max-w-[90rem] mx-auto border-x border-border/70">
        <section className="border-t border-border/70 bg-section-grey">
          <div className="padding-global py-10 lg:py-14">
            <div className="max-w-4xl">
              <p className="inline-flex items-center border border-border px-3 py-1.5 text-xs text-muted-foreground mb-4">
                Legal
              </p>
              <h1 className="text-3xl lg:text-5xl font-semibold tracking-tight leading-[1.05]">
                Política de privacidad
              </h1>
              <p className="mt-4 text-sm lg:text-base text-muted-foreground leading-relaxed">
                En SaveMelin protegemos tus datos personales y usamos tu
                información solo para operar, mejorar y personalizar la
                plataforma de ahorro en compras online.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-border/70 bg-background">
          <div className="padding-global py-8 lg:py-10">
            <div className="max-w-4xl space-y-3">
              {privacyPolicyData.map(({ key, title, content }) => (
                <details key={key} className="group border border-border bg-section-grey">
                  <summary className="list-none cursor-pointer px-4 py-3 flex items-center justify-between gap-4">
                    <h2 className="text-sm lg:text-base font-medium text-foreground">
                      {title}
                    </h2>
                    <span className="text-muted-foreground text-lg leading-none transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="border-t border-border px-4 py-4 text-sm text-muted-foreground leading-relaxed">
                    {content}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
      <PixelPerfectFooter />
    </main>
  );
}
