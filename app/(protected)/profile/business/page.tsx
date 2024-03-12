"use client";

import { startTransition, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getMLUserCode } from "@/app/actions/mercadolibre/get-ml-user-code";
import { SellerProfile } from "@/types";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { IoCloudyNight } from "react-icons/io5";
import { IoMdCheckboxOutline } from "react-icons/io";

const steps = [
	{
		id: 1,
		type: "done",
		title: "Iniciar sesión con Mercadolibre",
		description: "Para comenzar, debes haberte logueado con tu cuenta.",
		href: "#",
	},
	{
		id: 2,
		type: "in progress",
		title: "Import data",
		description:
			"Connect your database to the new workspace by using one of 20+ database connectors.",
		href: "#",
	},
	{
		id: 3,
		type: "open",
		title: "Comienza a vender",
		description:
			"Una vez configurada tu cuenta ya puedes empezar a utilizar la plataforma.",
		href: "#",
	},
];

import FormError from "@/components/auth/FormError";
import FormSuccess from "@/components/auth/FormSuccess";
import { DotLoader } from "react-spinners";

type Props = {};

const BusinessProfilePage = (props: Props) => {
	// const [userData, setUserData] = useState<SellerProfile | null>(null);
	const [isCreated, setIsCreated] = useState<boolean>(false);
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();
	const searchParams = useSearchParams();

	const code = searchParams.get("code");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const sellerCreated = await getMLUserCode(code);

				console.log(sellerCreated);
				setIsCreated(true);
			} catch (error) {
				console.error("Error al crear la cuenta vendedor:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div>
			{isCreated ? (
				<div>
					<h1>Cuenta creada con éxito.</h1>
					<p>
						Porfavor termine de configurar su cuenta{" "}
						<a href='/business/settings'>aquí.</a>
					</p>

					<FormError message={error} />
					<FormSuccess message={success} />
				</div>
			) : (
				<div className='m-auto'>
					<p>Creando cuenta de negocio, porfavor aguarde un momento...</p>
					<DotLoader className='flex justify-center items-center p-2' />
				</div>
			)}
		</div>
	);
};

export default BusinessProfilePage;
