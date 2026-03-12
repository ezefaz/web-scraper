import {
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./button";
import { waveBars } from "./visuals";

const currentFeatures = [
  "Seguimiento de productos por busqueda o link",
  "Historial de precios por producto",
  "Comparacion local e internacional",
  "Deteccion de oportunidades de compra",
  "Panel de productos guardados",
  "Contexto de dolar para decisiones",
];

const upcomingFeatures = [
  "Alertas por porcentaje de caida",
  "Comparador multi-tienda en una vista",
  "Notificaciones por email y WhatsApp",
  "Recomendaciones por temporada",
  "App movil para seguimiento rapido",
  "Integraciones con canales de compra",
];

const footerResources = [
  "Como funciona",
  "Servicios",
  "Productos destacados",
  "Preguntas frecuentes",
];
const footerLegal = ["Terminos de uso", "Politica de privacidad"];
const SECTION_DIVIDER_SRC =
  "https://cdn.prod.website-files.com/69385e16d68663814109c132/6941785a4b1f2df4106341e2_Line-Divider.svg";

export default function PixelPerfectFooter() {
  const bars = waveBars(80, 3.2);

  return (
    <footer className="relative border-t border-border">
      <div
        className="w-full border-b-[0.5px]"
        style={{ backgroundColor: "var(--grey-v1)" }}
      >
        <div className="max-w-[90rem] mx-auto ">
          <div className="padding-global py-6 flex flex-col lg:flex-row justify-between lg:items-center gap-6">
            <h3 className="text-lg font-semibold text-foreground max-w-2xl">
              Recibi alertas y oportunidades de ahorro en tus productos
              favoritos
            </h3>
            <div className="flex items-end gap-3 flex-wrap">
              <div>
                <label className="text-sm font-semibold text-foreground">
                  Email<span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  className="mt-1 block h-11 w-full min-w-[16rem] sm:min-w-[20rem] rounded-sm px-3 text-sm bg-background text-foreground outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <Button variant="hero">Unirme</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[90rem] mx-auto ">
        <div className="padding-global py-12 lg:py-14">
          <div className="p-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
              <div className="lg:col-span-2 flex flex-col gap-6 lg:pr-10">
                <Link
                  href="/pixel-perfect-page-main"
                  className="flex items-center gap-2"
                >
                  <Image
                    src="/assets/icons/savemelin3.svg"
                    alt="SaveMelin"
                    width={130}
                    height={62}
                  />
                </Link>
                <p className="text-sm text-muted-foreground max-w-sm">
                  SaveMelin te ayuda a comprar mejor: segui precios, compara
                  opciones y eligi el mejor momento para ahorrar.
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="#"
                    className="w-9 h-9  rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9  rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9  rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9  rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
                <Button variant="hero" className="w-fit mt-4">
                  Empezar ahora
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="lg:pl-10">
                <h4 className="font-semibold text-foreground mb-4">
                  Funciones actuales
                </h4>
                <ul className="space-y-2.5">
                  {currentFeatures.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">
                  Proximas funciones
                </h4>
                <ul className="space-y-2.5">
                  {upcomingFeatures.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">Recursos</h4>
                <ul className="space-y-2.5">
                  {footerResources.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                <ul className="space-y-2.5">
                  {footerLegal.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-b border-border">
        <div className="relative max-w-[90rem] mx-auto">
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="flex items-end gap-[3px] h-full px-4">
              {bars.map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-primary/40 rounded-t-sm"
                  style={{ height: `${10 + height * 60}%` }}
                />
              ))}
            </div>
          </div>
          <div className="relative padding-global py-10">
            <p className="text-sm text-muted-foreground mb-10">
              All Rights Reserved © SaveMelin
            </p>
          </div>
        </div>
      </div>
      <img
        src={SECTION_DIVIDER_SRC}
        alt=""
        aria-hidden
        className="block w-full h-auto select-none pointer-events-none"
        loading="lazy"
      />
    </footer>
  );
}
