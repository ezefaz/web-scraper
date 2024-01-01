"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import User from "@/lib/models/user.model";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const validatedFields = RegisterSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: "Campos incorrectos" };
	}

	const { email, name, password } = validatedFields.data;
	const hashedPassword = await bcrypt.hash(password, 10);

	const existingUser = await getUserByEmail(email);

	if (existingUser) {
		return { error: "Correo en uso" };
	}

	await User.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
	});

	// TODO: ENVIAR TOKEN DE VERIFICACION AL EMAIL.

	return { success: "Usuario Creado!" };
};
