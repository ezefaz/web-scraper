import React from "react";
import { ProductType } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { formatNumber, formatNumberWithCommas } from "@/lib/utils";

interface Props {
	product: ProductType;
}

const ProductCard = ({ product }: Props) => {
	return (
		<>
			<Link href={`/products/${product._id}`} className='product-card '>
				<div className='product-card  shadow-lg rounded-lg p-6 transition duration-300 ease-in-out transform hover:scale-105'>
					<div className='product-card_img-container mb-4'>
						<Image
							src={product.image}
							alt={product.title}
							width={200}
							height={200}
							className='product-card_img'
						/>
					</div>

					<div className='flex flex-col gap-3'>
						<h3 className='product-title'>{product.title}</h3>
						<div className='flex justify-between items-center'>
							<p className='text-gray-500 text-lg capitalize'>
								{product.category}
							</p>
							<p className='text-black text-lg font-semibold'>
								{/* <span>{product?.currency}</span> */}
								<span>{`${product.currency} ${formatNumber(
									product.currentPrice
								)}`}</span>
							</p>
						</div>
					</div>
				</div>
			</Link>
		</>
	);
};

export default ProductCard;
