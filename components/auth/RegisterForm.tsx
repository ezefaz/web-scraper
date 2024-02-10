"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import CardWrapper from "../CardWrapper";
import FormError from "./FormError";
import FormSuccess from "./FormSuccess";
import { Button, Divider } from "@tremor/react";
import { register as registration } from "@/app/actions/register";
import CountrySelect from "./CountrySelect";
import { Avatar, Input, Select, SelectItem } from "@nextui-org/react";
import { TbEyeFilled } from "react-icons/tb";
import { IoMdEyeOff } from "react-icons/io";
import Link from "next/link";
import { Social } from "./Social";
import { BsCart } from "react-icons/bs";

type Props = {};

const mercadolibreAuthUrl: string =
  "https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=7423381817150989&redirect_uri=https://savemelin.com/";

const RegisterForm = (props: Props) => {
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

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      registration(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <CardWrapper
        HeaderLabel="Crea una cuenta!"
        backButtonHref="/sign-in"
        backButtonLabel="Ya tienes una cuenta?"
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
              id="name"
              type="name"
              label="Nombre"
              variant="bordered"
              disabled={isPending}
              placeholder="Ingresa tu nombre"
              {...register("name")}
              className="max-w-xs"
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
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
          </div>

          <div>
            <Select
              className="max-w-xs"
              label="Seleccionar País"
              id="country"
              {...register("country")}
            >
              <SelectItem
                key="argentina"
                id="country"
                {...register("country")}
                startContent={
                  <Avatar
                    alt="Argentina"
                    className="w-6 h-6"
                    src="https://flagcdn.com/ar.svg"
                  />
                }
              >
                Argentina
              </SelectItem>
              <SelectItem
                key="brazil"
                id="country"
                {...register("country")}
                startContent={
                  <Avatar
                    alt="Brazil"
                    className="w-6 h-6"
                    src="https://flagcdn.com/br.svg"
                  />
                }
              >
                Brasil
              </SelectItem>
              <SelectItem
                key="colombia"
                id="country"
                {...register("country")}
                startContent={
                  <Avatar
                    alt="Colombia"
                    className="w-6 h-6"
                    src="https://flagcdn.com/co.svg"
                  />
                }
              >
                Colombia
              </SelectItem>
              <SelectItem
                key="uruguay"
                id="country"
                {...register("country")}
                startContent={
                  <Avatar
                    alt="Uruguay"
                    className="w-6 h-6"
                    src="https://flagcdn.com/uy.svg"
                  />
                }
              >
                Uruguay
              </SelectItem>
              {/* <SelectItem
                key='venezuela'
                id='country'
                {...register('country')}
                startContent={<Avatar alt='Venezuela' className='w-6 h-6' src='https://flagcdn.com/ve.svg' />}
              >
                Venezuela
              </SelectItem> */}
            </Select>
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <div>
            <Button
              type="submit"
              size="md"
              disabled={isPending}
              className="inline-flex w-full mt-4 items-center justify-center space-x-2 rounded-tremor-default border border-tremor-border bg-primary py-2 text-tremor-content-strong shadow-tremor-input hover:bg-tremor-background-subtle dark:border-dark-tremor-border dark:bg-dark-tremor-background text-white hover:text-black dark:text-dark-tremor-content-strong dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-background-subtle"
            >
              Crear Cuenta
            </Button>
          </div>
        </form>
        <Divider className="block px-0 text-sm text-center font-normal text-gray-600 hover:text-primary focus:outline-none focus:text-blue-500"></Divider>
        <Social />
        <a
          href={mercadolibreAuthUrl}
          className="inline-flex w-full mt-2 items-center justify-center space-x-2 rounded-tremor-default border border-tremor-border bg-primary py-2 text-tremor-content-strong shadow-tremor-input hover:bg-tremor-background-subtle dark:border-dark-tremor-border dark:bg-dark-tremor-background text-white hover:text-black dark:text-dark-tremor-content-strong dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-background-subtle"
        >
          <BsCart className="h-5 w-5" aria-hidden={true} />
          <span className="text-tremor-default font-medium">
            Iniciar como vendedor
          </span>
        </a>
        <p className="mt-4 text-tremor-label text-tremor-content dark:text-dark-tremor-content">
          Al iniciar sesión, estas aceptando nuestros politicas de{" "}
          {/* <a href="#" className="underline underline-offset-4">
            terms of service
          </a>{" "} */}
          {/* and{" "} */}
          <a
            href="/privacy-policy"
            className="underline underline-offset-4"
            target="_blank"
          >
            privacidad
          </a>
          .
        </p>
      </CardWrapper>
    </div>
  );
};

export default RegisterForm;
