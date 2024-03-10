"use client";

import { getMLCategories } from "@/app/actions/mercadolibre/category/get-ml-categories";
import { Select, SelectItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

type CategoryInputProps = {
	label: string;
	selected?: boolean;
	onClick: (value: string) => void;
};

const CategoryInput: React.FC<CategoryInputProps> = ({
	label,
	selected,
	onClick,
}) => {
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedCategories = await getMLCategories("MLA");

				if (!fetchedCategories.error) {
					// If categories are successfully obtained
					setCategories(
						fetchedCategories.map((category: any) => ({
							id: category.id,
							name: category.name,
						}))
					);
				} else {
					console.error(fetchedCategories.error);
				}
			} catch (error) {
				console.error("Error obtaining ML categories:", error);
			}
		};

		fetchData();
	}, [getMLCategories]);

	return (
		<div>
			<Select
				variant='underlined'
				label='Categoría'
				placeholder='Seleccione una categoría'
				className='max-w-xs'>
				{categories &&
					categories.map((category: any) => (
						<SelectItem key={category.id} value={category.name}>
							{category.name}
						</SelectItem>
					))}
			</Select>
		</div>
	);
};

export default CategoryInput;
