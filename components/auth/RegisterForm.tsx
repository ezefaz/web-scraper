"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import CardWrapper from "../CardWrapper";
import FormError from "./FormError";
import FormSuccess from "./FormSuccess";
import { register as registration } from "@/app/actions/register";
import { Input } from "@nextui-org/react";
import { TbEyeFilled } from "react-icons/tb";
import { IoMdEyeOff } from "react-icons/io";
import { Social } from "./Social";
import { BsCart } from "react-icons/bs";

const mercadolibreAuthUrl: string =
  "https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=7423381817150989&redirect_uri=https://savemelin.com/";

const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isVisible, setIsVisible] = useState(false);

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
    <CardWrapper HeaderLabel="Crea tu cuenta" backButtonHref="/sign-in" backButtonLabel="¿Ya tienes una cuenta? Iniciar sesión">
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
            id="name"
            type="text"
            label="Nombre"
            autoComplete="name"
            variant="bordered"
            disabled={isPending}
            placeholder="Tu nombre"
            {...register("name")}
            className="w-full"
          />
          {errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}
        </div>

        <div className="space-y-1">
          <Input
            id="password"
            label="Contraseña"
            autoComplete="new-password"
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
        </div>

        <div className="space-y-1">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            País
          </label>
          <select
            id="country"
            disabled={isPending}
            {...register("country")}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-white/15 dark:bg-black/30 dark:text-gray-100"
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
          className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <div className="my-5 text-center text-xs font-medium uppercase tracking-[0.12em] text-gray-500">o continúa con</div>
      <Social />

      <a
        href={mercadolibreAuthUrl}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black/85 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20"
      >
        <BsCart className="h-5 w-5" aria-hidden={true} />
        Iniciar como vendedor
      </a>

      <p className="mt-5 text-xs text-gray-600 dark:text-gray-300">
        Al registrarte aceptas nuestra política de{" "}
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

export default RegisterForm;
