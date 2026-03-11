"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import CardWrapper from "../CardWrapper";
import FormError from "./FormError";
import FormSuccess from "./FormSuccess";

import { useState, useTransition } from "react";
import { login } from "@/app/actions/login";
import { Social } from "./Social";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@nextui-org/react";
import { TbEyeFilled } from "react-icons/tb";
import { IoMdEyeOff } from "react-icons/io";

const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "El correo es utilizado con otro proveedor"
      : "";

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
    <CardWrapper HeaderLabel="Bienvenido de nuevo" backButtonHref="/sign-up" backButtonLabel="¿No tienes una cuenta? Crear cuenta">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Input
            id="email"
            type="email"
            label="Email"
            autoComplete="email"
            variant="bordered"
            disabled={isPending}
            placeholder="tu@email.com"
            {...register("email")}
            className="w-full"
          />
          {errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
        </div>

        <div className="space-y-1">
          <Input
            id="password"
            label="Contraseña"
            autoComplete="current-password"
            variant="bordered"
            disabled={isPending}
            placeholder="••••••••"
            {...register("password")}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {isVisible ? (
                  <IoMdEyeOff className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <TbEyeFilled className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            className="w-full"
          />
          {errors.password && <span className="text-xs text-red-600">{errors.password.message}</span>}
          <Link href="/reset" className="inline-block text-xs font-medium text-gray-600 transition hover:text-primary">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <FormError message={error || urlError} />
        <FormSuccess message={success} />

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>

      <div className="my-5 text-center text-xs font-medium uppercase tracking-[0.12em] text-gray-500">o continúa con</div>
      <Social />
      <p className="mt-5 text-xs text-gray-600 dark:text-gray-300">
        Al iniciar sesión aceptas nuestra política de{" "}
        <a
          href="/privacy-policy"
          className="font-medium text-primary underline underline-offset-4"
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
