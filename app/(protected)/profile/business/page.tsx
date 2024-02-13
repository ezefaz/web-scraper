"use client";

import { startTransition, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getMLUserCode } from "@/app/actions/get-ml-user-code";
import { SellerProfile } from "@/types";

import { useSession } from "next-auth/react";
import FormError from "@/components/auth/FormError";
import FormSuccess from "@/components/auth/FormSuccess";
import { DotLoader } from "react-spinners";

type Props = {};

const BusinessProfilePage = (props: Props) => {
	const [userData, setUserData] = useState<SellerProfile | null>(null);
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();
	const searchParams = useSearchParams();

	const code = searchParams.get("code");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const sellerCreated = await getMLUserCode(code);

				console.log(sellerCreated);

				// const data: SellerProfile = await response.data;
			} catch (error) {
				console.error("Error al crear la cuenta vendedor:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div>
			{userData ? (
				<div>
					<h1>Cuenta creada con éxito.</h1>
					<p>
						Porfavor termine de configurar su cuenta <span>aquí.</span>
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
