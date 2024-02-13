"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { update } from "@/auth";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { connectToDb } from "@/lib/mongoose";
import { getCurrentUser } from "@/lib/actions";
import userModel from "@/lib/models/user.model";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
	const user = await getCurrentUser();

	if (!user) {
		return { error: "No Autorizado" };
	}

	const dbUser = await getUserById(user.id);

	if (!dbUser) {
		return { error: "No Autorizado" };
	}

	if (values.email && values.email !== user.email) {
		const existingUser = await getUserByEmail(values.email);

		if (existingUser && existingUser.id !== user.id) {
			return { error: "El correo ya esta en uso!" };
		}

		const verificationToken = await generateVerificationToken(values.email);
		await sendVerificationEmail(
			verificationToken.email,
			verificationToken.token
		);

		return { success: "El correo de verificación fue enviado!" };
	}

	if (values.password && values.newPassword && dbUser.password) {
		const passwordsMatch = await bcrypt.compare(
			values.password,
			dbUser.password
		);

		if (!passwordsMatch) {
			return { error: "Contraseña incorrecta!" };
		}

		const hashedPassword = await bcrypt.hash(values.newPassword, 10);
		values.password = hashedPassword;
		values.newPassword = undefined;
	}

	const updatedUser: any = await userModel.updateOne(
		{ _id: dbUser._id },
		{
			$set: {
				...values,
			},
		}
	);

	update({
		user: {
			name: updatedUser.name,
			email: updatedUser.email,
		},
	});

	return { success: "El perfil fue actualizado!" };
};
