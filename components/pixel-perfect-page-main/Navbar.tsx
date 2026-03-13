"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./button";

const navLinks = [
  { label: "Como funciona", href: "/#como-funciona" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Precios", href: "/#precios" },
  { label: "Destacado", href: "/#destacado" },
];

export default function PixelPerfectNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b-[0.5px] border-border">
      <div className="w-full max-w-[90rem] mx-auto  flex flex-row items-center justify-start gap-8 min-h-20 px-12 lg:px-6 py-4">
        <div className="flex items-center min-w-0">
          <Link href="/" className="flex items-center pr-6 h-full">
            <Image
              src="/assets/icons/savemelin-logo.svg"
              alt="SaveMelin"
              width={170}
              height={34}
              priority
              className="h-8 w-auto md:h-9"
            />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-base text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {isAuthenticated ? (
            <>
              <Button
                variant="secondary"
                size="default"
                onClick={() => router.push("/dashboard")}
              >
                Mi cuenta
              </Button>
              <Button variant="primary" size="default" onClick={handleSignOut}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
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
        <div className="max-w-[90rem] mx-auto border-x border-border bg-background px-6 py-5">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-base text-muted-foreground hover:text-foreground m-auto  transition-colors py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  variant="secondary"
                  size="default"
                  className="w-full"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push("/dashboard");
                  }}
                >
                  Mi cuenta
                </Button>
                <Button
                  variant="primary"
                  size="default"
                  className="w-full"
                  onClick={async () => {
                    setIsMobileMenuOpen(false);
                    await handleSignOut();
                  }}
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
