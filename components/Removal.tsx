"use client";

import { Icon } from "@tremor/react";
import React from "react";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { deleteProduct } from "@/lib/actions";
import toast from "react-hot-toast";

const Removal = ({ product }: any) => {
	const handleDeleteProduct = async () => {
		try {
			await deleteProduct(product);

			toast.success("Producto eliminado correctamente.");
		} catch (error) {
			console.error("Error deleting product: ", error);
		}
	};

	const handleOnClick = () => {
		handleDeleteProduct();
	};

	return (
		<div>
			<Icon
				icon={IoMdRemoveCircleOutline}
				variant='solid'
				tooltip='Eliminar'
				onClick={handleOnClick}
			/>
		</div>
	);
};

export default Removal;
