"use client";

import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa";
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
    // <div className="flex items-center space-x-3">
    <>
      <a
        href="#"
        className="inline-flex w-full mt-2 items-center justify-center space-x-2 rounded-tremor-default border border-tremor-border bg-tremor-background py-2 text-tremor-content-strong shadow-tremor-input hover:bg-tremor-background-subtle dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:text-dark-tremor-content-strong dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-background-subtle"
      >
        <BsGoogle className="h-5 w-5" aria-hidden={true} />
        <span
          className="text-tremor-default font-medium"
          onClick={() => onClick("google")}
        >
          Iniciar sesión con Google
        </span>
      </a>
      <a
        href="#"
        className="inline-flex w-full mt-2 items-center justify-center space-x-2 rounded-tremor-default border border-tremor-border bg-tremor-background py-2 text-tremor-content-strong shadow-tremor-input hover:bg-tremor-background-subtle dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:text-dark-tremor-content-strong dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-background-subtle"
      >
        <BsGithub className="h-5 w-5" aria-hidden={true} />
        <span
          className="text-tremor-default font-medium"
          onClick={() => onClick("github")}
        >
          Iniciar sesión con Github
        </span>
      </a>
    </>
    // </div>
  );
};
