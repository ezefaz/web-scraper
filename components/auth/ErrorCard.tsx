"use client";

import Image from "next/image";
import CardWrapper from "../CardWrapper";

type Props = {};

const ErrorCard = (props: Props) => {
	return (
		<div className='flex justify-center items-center h-screen'>
			<CardWrapper
				HeaderLabel='Algo salio mal!'
				backButtonHref='/sign-in'
				backButtonLabel='Volver a iniciar sesion'>
				<div className='flex justify-center mb-6'>
					<Image
						src='/assets/icons/savemelin3.svg'
						width={120}
						height={100}
						alt='Logo'
					/>
				</div>
				{/* <div className='mt-4 flex justify-between items-center'>
					<span className='text-sm text-gray-700'>O inicia sesión con:</span>
					<div className='flex items-center space-x-3'>
						<Social />
					</div>
				</div> */}
			</CardWrapper>
		</div>
	);
};

export default ErrorCard;
