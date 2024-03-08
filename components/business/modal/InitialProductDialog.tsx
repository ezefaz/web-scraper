"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import useProductModal from "@/hooks/use-product-modal";
import { Button, Dialog, DialogPanel } from "@tremor/react";
import React, { useCallback } from "react";

export function InitialProductDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const productModal = useProductModal();

  const onPublish = useCallback(() => {
    setIsOpen(false);
    productModal.onOpen();
  }, [productModal]);

  return (
    <>
      <Button className="mx-auto block" onClick={() => setIsOpen(true)}>
        Publicar
      </Button>
      <Dialog
        open={isOpen}
        onClose={(val: any) => setIsOpen(val)}
        static={true}
      >
        <DialogPanel>
          <h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Considera los siguientes puntos antes de publicar un producto.
          </h3>
          <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            1. Sigue la estructura:{" "}
            <span className="text-black font-semibold">
              Producto + Marca + modelo del producto + algunas especificaciones{" "}
            </span>
            . Ejemplo: Microondas Grill BGH Quick Chef B223D plata 23L 220V
          </p>
          <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            2.{" "}
            <span className="text-black font-semibold">
              {" "}
              Evita dar información de otros beneficios{" "}
            </span>
            , como devoluciones, envío gratis o pagos en cuotas.
          </p>
          <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            3.{" "}
            <span className="text-black font-semibold">
              Si el producto es nuevo, usado o reacondicionado,{" "}
            </span>{" "}
            no lo incluyas en el título, cárgalo en las características. Esta
            información se mostrará en el detalle de la publicación.
          </p>
          <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            4.{" "}
            <span className="text-black font-semibold">
              No está permitido mencionar stock.
            </span>
          </p>
          <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            5.{" "}
            <span className="text-black font-semibold">
              No menciones marcas de terceros.
            </span>
          </p>
          <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            6.{" "}
            <span className="text-black font-semibold">
              Si realizas algún descuento
            </span>
            , usa las etiquetas especiales o indica el porcentaje de la
            promoción.
          </p>
          <Button
            className="mt-8 w-full btn text-white mr-8"
            onClick={() => onPublish()}
          >
            Entendido!
          </Button>
        </DialogPanel>
      </Dialog>
    </>
  );
}
