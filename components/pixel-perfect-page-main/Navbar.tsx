"use client";

import { Asterisk, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./button";

const navLinks = ["Como funciona", "Servicios", "Precios", "Destacado"];

export default function PixelPerfectNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 bg-background border-b-[0.5px]">
      <div className="w-full max-w-[90rem] mx-auto px-10 md:px-6 py-4 flex flex-row items-center justify-start gap-8 min-h-20">
        <div className="flex items-center gap-10 min-w-0">
          <Link href="/" className="flex items-center gap-1.5 pr-10 h-full">
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
                className="text-base text-muted-foreground hover:text-foreground transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <Button
            variant="secondary"
            size="default"
            onClick={() => router.push("/sign-in")}
          >
            Ingresar
          </Button>
          <Button
            variant="primary"
            size="default"
            onClick={() => router.push("/sign-up")}
          >
            Comenzar
          </Button>
        </div>
        <button
          type="button"
          className="md:hidden ml-auto inline-flex items-center justify-center w-10 h-10 border border-border rounded-sm text-foreground"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      <div
        id="mobile-nav-menu"
        className={`md:hidden overflow-hidden border-t border-border transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-w-[90rem] mx-10 md:mx-auto px-4 md:px-6 py-4 bg-background border-x border-border">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-base text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link}
              </a>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex flex-col gap-3">
            <Button
              variant="secondary"
              size="default"
              className="w-full"
              onClick={() => {
                setIsMobileMenuOpen(false);
                router.push("/sign-in");
              }}
            >
              Ingresar
            </Button>
            <Button
              variant="primary"
              size="default"
              className="w-full"
              onClick={() => {
                setIsMobileMenuOpen(false);
                router.push("/sign-up");
              }}
            >
              Comenzar
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
