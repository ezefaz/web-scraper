import React, { useState } from "react";
import { getCurrentUser, getUserProducts } from "@/lib/actions";
import {
	Badge,
	Card,
	Icon,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableRow,
	Text,
	TextInput,
	Title,
} from "@tremor/react";
import { formatNumber } from "@/lib/utils";
import { ProductType } from "@/types";
import Removal from "@/components/Removal";
import Search from "@/components/Search";
import { currentUser } from "@clerk/nextjs";
import ProductsTable from "@/components/ProductsTable";

const page = async () => {
	const userProducts = await getUserProducts();
	const user = await currentUser();

	const extractedData: any = userProducts?.map((product: any) => ({
		id: product._id,
		title: product.title,
		currentPrice: product.currentPrice,
		currentDolarValue: product.currentDolar.value || product.currentDolarValue,
		currency: product.currency,
		stock: product.stockAvailable,
		isFollowing: product.users.some((user: any) => user.isFollowing === true),
		category: product.category || "",
	}));

	return (
		<>
			{!user ? (
				<div className='flex justify-center items-center p-20 mt-20'>
					<Card>
						<Title>Porfavor inicie sesion para ingresar a esta página</Title>
					</Card>
				</div>
			) : !userProducts || userProducts.length === 0 ? (
				<div className='flex justify-center items-center p-20 mt-20'>
					<Card>
						<Title>No hay ningún producto</Title>
					</Card>
				</div>
			) : (
				<>
					<ProductsTable
						user={`${user.firstName} ${user.lastName}`}
						userProducts={extractedData}
					/>
				</>
			)}
		</>
	);
};

export default page;
