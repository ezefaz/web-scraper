// 'use client';

import { getSeller } from "@/lib/actions";
import { PlusIcon } from "lucide-react";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

const steps = [
  {
    id: 1,
    type: "done",
    title: "Ingresa con tu cuenta de Mercadolibre",
    description:
      "Para comenzar, necesitamos que nos brindes permiso con tu cuenta de Mercadolibre iniciando sesión.",
    href: "#",
  },
  {
    id: 2,
    type: "open",
    title: "Verifica tus datos",
    description:
      "Confirma que los datos fueron cargados al sistema correctamente haciendo click aquí.",
    href: "/business/settings",
  },
  {
    id: 3,
    type: "in progress",
    title: "Comienza con publicar un producto",
    description:
      "Prueba la funcionalidad de crear un producto en Mercadolibre, vas a ver que es mas simple y cómodo hacerlo desde aquí. Además puedes generar tu primer reporte utilizando nuestras plantillas o nuestro constructor facil de utilizar.",
    href: "#",
  },
];

export default async function BusinessOnboarding() {
  const seller = await getSeller();
  return (
    <>
      <div className="mt-20 sm:mx-auto sm:max-w-lg">
        <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Hola {seller.first_name},
        </h3>
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Comencemos a configurar tu espacio de trabajo.
        </p>
        <ul role="list" className="mt-8 space-y-4">
          {steps.map((step) => (
            <li key={step.id} className="relative p-4">
              <div className="flex items-start">
                <div className="mr-3">
                  {step.type === "done" ? (
                    <MdCheckBox
                      className="h-6 w-6 text-tremor-brand dark:text-dark-tremor-brand"
                      aria-hidden={true}
                    />
                  ) : (
                    <MdCheckBoxOutlineBlank
                      className="h-6 w-6 text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
                      aria-hidden={true}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium leading-5 ${
                      step.type === "done"
                        ? "text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        : "text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
                    }`}
                  >
                    <a href={step.href} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden={true} />
                      {step.title}
                    </a>
                  </p>
                  <p
                    className={`mt-1 text-tremor-default leading-6 ${
                      step.type === "done"
                        ? "text-tremor-content dark:text-dark-tremor-content"
                        : "text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
                    }`}
                  >
                    {step.description}
                  </p>
                  {step.type === "in progress" && (
                    <button
                      type="button"
                      className="mt-4 inline-flex items-center gap-1.5 whitespace-nowrap rounded-tremor-small bg-tremor-brand px-3 py-2 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis"
                    >
                      <PlusIcon
                        className="-ml-0.5 h-5 w-5"
                        aria-hidden={true}
                      />
                      Publica un producto
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
