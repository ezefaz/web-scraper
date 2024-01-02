"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import User from "@/lib/models/user.model";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const validatedFields = RegisterSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: "Campos incorrectos" };
	}

	const { email, name, password } = validatedFields.data;
	const hashedPassword = await bcrypt.hash(password, 10);

	const existingUser = await getUserByEmail(email);

	console.log("EXISTE", existingUser);

	if (existingUser) {
		return { error: "Correo en uso" };
	}

	try {
		const createdUser = await User.create({
			email: email,
			name: name,
			password: hashedPassword,
		});

		console.log("Created user", createdUser);

		const verificationToken = await generateVerificationToken(email);

		return { success: "Porfavor verifique su correo" };
	} catch (error) {
		console.error("Error creating user", error);
		return { error: "Error al crear usuario" };
	}
};
