"use client";
import React, { useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
} from "@nextui-org/react";

import useProductModal from "@/hooks/use-product-modal";
import { STEPS } from "@/types";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, useForm } from "react-hook-form";

export default function PublishProductModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [step, setStep] = useState(STEPS.CATEGORY);
  const productModal = useProductModal();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      title: "",
      category: "",
      available_quantity: 1,
      condition: "",
      pictures: "",
      attributes: [],
      price: "1",
    },
  });

  const category = watch("category");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    if (step > STEPS.CATEGORY) {
      setStep((prevStep) => prevStep - 1);
    } else {
      // For now, let's close the modal
      productModal.onClose();
    }
  };

  const onNext = () => {
    if (step < STEPS.PRICE) {
      setStep((step) => step + 1);
    } else {
      console.log("Form submitted");
    }
  };

  const actionLabel = step === STEPS.PRICE ? "Publicar" : "Siguiente";

  const secondaryActionLabel = step === STEPS.CATEGORY ? "Cerrar" : "Atras";

  let bodyContent = (
    <div>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Publica el producto
        </ModalHeader>
        <ModalBody>
          <Input
            autoFocus
            label="Título"
            placeholder="Ej: Microondas Grill BGH Quick Chef B223D plata 23L 220V"
            variant="bordered"
          />
          <CategoryInput
            label="Seleccionar categoría"
            onClick={(category) => setCustomValue("category", category)}
          />
          <Select
            variant="underlined"
            label="Condición"
            placeholder="En qué condición se encuentra el producto?"
            className="max-w-xs"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="flat"
            // onClick={() => productModal.onClose()}
            onPress={onBack}
          >
            {secondaryActionLabel}
          </Button>
          <Button color="primary" onPress={onNext}>
            {actionLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </div>
  );

  if (step === STEPS.INFO) {
    bodyContent = (
      <div>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Completa la información
          </ModalHeader>
          <ModalBody>
            <Input
              autoFocus
              label="Título"
              placeholder="Ej: Microondas Grill BGH Quick Chef B223D plata 23L 220V"
              variant="bordered"
            />
            <CategoryInput
              label="Seleccionar categoría"
              onClick={(category) => setCustomValue("category", category)}
            />
            <Select
              variant="underlined"
              label="Condición"
              placeholder="En qué condición se encuentra el producto?"
              className="max-w-xs"
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onBack}>
              {secondaryActionLabel}
            </Button>
            <Button color="primary" onPress={onNext}>
              {actionLabel}
            </Button>
          </ModalFooter>
        </ModalContent>
      </div>
    );
  }

  return (
    <>
      <Button onPress={onOpen} color="primary">
        Publicar
      </Button>
      <Modal
        isOpen={productModal.isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        {bodyContent}
      </Modal>
    </>
  );
}
