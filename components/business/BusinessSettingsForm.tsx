// 'use client';
import { SellerProfile } from "@/types";
import { Divider, Tab, TabGroup, TabList, TextInput } from "@tremor/react";

export default function BusinessSettingsForm({ sellerData }: any) {
  return (
    <main className="w-full p-10 flex flex-wrap">
      <div className="w-full md:w-2/3 pr-8">
        <h3 className="text-tremor-title font-bold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Configuración
        </h3>
        <p className="mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
          Configura tus detalles personales, espacio de trabajo y
          notificaciones.
        </p>
      </div>
      <form action="#" method="post" className="w-full md:w-2/3 mt-8">
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
          <div className="col-span-2 sm:col-span-3">
            <label
              htmlFor="first-name"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Nombre
              <span className="text-red-500">*</span>
            </label>
            <TextInput
              type="text"
              id="first-name"
              name="first-name"
              value={sellerData.first_name}
              autoComplete="first-name"
              placeholder="Nombre"
              className="mt-2"
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-3">
            <label
              htmlFor="last-name"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Apellido
              <span className="text-red-500">*</span>
            </label>
            <TextInput
              type="text"
              id="last-name"
              name="last-name"
              value={sellerData.last_name}
              autoComplete="last-name"
              placeholder="Apellido"
              className="mt-2"
              required
            />
          </div>
          <div className="col-span-full">
            <label
              htmlFor="email"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Email
              <span className="text-red-500">*</span>
            </label>
            <TextInput
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              placeholder="Email"
              value={sellerData.email}
              className="mt-2"
              required
            />
          </div>
          <div className="col-span-full">
            <label
              htmlFor="phone"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Celular
              <span className="text-red-500">*</span>
            </label>
            <TextInput
              type="phone"
              id="phone"
              name="phone"
              autoComplete="phone"
              placeholder="Celular"
              value={`${sellerData.phone.area_code} ${sellerData.phone.number}`}
              className="mt-2"
              required
            />
          </div>
          <div className="col-span-full">
            <label
              htmlFor="address"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Dirección
            </label>
            <TextInput
              type="text"
              id="address"
              name="address"
              value={sellerData.address.address}
              autoComplete="street-address"
              placeholder="Address"
              className="mt-2"
            />
          </div>
          <div className="col-span-full sm:col-span-2">
            <label
              htmlFor="city"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Ciudad
            </label>
            <TextInput
              type="text"
              id="city"
              name="city"
              value={sellerData.address.city}
              autoComplete="address-level2"
              placeholder="City"
              className="mt-2"
            />
          </div>
          <div className="col-span-full sm:col-span-2">
            <label
              htmlFor="state"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Estado
            </label>
            <TextInput
              type="text"
              id="state"
              name="state"
              value={sellerData.address.state}
              autoComplete="address-level1"
              placeholder="State"
              className="mt-2"
            />
          </div>
          <div className="col-span-full sm:col-span-2">
            <label
              htmlFor="postal-code"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Código postal
            </label>
            <TextInput
              id="postal-code"
              name="postal-code"
              autoComplete="postal-code"
              value={sellerData.address.zip_code}
              placeholder="Postal code"
              className="mt-2"
            />
          </div>
          <div className="col-span-full sm:col-span-2">
            <label
              htmlFor="document-id"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              {sellerData.identification.type}
            </label>
            <TextInput
              id="document-id"
              name="document-id"
              autoComplete="document-id"
              value={sellerData.identification.number}
              placeholder="Número de documento"
              className="mt-2"
            />
          </div>
        </div>
        <Divider />
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            className="whitespace-nowrap rounded-tremor-small px-4 py-2.5 text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="whitespace-nowrap rounded-tremor-default bg-tremor-brand px-4 py-2.5 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis"
          >
            Actualizar
          </button>
        </div>
      </form>
      <Divider className="w-full mt-8 md:hidden" />
      <div className="w-full md:w-1/3 mt-8 md:mt-0">
        <h3 className="text-tremor-title font-bold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Notificaciones
        </h3>
        <p className="mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
          Configure sus notificaciones personales para este espacio de trabajo.
        </p>
      </div>
    </main>
  );
}
