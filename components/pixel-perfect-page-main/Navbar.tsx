import { Asterisk } from "lucide-react";
import Link from "next/link";
import { Button } from "./button";

const navLinks = ["Product", "Solutions", "Resources", "Company"];

export default function PixelPerfectNavbar() {
  return (
    <nav className="sticky top-0 z-50 h-16 bg-background border-b-[0.5px]">
      <div className="w-full max-w-[90rem] mx-auto px-6 py-4 flex flex-row items-center justify-start gap-8">
        <div className="flex items-center gap-10">
          <Link
            href="/pixel-perfect-page-main"
            className="flex items-center gap-1.5 pr-10 h-full"
          >
            <Asterisk className="w-7 h-7 text-primary" strokeWidth={3} />
            <span className="text-xl font-bold tracking-tight text-foreground">
              datashake
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <Button variant="secondary" size="default">
            Ingresar
          </Button>
          <Button variant="primary" size="default">
            Comenzar
          </Button>
        </div>
      </div>
    </nav>
  );
}
