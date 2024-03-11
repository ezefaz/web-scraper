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
	SelectItem,
} from "@nextui-org/react";

import useProductModal from "@/hooks/use-product-modal";
import { STEPS } from "@/types";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, useForm } from "react-hook-form";
import ImageUpload from "../ImageUpload";
import DescriptionInput from "../inputs/DescriptionInput";

const conditions = [
	{
		id: "2230284",
		name: "Nuevo",
	},
	{
		id: "2230581",
		name: "Usado",
	},
	{
		id: "2230582",
		name: "Reacondicionado",
	},
];

const genders = [
	{
		id: "339665",
		name: "Mujer",
	},
	{
		id: "339666",
		name: "Hombre",
	},
	{
		id: "339668",
		name: "Niñas",
	},
	{
		id: "339667",
		name: "Niños",
	},
	{
		id: "110461",
		name: "Sin género",
	},
	{
		id: "19159491",
		name: "Sin género infantil",
	},
	{
		id: "371795",
		name: "Bebés",
	},
];

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
			gender: "",
			attributes: [],
			price: "1",
		},
	});

	const category = watch("category");
	const pictures = watch("pictures");

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
				<ModalHeader className='flex flex-col gap-1'>
					Publica el producto
				</ModalHeader>
				<ModalBody>
					<Input
						autoFocus
						label='Título'
						placeholder='Ej: Microondas Grill BGH Quick Chef B223D plata 23L 220V'
						variant='bordered'
					/>
					<CategoryInput
						label='Seleccionar categoría'
						onClick={(category) => setCustomValue("category", category)}
					/>
					<Select
						variant='underlined'
						label='Condición'
						placeholder='En cual condición se encuentra su producto?'
						className='max-w-xs'
						{...register("condition")}>
						{conditions &&
							conditions.map((condition: any) => (
								<SelectItem key={condition.id} value={condition.id}>
									{condition.name}
								</SelectItem>
							))}
					</Select>
				</ModalBody>
				<ModalFooter>
					<Button
						color='danger'
						variant='flat'
						// onClick={() => productModal.onClose()}
						onPress={onBack}>
						{secondaryActionLabel}
					</Button>
					<Button color='primary' onPress={onNext}>
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
					<ModalHeader className='flex flex-col gap-1'>
						Completa la información
					</ModalHeader>
					<ModalBody>
						<Input
							type='number'
							variant='underlined'
							label='Stock'
							placeholder='1'
							labelPlacement='outside'
							defaultValue='1'
							aria-valuemin={1}
							endContent={
								<div className='pointer-events-none flex items-center'>
									<span className='text-default-400 text-small'>Q</span>
								</div>
							}
						/>
						<Select
							variant='underlined'
							label='Género'
							placeholder='Seleccione el género'
							className='max-w-xs'
							{...register("gender")}>
							{genders &&
								genders.map((gender: any) => (
									<SelectItem key={gender.id} value={gender.id}>
										{gender.name}
									</SelectItem>
								))}
						</Select>

						<DescriptionInput />
					</ModalBody>
					<ModalFooter>
						<Button color='danger' variant='flat' onPress={onBack}>
							{secondaryActionLabel}
						</Button>
						<Button color='primary' onPress={onNext}>
							{actionLabel}
						</Button>
					</ModalFooter>
				</ModalContent>
			</div>
		);
	}

	if (step === STEPS.IMAGES) {
		bodyContent = (
			<div>
				<ModalContent>
					<ModalHeader className='flex flex-col gap-1'>
						Suba las imagenes
					</ModalHeader>
					<ModalBody>
						<ImageUpload
							onChange={(value) => setCustomValue("pictures", value)}
							value={pictures}
						/>
						{/* <Input
							label='Stock'
							onClick={(stock) => setCustomValue("available_quantity", stock)}
						/> */}
					</ModalBody>
					<ModalFooter>
						<Button color='danger' variant='flat' onPress={onBack}>
							{secondaryActionLabel}
						</Button>
						<Button color='primary' onPress={onNext}>
							{actionLabel}
						</Button>
					</ModalFooter>
				</ModalContent>
			</div>
		);
	}

	if (step === STEPS.ATTRIBUTES) {
		bodyContent = (
			<div>
				<ModalContent>
					<ModalHeader className='flex flex-col gap-1'>
						Atributos del Producto
					</ModalHeader>
					<ModalBody>
						<Input
							type='number'
							label='Atributos'
							placeholder='0.00'
							labelPlacement='outside'
							startContent={
								<div className='pointer-events-none flex items-center'>
									<span className='text-default-400 text-small'>$</span>
								</div>
							}
						/>
					</ModalBody>
					<ModalFooter>
						<Button color='danger' variant='flat' onPress={onBack}>
							{secondaryActionLabel}
						</Button>
						<Button color='primary' onPress={onNext}>
							{actionLabel}
						</Button>
					</ModalFooter>
				</ModalContent>
			</div>
		);
	}

	if (step === STEPS.PRICE) {
		bodyContent = (
			<div>
				<ModalContent>
					<ModalHeader className='flex flex-col gap-1'>Precios</ModalHeader>
					<ModalBody>
						<Input
							type='number'
							label='Price'
							placeholder='0.00'
							labelPlacement='outside'
							startContent={
								<div className='pointer-events-none flex items-center'>
									<span className='text-default-400 text-small'>$</span>
								</div>
							}
						/>
					</ModalBody>
					<ModalFooter>
						<Button color='danger' variant='flat' onPress={onBack}>
							{secondaryActionLabel}
						</Button>
						<Button color='primary' onPress={onNext}>
							{actionLabel}
						</Button>
					</ModalFooter>
				</ModalContent>
			</div>
		);
	}

	return (
		<>
			<Button onPress={onOpen} color='primary'>
				Publicar
			</Button>
			<Modal
				isOpen={productModal.isOpen}
				onOpenChange={onOpenChange}
				placement='top-center'>
				{bodyContent}
			</Modal>
		</>
	);
}
