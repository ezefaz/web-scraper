"use client";
import { Textarea } from "@nextui-org/react";

export default function DescriptionInput() {
	return (
		<div className='w-full grid mt-3 grid-cols-4 gap-4'>
			<Textarea
				variant='underlined'
				label='Descripción'
				labelPlacement='outside'
				placeholder='Ingrese la descripción de su producto.'
				className='col-span-12 md:col-span-6 mb-6 md:mb-0'
			/>
		</div>
	);
}
