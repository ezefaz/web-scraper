"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getMLUserCode } from "@/app/actions/get-ml-user-code";
import { SellerProfile } from "@/types";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { IoCloudyNight } from "react-icons/io5";
import { IoMdCheckboxOutline } from "react-icons/io";

const steps = [
  {
    id: 1,
    type: "done",
    title: "Iniciar sesión con Mercadolibre",
    description: "Para comenzar, debes haberte logueado con tu cuenta.",
    href: "#",
  },
  {
    id: 2,
    type: "in progress",
    title: "Import data",
    description:
      "Connect your database to the new workspace by using one of 20+ database connectors.",
    href: "#",
  },
  {
    id: 3,
    type: "open",
    title: "Comienza a vender",
    description:
      "Una vez configurada tu cuenta ya puedes empezar a utilizar la plataforma.",
    href: "#",
  },
];

type Props = {};

const BusinessProfilePage = (props: Props) => {
  const [userData, setUserData] = useState<SellerProfile | null>(null);
  const searchParams = useSearchParams();

  const code = searchParams.get("code");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: SellerProfile = await getMLUserCode(code);

        setUserData(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  console.log("DATUUUN", userData);

  return (
    <>
      <div className="sm:mx-0 sm:max-w-full">
        <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Bienvenido, {userData?.first_name}
        </h3>
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Comencemos a configurar tu cuenta de vendedor.
        </p>
        <ul role="list" className="mt-8 space-y-3">
          {steps.map((step) =>
            step.type === "done" ? (
              <li key={step.id} className="relative p-4">
                <div className="flex items-start">
                  <IoMdCheckboxOutline
                    className="h-6 w-6 shrink-0 text-tremor-brand dark:text-dark-tremor-brand"
                    aria-hidden={true}
                  />
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="font-medium leading-5 text-tremor-content-strong dark:text-dark-tremor-content-strong">
                      <a href={step.href} className="focus:outline-none">
                        {/* extend link to entire list card */}
                        <span className="absolute inset-0" aria-hidden={true} />
                        {step.title}
                      </a>
                    </p>
                    <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                      {step.description}
                    </p>
                  </div>
                </div>
              </li>
            ) : step.type === "in progress" ? (
              <li className="rounded-tremor-default bg-tremor-background-muted p-4 dark:bg-dark-tremor-background-muted">
                <div className="flex items-start">
                  <MdCheckBoxOutlineBlank
                    className="h-6 w-6 shrink-0 text-tremor-brand dark:text-dark-tremor-brand"
                    aria-hidden={true}
                  />
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="font-medium leading-5 text-tremor-content-strong dark:text-dark-tremor-content-strong">
                      {step.title}
                    </p>
                    <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                      {step.description}
                    </p>
                    <button
                      type="button"
                      className="mt-4 inline-flex items-center gap-1.5 whitespace-nowrap rounded-tremor-small bg-tremor-brand px-3 py-2 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis"
                    >
                      <IoCloudyNight
                        className="-ml-0.5 h-5 w-5 shrink-0"
                        aria-hidden={true}
                      />
                      Connect database
                    </button>
                  </div>
                </div>
              </li>
            ) : (
              <li className="relative p-4">
                <div className="flex items-start">
                  <MdCheckBoxOutlineBlank
                    className="h-6 w-6 shrink-0 text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
                    aria-hidden={true}
                  />
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="font-medium leading-5 text-tremor-content-subtle dark:text-dark-tremor-content-subtle">
                      <a href={step.href} className="focus:outline-none">
                        {/* extend link to entire list card */}
                        <span className="absolute inset-0" aria-hidden={true} />
                        {step.title}
                      </a>
                    </p>
                    <p className="mt-1 text-tremor-default leading-6 text-tremor-content-subtle dark:text-dark-tremor-content-subtle">
                      {step.description}
                    </p>
                  </div>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
    </>
  );
};

export default BusinessProfilePage;
