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
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-white/15 dark:bg-black/30 dark:text-gray-100 dark:hover:bg-white/5"
      >
        <BsGoogle className="h-5 w-5" aria-hidden={true} />
        Continuar con Google
      </button>
      <button
        type="button"
        onClick={() => onClick("github")}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-white/15 dark:bg-black/30 dark:text-gray-100 dark:hover:bg-white/5"
      >
        <BsGithub className="h-5 w-5" aria-hidden={true} />
        Continuar con GitHub
      </button>
    </div>
  );
};
