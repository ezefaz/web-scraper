"use client";

import * as z from "zod";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import CardWrapper from "../CardWrapper";
import FormError from "./FormError";
import FormSuccess from "./FormSuccess";

import { useState, useTransition } from "react";
import { Button, Divider } from "@tremor/react";
import { login } from "@/app/actions/login";
import { Social } from "./Social";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@nextui-org/react";
import { TbEyeFilled } from "react-icons/tb";
import { IoMdEyeOff } from "react-icons/io";
import { BsGithub, BsGoogle } from "react-icons/bs";

type Props = {};

const LoginForm = (props: Props) => {
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
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    try {
      startTransition(async () => {
        const data = await login(values, callbackUrl);

        if (data?.error) {
          console.log("Error:", data.error);
          setError(data.error);
        }

        if (data?.success) {
          console.log("Success:", data.success);
          setSuccess(data.success);
        }
      });
    } catch (error) {
      setError("Something went wrong");
      console.error("Error occurred during login:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <CardWrapper
        HeaderLabel="Bienvenido!"
        backButtonHref="/sign-up"
        backButtonLabel="No tienes una cuenta?"
        showSocial
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input
              id="email"
              type="email"
              label="Email"
              variant="bordered"
              disabled={isPending}
              placeholder="Ingresa tu correo"
              {...register("email")}
              className="max-w-xs"
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
          <div>
            <Input
              id="password"
              label="Contraseña"
              variant="bordered"
              disabled={isPending}
              placeholder="******"
              {...register("password")}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <IoMdEyeOff className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <TbEyeFilled className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              className="max-w-xs"
            />
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
            <button className="block px-0 py-2 mt-2 text-sm font-normal text-gray-600 hover:text-primary focus:outline-none focus:text-blue-500">
              <Link href="/reset">Olvidaste tu contraseña?</Link>
            </button>
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <div>
            <Button
              type="submit"
              size="md"
              disabled={isPending}
              className="w-full bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded-md transition duration-300"
            >
              Iniciar Sesión
            </Button>
          </div>
        </form>
        {/* <div className="mt-4 flex justify-between items-center"> */}
        <Divider className="block px-0 text-sm text-center font-normal text-gray-600 hover:text-primary focus:outline-none focus:text-blue-500">
          o inicia sesión con:
        </Divider>
        <Social />
        <p className="mt-4 text-tremor-label text-tremor-content dark:text-dark-tremor-content">
          Al iniciar sesión, estas aceptando nuestros politicas de{" "}
          {/* <a href="#" className="underline underline-offset-4">
            terms of service
          </a>{" "} */}
          {/* and{" "} */}
          <a
            href="/privacy-policy"
            className="underline underline-offset-4 hover:text-primary"
            target="_blank"
          >
            privacidad
          </a>
          .
        </p>
        {/* <span className='text-sm text-gray-700'>O inicia sesión con:</span> */}
        {/* <div className='flex items-center space-x-3'> */}
        {/* <Social /> */}

        {/* <button className='rounded-full bg-red-600 text-white p-2 hover:bg-red-700'>
							<FaGoogle size={20} />
						</button>
						<button className='rounded-full bg-black text-white p-2 hover:bg-gray-800'>
							<FaGithub size={20} />
						</button>
					</div> */}
        {/* </div> */}
      </CardWrapper>
    </div>
  );
};

export default LoginForm;
