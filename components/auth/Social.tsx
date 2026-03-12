"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { BsGithub, BsGoogle } from "react-icons/bs";

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={() => onClick("google")}
        className="inline-flex w-full items-center justify-center gap-2 h-11 border border-border/70 bg-section-grey px-4 text-sm font-medium text-foreground transition hover:bg-background"
      >
        <BsGoogle className="h-5 w-5" aria-hidden={true} />
        Continuar con Google
      </button>
      <button
        type="button"
        onClick={() => onClick("github")}
        className="inline-flex w-full items-center justify-center gap-2 h-11 border border-border/70 bg-section-grey px-4 text-sm font-medium text-foreground transition hover:bg-background"
      >
        <BsGithub className="h-5 w-5" aria-hidden={true} />
        Continuar con GitHub
      </button>
    </div>
  );
};
