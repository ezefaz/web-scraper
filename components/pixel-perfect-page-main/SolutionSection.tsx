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
    label: "Insertar link o producto",
    description:
      "Búsqueda a partir de multiples fuentes confiables y actualizadas",
  },
  {
    icon: Shield,
    label: "Análisis de seguridad de compra",
    description:
      "Te brindamos un índice de confiabilidad de la pagina para que puedas comprar con tranquilidad",
  },
  {
    icon: BarChart3,
    label: "Seguir producto",
    description:
      "Si la compra no es inminente, puedes seguir el producto para recibir alertas de cambios en su precio o disponibilidad",
  },
  {
    icon: Award,
    label: "Mejor precio garantizado",
    description:
      "A partir de nuestro análisis, te recomendamos el mejor momento para comprar el producto que deseas",
  },
  {
    icon: MonitorSpeaker,
    label: "Ahorro masivo mensual",
    description:
      "Masivamente generas un ahorro significativo a largo plazo, cuidando tu bolsillo",
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
              La solución
            </span>
            <span className="text-primary">⊣</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight tracking-tight text-foreground mb-4 max-w-lg">
            Te avisamos el mejor momento de comprar el producto que deseas
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
            Savemelin te provee con la mejor información y estadisticas para
            comprar al mejor precio, siguiendo una evolución del precio del
            producto y de los diferentes paginas de compra.
          </p>
        </div>

        <div className="relative bg-foreground rounded-xl overflow-hidden mb-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-10 scale-100"
            style={{ backgroundImage: "url('/assets/images/hero2.png')" }}
          />
          <div className="absolute inset-0 flex items-end  gap-[3px] px-8 pt-6 opacity-70">
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
              Sitios escaneados{" "}
              <span className="text-[10px] bg-primary/20 px-1 rounded">
                50+
              </span>
            </span>
            <span className="border border-primary/50 text-primary text-xs px-2 py-1 rounded-sm flex items-center gap-1 w-fit bg-foreground/80">
              Ofertas encontradas{" "}
              <span className="text-[10px] bg-primary/20 px-1 rounded">
                10+
              </span>
            </span>
            <span className="border border-primary/50 text-primary text-xs px-2 py-1 rounded-sm flex items-center gap-1 w-fit bg-foreground/80">
              Ofertas reales{" "}
              <span className="text-[10px] bg-primary/20 px-1 rounded">9</span>
            </span>
          </div>

          <div className="absolute right-4 top-8 bg-background/95 rounded-lg p-4 text-xs shadow-lg">
            <p className="font-medium text-foreground mb-1">
              Resultados totales
            </p>
            <p className="text-foreground font-bold">
              312{" "}
              <span className="font-normal text-muted-foreground">
                resultados
              </span>
            </p>
          </div>

          <div className="relative z-10 max-w-md mx-auto py-16 px-4">
            <div className="bg-background rounded-xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-5">
                <Asterisk className="w-5 h-5 text-primary" strokeWidth={3} />
                <span className="font-semibold text-foreground text-sm">
                  Búsqueda por Savemelin
                </span>
              </div>

              <div className="border border-border rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">
                    &quot;Cafetera barista para casa&quot;
                  </span>
                  <span className="text-primary text-xs font-medium bg-primary/10 px-1.5 py-0.5 rounded">
                    O
                  </span>
                  <span className="text-foreground">
                    &quot;Cafetera espresso para casa&quot;
                  </span>
                  <span className="text-primary text-xs font-medium bg-primary/10 px-1.5 py-0.5 rounded">
                    O
                  </span>
                  <span className="text-foreground">
                    &quot;Cafetera espresso doméstica&quot;
                  </span>
                </div>
                <div className="h-16" />
              </div>

              <div className="border border-border rounded-lg px-3 py-2.5 flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-foreground font-medium">
                    Esta semana
                  </span>
                  <span className="text-muted-foreground">
                    5 Enero - 11 Enero
                  </span>
                </div>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">
                  Parámeteros
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="text-foreground font-medium">Seguridad</span>
                  <span className="text-foreground font-medium">Precio</span>
                  <span className="text-foreground font-medium">Oferta</span>
                  <span className="text-foreground font-medium">Envio</span>
                  <span className="text-foreground font-medium">Garantía</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mt-16 mb-16">
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
            La prioridad es cuidar tu bolsillo. Sabemos la importancia y el
            impacto que puede generar el ahorro a largo plazo, por eso juntamos
            una serie de servicios para maximizarlo.
          </p>
          <Button
            variant="secondary"
            className="whitespace-nowrap flex-shrink-0"
          >
            Ver Savemelin en acción
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
