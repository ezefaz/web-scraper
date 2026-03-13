"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import CardWrapper from "../CardWrapper";
import FormError from "./FormError";
import FormSuccess from "./FormSuccess";

import { useMemo, useState, useTransition } from "react";
import { login } from "@/app/actions/login";
import { Social } from "./Social";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { TbEyeFilled } from "react-icons/tb";
import { IoMdEyeOff } from "react-icons/io";

const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const saveProductUrl = searchParams.get("saveProductUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "El correo es utilizado con otro proveedor"
      : "";

  const signUpHref = useMemo(() => {
    const params = new URLSearchParams();
    if (callbackUrl) params.set("callbackUrl", callbackUrl);
    if (saveProductUrl) params.set("saveProductUrl", saveProductUrl);
    const query = params.toString();
    return query ? `/sign-up?${query}` : "/sign-up";
  }, [callbackUrl, saveProductUrl]);

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
        })
        .catch((submitError) => {
          console.error("Error occurred during login:", submitError);
          setError("Algo salió mal, intenta nuevamente.");
        });
    });
  };

  return (
    <CardWrapper
      HeaderLabel="Bienvenido de nuevo"
      backButtonHref={signUpHref}
      backButtonLabel="¿No tienes una cuenta? Crear cuenta"
    >
      {saveProductUrl && (
        <p className="mb-3 text-xs text-muted-foreground">
          Inicia sesión para guardar este producto en tus seguidos.
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm text-muted-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            disabled={isPending}
            placeholder="tu@email.com"
            {...register("email")}
            className="w-full h-11 border border-border bg-section-grey px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:border-foreground/30"
          />
          {errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm text-muted-foreground">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              autoComplete="current-password"
              disabled={isPending}
              placeholder="••••••••"
              {...register("password")}
              type={isVisible ? "text" : "password"}
              className="w-full h-11 border border-border bg-section-grey px-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:border-foreground/30"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {isVisible ? (
                <IoMdEyeOff className="pointer-events-none text-lg" />
              ) : (
                <TbEyeFilled className="pointer-events-none text-lg" />
              )}
            </button>
          </div>
          {errors.password && <span className="text-xs text-red-600">{errors.password.message}</span>}
          <Link href="/new-password" className="inline-block text-xs font-medium text-muted-foreground transition hover:text-foreground">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <FormError message={error || urlError} />
        <FormSuccess message={success} />

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center bg-primary h-11 px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>

      <div className="my-4 text-center text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        o continúa con
      </div>
      <Social />
      <p className="mt-4 text-xs text-muted-foreground">
        Al iniciar sesión aceptas nuestra política de{" "}
        <a
          href="/privacy-policy"
          className="font-medium text-foreground underline underline-offset-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          privacidad
        </a>
        .
      </p>
    </CardWrapper>
  );
};

export default LoginForm;
