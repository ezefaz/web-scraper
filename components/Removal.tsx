"use client";

import { Icon } from "@tremor/react";
import React from "react";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { deleteProduct } from "@/lib/actions";
import toast from "react-hot-toast";

interface RemovalProps {
	productId: string;
}

const Removal = ({ productId }: RemovalProps) => {
	const handleDeleteProduct = async () => {
		try {
			const deletedProductId = await deleteProduct(productId);

			if (deletedProductId) {
				toast.success("Producto eliminado correctamente.");
			} else {
				console.error("Product ID not returned after deletion.");
			}
		} catch (error) {
			console.error("Error deleting product: ", error);
		}
	};

	return (
		<div>
			<Icon
				icon={IoMdRemoveCircleOutline}
				variant='solid'
				tooltip='Eliminar'
				onClick={() => handleDeleteProduct()}
			/>
		</div>
	);
};

export default Removal;
