"use client";

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
import Search from "./Search";
import { ProductType } from "@/types";
import { formatNumber } from "@/lib/utils";

interface UserProduct {
	id: string;
	title: string;
	currentPrice: number;
	currentDolarValue: number;
	currency: string;
	stock: string;
	isFollowing: boolean;
	category: string;
}

interface ProductTableProps {
	user: string;
	userProducts: Array<UserProduct>;
}

const limitWords = (title: string, limit: number) => {
	const words = title.split(" ");
	if (words.length > limit) {
		return words.slice(0, limit).join(" ") + "...";
	}
	return title;
};

const ProductsTable = ({ user, userProducts }: ProductTableProps) => {
	return (
		<div className='flex w-full justify-start items-center p-20 mt-20'>
			<Card className='w-full max-w-4xl p-10'>
				<Title className='mb-4'>Listado de Productos del Usuario {user}</Title>
				<div className='flex justify-end'>
					<Search />
				</div>
				<Table className='w-full'>
					<TableHead>
						<TableRow>
							<TableHeaderCell />
							<TableHeaderCell>Título</TableHeaderCell>
							<TableHeaderCell>Categoría</TableHeaderCell>
							<TableHeaderCell>Stock</TableHeaderCell>
							<TableHeaderCell>Precio ($)</TableHeaderCell>
							<TableHeaderCell>Precio (USD)</TableHeaderCell>
							<TableHeaderCell>Seguimiento</TableHeaderCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{userProducts?.map((product: UserProduct) => (
							<TableRow
								key={product.id}
								className='hover:bg-gray-50 cursor-pointer'>
								<TableCell>
									{/* <Removal product={product._id?.toString()} /> */}
								</TableCell>
								<TableCell>
									<a
										className='text-blue-500 hover:underline'
										href={`/products/${product.id}`}
										target='_blank'
										rel='noopener noreferrer'>
										{limitWords(product.title, 6)}
									</a>
								</TableCell>
								<TableCell>{product.category}</TableCell>
								<TableCell>
									<Text>
										{product.stock == "1"
											? `${product.stock} disponible`
											: product.stock}
									</Text>
								</TableCell>
								<TableCell>
									<Text>{`${product.currency} ${formatNumber(
										product.currentPrice
									)}`}</Text>
								</TableCell>
								<TableCell>
									<Text>{`${product.currency} ${formatNumber(
										product.currentDolarValue
									)}`}</Text>
								</TableCell>
								<TableCell>
									<Text>
										{product.isFollowing ? "Siguiendo" : "Sin Seguimiento"}
									</Text>
								</TableCell>
								<TableCell>
									{/* <Badge color='emerald' icon={StatusOnlineIcon}>
{product.status}
</Badge> */}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
};

export default ProductsTable;
