import Link from "next/link";

interface AuthPageShellProps {
  badge: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  children: React.ReactNode;
}

const AuthPageShell = ({ badge, title, description, ctaLabel, ctaHref, children }: AuthPageShellProps) => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f7fb] pt-24 dark:bg-[#05070b]">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <section className="hidden rounded-3xl border border-black/10 bg-white/70 p-10 shadow-xl backdrop-blur-sm lg:flex lg:flex-col lg:justify-between dark:border-white/10 dark:bg-black/40">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">SaveMelin</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 dark:text-white">{title}</h1>
            <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">{description}</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm text-gray-600 dark:border-white/10 dark:bg-black/30 dark:text-gray-300">
            {badge}{" "}
            <Link href={ctaHref} className="font-semibold text-primary underline underline-offset-4">
              {ctaLabel}
            </Link>
          </div>
        </section>

        <section className="flex items-center justify-center">{children}</section>
      </div>
    </main>
  );
};

export default AuthPageShell;
