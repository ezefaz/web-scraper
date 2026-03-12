import { ArrowRight } from "lucide-react";
import { Button } from "./button";
import PixelPerfectDataVisualization from "./DataVisualization";
import Searchbar from "@/components/Searchbar";

export default function PixelPerfectHeroSection() {
  return (
    <section>
      <div className="max-w-[94rem] mx-auto padding-global">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="p-6">
            <div className="inline-flex items-center gap-2 border border-border rounded-sm px-4 py-2 mb-8">
              <span className="text-sm text-muted-foreground">
                Ahorro inteligente para tus compras
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.08] tracking-tight text-foreground mb-8">
              Segui precios, compará productos y compra al{" "}
              <span className="text-primary">menor precio</span>
            </h1>

            {/* <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-md">
              SaveMelin te ayuda a detectar el mejor momento para comprar.
              Analiza historiales, recibe alertas y toma decisiones con datos.
            </p> */}

            <div className="max-w-xl">
              <Searchbar />
            </div>

            <div className="mt-6 flex items-center gap-4 flex-wrap">
              <Button variant="hero">
                Comenzar a ahorrar
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button variant="secondary">Ver funcionalidades</Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <PixelPerfectDataVisualization />
          </div>
        </div>
      </div>
    </section>
  );
}
