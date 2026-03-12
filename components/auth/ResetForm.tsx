"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema } from "@/schemas";
import CardWrapper from "../CardWrapper";
import FormError from "./FormError";
import FormSuccess from "./FormSuccess";

import { useState, useTransition } from "react";
import { reset } from "@/app/actions/reset";

const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      reset(values).then((data: any) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };
  return (
    <CardWrapper
      HeaderLabel="¿Olvidaste tu contraseña?"
      backButtonHref="/sign-in"
      backButtonLabel="Volver a iniciar sesión"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          {errors.email && (
            <span className="text-xs text-red-600">{errors.email.message}</span>
          )}
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center bg-primary h-11 px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Enviando..." : "Enviar correo de recupero"}
        </button>
      </form>
    </CardWrapper>
  );
};

export default ResetForm;
