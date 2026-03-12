"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShoppingBag } from "lucide-react";
import { createProduct } from "@/app/actions/create-product";
import { Button } from "@/components/pixel-perfect-page-main/button";

interface FollowProductButtonProps {
  productUrl: string;
}

export default function FollowProductButton({ productUrl }: FollowProductButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const autoSave = searchParams.get("autoSave") === "1";

  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveAttempted, setAutoSaveAttempted] = useState(false);
  const [actionError, setActionError] = useState("");

  const saveProduct = useCallback(async () => {
    const normalizedUrl = productUrl?.trim();
    if (!normalizedUrl) return;

    const callbackUrl = `${pathname}?autoSave=1`;

    if (status !== "authenticated") {
      router.push(
        `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}&saveProductUrl=${encodeURIComponent(normalizedUrl)}`,
      );
      return;
    }

    setIsSaving(true);
    setActionError("");
    try {
      const result: any = await createProduct(normalizedUrl);

      if (result?.requiresAuth) {
        router.push(
          `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}&saveProductUrl=${encodeURIComponent(normalizedUrl)}`,
        );
        return;
      }

      if (result?.success || result?.alreadySaved) {
        router.push("/user-products");
        return;
      }

      setActionError(result?.error ?? "No pudimos guardar el producto en este momento.");
    } catch (error) {
      console.error("[FOLLOW_PRODUCT_BUTTON_ERROR]", error);
      setActionError("No pudimos guardar el producto en este momento.");
    } finally {
      setIsSaving(false);
    }
  }, [pathname, productUrl, router, status]);

  useEffect(() => {
    if (!autoSave || autoSaveAttempted || status !== "authenticated" || isSaving) return;
    setAutoSaveAttempted(true);
    saveProduct();
  }, [autoSave, autoSaveAttempted, isSaving, saveProduct, status]);

  return (
    <div className="flex flex-col gap-2">
      <Button variant="secondary" disabled={isSaving || status === "loading"} onClick={saveProduct}>
        <span className="inline-flex items-center gap-2">
          {isSaving ? "Guardando..." : "Seguir producto"}
          <ShoppingBag className="h-4 w-4" />
        </span>
      </Button>

      {status !== "authenticated" && (
        <p className="text-xs text-muted-foreground">
          Crea tu cuenta para guardar este producto y empezar su seguimiento.
        </p>
      )}
      {actionError && <p className="text-xs text-red-600">{actionError}</p>}
    </div>
  );
}

