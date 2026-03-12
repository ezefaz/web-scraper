"use client";

import CardWrapper from "../CardWrapper";
import { SyncLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/app/actions/new-verification";
import FormSuccess from "./FormSuccess";
import FormError from "./FormError";

const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (success || error) return;

    if (!token) {
      setError("Falta el token de verificación.");
      return;
    }

    await newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Algo salió mal durante la verificación.");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      HeaderLabel="Confirmando tu verificación..."
      backButtonHref="/sign-in"
      backButtonLabel="Volver a iniciar sesión"
    >
      <p className="text-sm text-muted-foreground leading-relaxed">
        Estamos validando el enlace de verificación para activar tu cuenta.
        Este proceso puede tardar unos segundos.
      </p>
      <div className="flex items-center w-full justify-center mt-10 mb-8">
        {!success && !error && <SyncLoader color="#e29656" size={8} />}
      </div>

      <FormSuccess message={success} />
      {!success && <FormError message={error} />}
    </CardWrapper>
  );
};

export default NewVerificationForm;
