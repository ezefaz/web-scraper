"use client";

import * as z from "zod";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import CardWrapper from "../CardWrapper";
import FormError from "./FormError";
import FormSuccess from "./FormSuccess";
import axios from "axios";
import { useState, useTransition } from "react";
import { Button } from "@tremor/react";
import { login } from "@/app/actions/login";

type Props = {};

const LoginForm = (props: Props) => {
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			login(values).then((data) => {
				setError(data.error);
				setSuccess(data.success);
			});
		});
	};
	return (
		<div className='flex justify-center items-center h-screen'>
			<CardWrapper
				HeaderLabel='Bienvenido!'
				backButtonHref='/sign-up'
				backButtonLabel='No tienes una cuenta?'
				showSocial>
				<div className='flex justify-center mb-6'>
					<Image
						src='/assets/icons/savemelin3.svg'
						width={120}
						height={100}
						alt='Logo'
					/>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700'>
							Email
						</label>
						<input
							id='email'
							type='email'
							disabled={isPending}
							placeholder='john@doe.com'
							{...register("email")}
							className='mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50'
						/>
						{errors.email && (
							<span className='text-red-500'>{errors.email.message}</span>
						)}
					</div>
					<div>
						<label
							htmlFor='password'
							placeholder='*******'
							className='block text-sm font-medium text-gray-700'>
							Contraseña
						</label>
						<input
							id='password'
							type='password'
							disabled={isPending}
							{...register("password")}
							className='mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50'
						/>
						{errors.password && (
							<span className='text-red-500'>{errors.password.message}</span>
						)}
					</div>
					<FormError message={error} />
					<FormSuccess message={success} />
					<div>
						<Button
							type='submit'
							size='md'
							disabled={isPending}
							className='w-full bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded-md transition duration-300'>
							Iniciar Sesión
						</Button>
					</div>
				</form>
				<div className='mt-4 flex justify-between items-center'>
					<span className='text-sm text-gray-700'>O inicia sesión con:</span>
					<div className='flex items-center space-x-3'>
						<button className='rounded-full bg-red-600 text-white p-2 hover:bg-red-700'>
							<FaGoogle size={20} />
						</button>
						<button className='rounded-full bg-black text-white p-2 hover:bg-gray-800'>
							<FaGithub size={20} />
						</button>
					</div>
				</div>
			</CardWrapper>
		</div>
	);
};

export default LoginForm;
