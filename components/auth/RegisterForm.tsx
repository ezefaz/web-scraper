"use client";

import * as z from "zod";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import CardWrapper from "../CardWrapper";
import FormError from "./FormError";
import FormSuccess from "./FormSuccess";
import { register as registration } from "@/app/actions/register";
import { TbEyeFilled } from "react-icons/tb";
import { IoMdEyeOff } from "react-icons/io";
import { Social } from "./Social";
import { BsCart } from "react-icons/bs";
import { useSearchParams } from "next/navigation";

const mercadolibreAuthUrl: string =
  "https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=7423381817150989&redirect_uri=https://savemelin.com/";

const RegisterForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const saveProductUrl = searchParams.get("saveProductUrl");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isVisible, setIsVisible] = useState(false);

  const signInHref = useMemo(() => {
    const params = new URLSearchParams();
    if (callbackUrl) params.set("callbackUrl", callbackUrl);
    if (saveProductUrl) params.set("saveProductUrl", saveProductUrl);
    const query = params.toString();
    return query ? `/sign-in?${query}` : "/sign-in";
  }, [callbackUrl, saveProductUrl]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      country: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      registration(values)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
        })
        .catch((submitError) => {
          console.error("Error occurred during registration:", submitError);
          setError("Algo salió mal, intenta nuevamente.");
        });
    });
  };

  return (
    <CardWrapper
      HeaderLabel="Crea tu cuenta"
      backButtonHref={signInHref}
      backButtonLabel="¿Ya tienes una cuenta? Iniciar sesión"
    >
      {saveProductUrl && (
        <p className="mb-3 text-xs text-muted-foreground">
          Crea tu cuenta para guardar este producto y empezar su seguimiento.
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
          <label htmlFor="name" className="block text-sm text-muted-foreground">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            disabled={isPending}
            placeholder="Tu nombre"
            {...register("name")}
            className="w-full h-11 border border-border bg-section-grey px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:border-foreground/30"
          />
          {errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm text-muted-foreground">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              autoComplete="new-password"
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
        </div>

        <div className="space-y-1">
          <label htmlFor="country" className="block text-sm text-muted-foreground">
            País
          </label>
          <select
            id="country"
            disabled={isPending}
            {...register("country")}
            className="w-full h-11 border border-border bg-section-grey px-3 text-sm text-foreground focus:outline-none focus:border-foreground/30"
          >
            <option value="">Seleccionar país</option>
            <option value="argentina">Argentina</option>
            <option value="brasil">Brasil</option>
            <option value="colombia">Colombia</option>
            <option value="uruguay">Uruguay</option>
          </select>
          {errors.country && <span className="text-xs text-red-600">{errors.country.message}</span>}
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center bg-primary h-11 px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <div className="my-4 text-center text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        o continúa con
      </div>
      <Social />

      <a
        href={mercadolibreAuthUrl}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 h-11 border border-border/70 bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90"
      >
        <BsCart className="h-5 w-5" aria-hidden={true} />
        Iniciar como vendedor
      </a>

      <p className="mt-4 text-xs text-muted-foreground">
        Al registrarte aceptas nuestra política de{" "}
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

export default RegisterForm;
