import React, { useState } from "react";
import {
	Badge,
	BadgeDelta,
	Card,
	Icon,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableRow,
	Text,
	Title,
} from "@tremor/react";

import { formatNumber } from "@/lib/utils";
import { HiClipboard, HiClipboardCheck } from "react-icons/hi";
import Image from "next/image";

interface Product {
	url: string;
	title: string;
	price: string;
	image: string;
}

interface Props {
	scrapedData: Product[];
	productPrice: number;
}

const PriceComparisson = ({ scrapedData, productPrice }: Props) => {
	const [copySuccess, setCopySuccess] = useState(false);

	const copyToClipboard = (url: string) => {
		navigator.clipboard.writeText(url);
		setCopySuccess(true);
		setTimeout(() => setCopySuccess(false), 2000);
	};

	return (
		<div className='w-full'>
			<Card>
				<Title>Comparación de precios para el producto</Title>
				<Table className='mt-5'>
					<TableHead>
						<TableRow>
							<TableHeaderCell>Imagen</TableHeaderCell>
							<TableHeaderCell>Titulo</TableHeaderCell>
							<TableHeaderCell>Precio ($)</TableHeaderCell>
							<TableHeaderCell>Porcentaje</TableHeaderCell>
							<TableHeaderCell>Acciones</TableHeaderCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{scrapedData.map((item, index) => {
							const itemPrice = Number(item.price);
							const priceDifference =
								((productPrice - itemPrice) / itemPrice) * 100;
							const deltaType =
								productPrice === itemPrice
									? "unchanged"
									: productPrice > itemPrice
									? "moderateIncrease"
									: "moderateDecrease";

							return (
								<TableRow key={index}>
									<TableCell>
										<Image
											src={item.image}
											alt={item.title}
											width={50}
											height={50}
										/>
									</TableCell>
									<TableCell>{item.title}</TableCell>
									<TableCell>${formatNumber(itemPrice)}</TableCell>
									<TableCell>
										<BadgeDelta
											deltaType={deltaType}
											isIncreasePositive={true}
											size='xs'
											className='text-sm'>
											{`${priceDifference.toFixed(1)}%`}
										</BadgeDelta>
									</TableCell>
									<TableCell>
										<div className='flex gap-2'>
											<button
												className='text-sm text-primary hover:underline focus:outline-none'
												onClick={() => window.open(item.url, "_blank")}
												aria-label={`Visitar ${item.title}`}>
												Visitar
											</button>
											<div
												className='cursor-pointer text-gray-500 hover:text-blue-500'
												onClick={() => copyToClipboard(item.url)}>
												{!copySuccess ? (
													<Icon
														icon={HiClipboard}
														variant='solid'
														size='sm'
														tooltip='Copiar link'
													/>
												) : (
													<Icon
														icon={HiClipboardCheck}
														variant='solid'
														size='sm'
														tooltip='Copiado!'
													/>
												)}
											</div>
										</div>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
};

export default PriceComparisson;
