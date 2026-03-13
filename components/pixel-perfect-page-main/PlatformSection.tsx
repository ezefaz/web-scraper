type TrustedBrand = {
  name: string;
  subtitle: string;
  logoClassName: string;
};

const trustedBrands: TrustedBrand[] = [
  {
    name: "mercadolibre",
    subtitle: "Marketplace",
    logoClassName:
      "tracking-tight lowercase text-[1.7rem] lg:text-[1.9rem] font-semibold",
  },
  {
    name: "amazon",
    subtitle: "Marketplace",
    logoClassName:
      "lowercase text-[1.8rem] lg:text-[2rem] font-semibold tracking-tight",
  },
  {
    name: "ebay",
    subtitle: "Marketplace",
    logoClassName:
      "lowercase text-[1.8rem] lg:text-[2rem] font-semibold tracking-tight",
  },
  {
    name: "google shopping",
    subtitle: "Marketplace",
    logoClassName:
      "lowercase text-[1.4rem] lg:text-[1.55rem] font-semibold tracking-tight",
  },
  {
    name: "otros marketplace",
    subtitle: "Marketplace",
    logoClassName:
      "lowercase text-[1.35rem] lg:text-[1.5rem] font-medium tracking-tight",
  },
];

export default function PixelPerfectPlatformSection() {
  return (
    <section>
      <div className="max-w-[94rem] mx-auto padding-global">
        <div className="border border-border/70">
          <div className="border-b border-border/70 px-6 py-7 lg:py-8 text-center">
            <p className="text-[1.55rem] lg:text-[1.7rem] tracking-tight text-muted-foreground leading-[1.35]">
              Unifica la comparación de precios de productos localmente &amp;
              global
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 divide-x divide-y lg:divide-y-0 divide-border/70">
            {trustedBrands.map((brand) => (
              <article
                key={brand.name}
                className="min-h-[7.5rem] lg:min-h-[8.5rem] px-6 py-6 lg:px-10 lg:py-7 flex flex-col items-center justify-center text-center gap-3 lg:gap-4"
              >
                <div className="h-10 lg:h-12 flex items-center justify-center text-muted-foreground/80">
                  <span className={brand.logoClassName}>{brand.name}</span>
                </div>
                {/* <p className="text-[0.95rem] lg:text-[1.02rem] text-muted-foreground">
                  {brand.subtitle}
                </p> */}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
