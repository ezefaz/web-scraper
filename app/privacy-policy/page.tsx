"use client";

import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { privacyPolicyData } from "@/data/privacy";

export default function PrivacyPolicyPage() {
	return (
		<div className='mt-40 p-4 sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto'>
			<h1 className='text-3xl font-bold mb-4'>POLITICA DE PRIVACIDAD</h1>
			<h2 className='text-lg mb-6'>
				Bienvenido a SAVEMELIN, la aplicación que te ayuda a ahorrar mientras
				disfrutas de tus compras online. La privacidad y la seguridad de tus
				datos son de suma importancia para nosotros. Por favor, tómate un
				momento para revisar nuestra política de privacidad.
			</h2>

			<Accordion variant='splitted'>
				{privacyPolicyData.map(({ key, ariaLabel, title, content }) => (
					<AccordionItem key={key} aria-label={ariaLabel} title={title}>
						{content}
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}
