"use client";

import { useEffect, useState } from "react";
import {
	Card,
	Table,
	TableRow,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableBody,
	BadgeDelta,
	MultiSelect,
	MultiSelectItem,
	Title,
} from "@tremor/react";
import { ProductType, UserType } from "@/types";
import { formatNumber } from "@/lib/utils";

interface UserTableProps {
	data: Array<any>;
	user: string;
}

// const limitWords = (title: string, limit: number) => {
// 	const words = title.split(" ");
// 	if (words.length > limit) {
// 		return words.slice(0, limit).join(" ") + "...";
// 	}
// 	return title;
// };

export default function UserTable({ data, user }: UserTableProps) {
	const [selectedNames, setSelectedNames] = useState([]);
	const [searchedData, setSearchedData] = useState<any[]>(data);

	useEffect(() => {
		const initialProductNames: any = data.map((product) => product.productName);
		setSelectedNames(initialProductNames);

		// setSearchedData(filtered);
	}, [selectedNames, data]);

	const isProductSelected = (product: ProductType | any) =>
		selectedNames.includes(product.title.toLowerCase()) ||
		selectedNames.length === 0;

	const mobileResponsiveTable = "overflow-x-auto w-full";
	const linkStyle = "text-blue-500 hover:underline";

	return (
		<>
			<div className='mt-auto p-12 flex justify-center sm:mt-16 px-4 sm:px-6 lg:px-8'>
				<Card className='w-full'>
					<Title className='mb-4'>
						Listado de Productos del usuario {user ? user : ""}
					</Title>
					<MultiSelect
						onValueChange={setSearchedData}
						placeholder='Buscar Producto...'
						className='max-w-xs'>
						{searchedData.length > 0 ? (
							searchedData.map((product) => (
								<MultiSelectItem key={product.id} value={product.title}>
									{product.title}{" "}
								</MultiSelectItem>
							))
						) : (
							<MultiSelectItem value='No Items Found'>
								No items found
							</MultiSelectItem>
						)}
					</MultiSelect>
					<div className='overflow-x-auto'>
						<Table className={`mt-6 ${mobileResponsiveTable}`}>
							<TableHead>
								<TableRow>
									<TableHeaderCell>Producto</TableHeaderCell>
									<TableHeaderCell className='text-right'>
										Categoría
									</TableHeaderCell>
									<TableHeaderCell className='text-right'>
										Cantidad
									</TableHeaderCell>
									<TableHeaderCell className='text-right'>
										Precio ($)
									</TableHeaderCell>
									<TableHeaderCell className='text-right'>
										Precio (USD)
									</TableHeaderCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{searchedData.map((product) => (
									<TableRow key={product.id}>
										<TableCell>
											<a
												className={linkStyle}
												href={`/products/${product.id}`}
												target='_blank'
												rel='noopener noreferrer'>
												{product.title}
											</a>
										</TableCell>
										<TableCell className='text-right'>
											{product.stock}
										</TableCell>
										<TableCell className='text-right'>
											{`${product.currency} ${formatNumber(
												product.currentPrice
											)}`}
										</TableCell>
										<TableCell className='text-right'>
											{`${product.currency} ${formatNumber(
												product.currentDolarValue
											)}`}
										</TableCell>
										<TableCell className='text-right'>
											{product.variance}
										</TableCell>
										{/* Additional table cells */}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</Card>
			</div>
		</>
	);
}
