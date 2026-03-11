"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ThemeSwitcher } from "./ThemeSwitcher";
import UserDropdown from "./UserDropdown";
import { usePathname } from "next/navigation";

const landingLinks = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Cómo funciona", href: "/#como-funciona" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Beneficios", href: "/#funcionalidades" },
  { label: "Impacto", href: "/#impacto" },
  { label: "Destacados", href: "/#destacados" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useCurrentUser();
  const isLanding = pathname === "/";

  return (
    <header className="fixed top-0 z-50 w-full border-b border-black/10 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-black/70">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Image src="/assets/icons/savemelin3.svg" width={118} height={56} alt="SaveMelin" />
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {landingLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                isLanding
                  ? "text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <ThemeSwitcher />
          {!user ? (
            <>
              <Link
                href="/sign-in"
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                Ingresar
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Comenzar
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/user-products"
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                Mis productos
              </Link>
              <UserDropdown />
            </>
          )}
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-700 lg:hidden dark:border-white/20 dark:text-white"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMenuOpen ? <AiOutlineClose size={18} /> : <AiOutlineMenu size={18} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-black/10 bg-white/95 px-4 py-4 backdrop-blur-xl lg:hidden dark:border-white/10 dark:bg-black/90">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            {landingLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 flex items-center gap-2">
              <ThemeSwitcher />
              {!user ? (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full rounded-full border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                  >
                    Ingresar
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Comenzar
                  </Link>
                </>
              ) : (
                <Link
                  href="/user-products"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full rounded-full border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                >
                  Mis productos
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
