"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
  Select,
} from "@nextui-org/react";
import { LockIcon, MailIcon } from "lucide-react";
import { IoPricetag } from "react-icons/io5";

export default function PublishProductModal() {
  const variants = ["flat", "bordered", "underlined", "faded"];

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [productData, setProductData] = useState({});

  const handleImageUpload = () => {};

  return (
    <>
      <Button onPress={onOpen} color="primary">
        Publicar
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Publica el producto
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  //   endContent={
                  //     <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  //   }
                  label="Título"
                  placeholder="Ingresa el título del producto"
                  //   value={productData.title}
                  onChange={(e) =>
                    setProductData({ ...productData, title: e.target.value })
                  }
                  variant="bordered"
                />
                <Input
                  type="number"
                  endContent={
                    <IoPricetag className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Precio"
                  placeholder="0.00"
                  labelPlacement="outside"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                />
                <Select
                  variant="underlined"
                  label="Categoría"
                  placeholder="Seleccione una categoría"
                  className="max-w-xs"
                >
                  {/* {animals.map((animal) => (
                    <SelectItem key={animal.value} value={animal.value}>
                      {animal.label}
                    </SelectItem>
                  ))} */}
                </Select>
                <Select
                  variant="underlined"
                  label="Condición"
                  placeholder="En qué condición se encuentra el producto?"
                  className="max-w-xs"
                >
                  {/* {animals.map((animal) => (
                    <SelectItem key={animal.value} value={animal.value}>
                      {animal.label}
                    </SelectItem>
                  ))} */}
                </Select>
                <Input
                  type="number"
                  label="Stock"
                  defaultValue="1"
                  labelPlacement="outside"
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small"></span>
                    </div>
                  }
                />
                <Input
                  endContent={
                    <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Category ID"
                  placeholder="Enter category ID"
                  //   value={productData.category_id}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      category_id: e.target.value,
                    })
                  }
                  variant="bordered"
                />
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Imágenes
                  </label>
                  <div className="mt-1 flex justify-center items-center">
                    <Input
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e)}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={onClose}>
                  Publicar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
