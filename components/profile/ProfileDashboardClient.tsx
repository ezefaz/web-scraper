"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Bell, KeyRound, Search, Sparkles, TrendingDown, User } from "lucide-react";

import { Button } from "@/components/pixel-perfect-page-main/button";
import { formatNumber } from "@/lib/utils";
import {
  requestDashboardPasswordReset,
  updateDashboardProfile,
  updateProductAlertPreference,
} from "@/app/actions/dashboard-profile";

type DashboardUser = {
  name: string;
  email: string;
  country: "argentina" | "brasil" | "colombia" | "uruguay";
};

type DashboardProduct = {
  id: string;
  title: string;
  image: string;
  currency: string;
  currentPrice: number;
  originalPrice: number;
  isFollowing: boolean;
  category: string;
  url: string;
};

type DashboardMetrics = {
  savedProducts: number;
  alertsEnabled: number;
  productsWithDiscount: number;
  accumulatedSavings: number;
};

type Props = {
  user: DashboardUser;
  products: DashboardProduct[];
  metrics: DashboardMetrics;
};

const COUNTRY_OPTIONS: Array<{
  value: DashboardUser["country"];
  label: string;
}> = [
  { value: "argentina", label: "Argentina" },
  { value: "brasil", label: "Brasil" },
  { value: "colombia", label: "Colombia" },
  { value: "uruguay", label: "Uruguay" },
];

const PAGE_SIZE = 6;

function calculateSaving(product: DashboardProduct) {
  const diff = (product.originalPrice || 0) - (product.currentPrice || 0);
  return diff > 0 ? diff : 0;
}

export default function ProfileDashboardClient({ user, products, metrics }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<DashboardProduct[]>(products);
  const [name, setName] = useState(user.name || "");
  const [country, setCountry] = useState<DashboardUser["country"]>(user.country);
  const [isPending, startTransition] = useTransition();
  const [activeToggleId, setActiveToggleId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) => {
      return (
        item.title.toLowerCase().includes(normalized) ||
        item.category.toLowerCase().includes(normalized)
      );
    });
  }, [items, query]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const bestOpportunity = useMemo(() => {
    return [...items]
      .map((item) => ({ ...item, saving: calculateSaving(item) }))
      .sort((a, b) => b.saving - a.saving)[0];
  }, [items]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const response = await updateDashboardProfile({ name, country });
      if (response.error) {
        toast.error(response.error);
        return;
      }
      toast.success(response.success || "Perfil actualizado.");
    });
  };

  const handlePasswordReset = () => {
    startTransition(async () => {
      const response = await requestDashboardPasswordReset();
      if ("error" in response && response.error) {
        toast.error(response.error);
        return;
      }
      toast.success(
        ("success" in response && response.success) ||
          "Te enviamos un email para restablecer tu contraseña."
      );
    });
  };

  const handleToggleAlert = (productId: string, enabled: boolean) => {
    setActiveToggleId(productId);
    startTransition(async () => {
      const response = await updateProductAlertPreference({ productId, enabled });
      if (response.error) {
        toast.error(response.error);
        setActiveToggleId(null);
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, isFollowing: enabled } : item
        )
      );
      toast.success(response.success || "Preferencias de alertas actualizadas.");
      setActiveToggleId(null);
    });
  };

  const summaryCards = [
    {
      label: "Productos guardados",
      value: metrics.savedProducts.toString(),
    },
    {
      label: "Alertas activas",
      value: metrics.alertsEnabled.toString(),
    },
    {
      label: "Productos con descuento",
      value: metrics.productsWithDiscount.toString(),
    },
    {
      label: "Ahorro acumulado",
      value: `$ ${formatNumber(metrics.accumulatedSavings)}`,
    },
  ];

  return (
    <div className="py-10 lg:py-12 px-12 space-y-8">
      <div className="border border-border/70 bg-background p-5 md:p-6">
        <p className="text-sm text-muted-foreground">Panel de usuario</p>
        <h1 className="mt-1 text-2xl md:text-3xl font-semibold text-foreground">
          Bienvenido, {user.name}
        </h1>
        <p className="mt-2 text-sm md:text-base text-muted-foreground">
          Gestioná tus productos guardados, tus alertas y el estado general de tu
          ahorro en un solo lugar.
        </p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <article key={card.label} className="border border-border/70 bg-section-grey p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {card.label}
            </p>
            <p className="mt-2 text-xl md:text-2xl font-semibold text-foreground">
              {card.value}
            </p>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-[1.45fr_1fr] gap-6">
        <section className="border border-border/70 bg-background p-5 md:p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Productos guardados y alertas
              </h2>
              <p className="text-sm text-muted-foreground">
                Elegí en qué productos querés recibir avisos cuando haya cambios.
              </p>
            </div>
            <Link href="/user-products">
              <Button variant="secondary">Ver todos</Button>
            </Link>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setPage(1);
                setQuery(e.target.value);
              }}
              placeholder="Buscar por producto o categoría"
              className="h-11 w-full border border-border bg-section-grey pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/80 outline-none focus:border-foreground/30"
            />
          </div>

          <div className="overflow-x-auto border border-border/70">
            <table className="w-full min-w-[640px]">
              <thead className="bg-section-grey border-b border-border/70">
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2">Producto</th>
                  <th className="px-3 py-2">Precio actual</th>
                  <th className="px-3 py-2">Ahorro detectado</th>
                  <th className="px-3 py-2">Alertas</th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((item) => {
                  const saving = calculateSaving(item);
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-border/50 last:border-b-0"
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-12 w-12 border border-border/70 bg-white object-contain p-1"
                          />
                          <div className="min-w-0">
                            <Link
                              href={`/products/${item.id}`}
                              className="block text-sm font-medium text-foreground line-clamp-1 hover:underline"
                            >
                              {item.title}
                            </Link>
                            <p className="text-xs text-muted-foreground">{item.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm font-medium text-foreground">
                        {item.currency} {formatNumber(item.currentPrice)}
                      </td>
                      <td className="px-3 py-3">
                        {saving > 0 ? (
                          <span className="inline-flex items-center border border-primary/50 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                            $ {formatNumber(saving)}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Sin descuento</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <label className="inline-flex items-center gap-2 text-sm text-foreground">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[var(--primary)]"
                            checked={item.isFollowing}
                            disabled={isPending && activeToggleId === item.id}
                            onChange={(e) =>
                              handleToggleAlert(item.id, e.target.checked)
                            }
                          />
                          Recibir alertas
                        </label>
                      </td>
                    </tr>
                  );
                })}
                {visibleProducts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-10 text-center text-sm text-muted-foreground">
                      No encontramos productos con ese criterio.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="h-9 px-3 border border-border text-sm text-foreground disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
              >
                Anterior
              </button>
              <button
                type="button"
                className="h-9 px-3 border border-border text-sm text-foreground disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="border border-border/70 bg-background p-5 md:p-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Configuración de perfil</h3>
            </div>
            <form className="mt-4 space-y-3" onSubmit={handleProfileSubmit}>
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Nombre</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 w-full border border-border bg-section-grey px-3 text-sm text-foreground outline-none focus:border-foreground/30"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Email</label>
                <input
                  value={user.email}
                  disabled
                  className="h-11 w-full border border-border bg-muted/40 px-3 text-sm text-muted-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">País</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value as DashboardUser["country"])}
                  className="h-11 w-full border border-border bg-section-grey px-3 text-sm text-foreground outline-none focus:border-foreground/30"
                >
                  {COUNTRY_OPTIONS.map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={isPending}>
                Guardar perfil
              </Button>
            </form>
          </section>

          <section className="border border-border/70 bg-background p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Seguridad</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Solicitá un enlace de restablecimiento para cambiar tu contraseña.
            </p>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handlePasswordReset}
              disabled={isPending}
            >
              Solicitar cambio de contraseña
            </Button>
          </section>

          <section className="border border-border/70 bg-background p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Ideas para mejorar tu ahorro</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <TrendingDown className="h-4 w-4 mt-0.5 text-primary" />
                Activá alertas en todos los productos que hoy están sin descuento.
              </li>
              <li className="flex gap-2">
                <Bell className="h-4 w-4 mt-0.5 text-primary" />
                Definí un hábito semanal para revisar oportunidades.
              </li>
              <li className="flex gap-2">
                <Search className="h-4 w-4 mt-0.5 text-primary" />
                Agregá productos sustitutos para comparar antes de comprar.
              </li>
            </ul>
            {bestOpportunity && calculateSaving(bestOpportunity) > 0 && (
              <div className="border border-primary/40 bg-primary/10 p-3">
                <p className="text-xs uppercase tracking-wide text-primary">
                  Mejor oportunidad detectada
                </p>
                <p className="mt-1 text-sm font-medium text-foreground line-clamp-1">
                  {bestOpportunity.title}
                </p>
                <p className="mt-1 text-sm text-primary font-semibold">
                  Podés ahorrar $ {formatNumber(calculateSaving(bestOpportunity))}
                </p>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
