'use server';

import { getPasswordResetTokenByToken } from '@/data/password-reset-token';
import { getUserByEmail } from '@/data/user';
import { NewPasswordSchema } from '@/schemas';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import User from '@/lib/models/user.model';
import PasswordResetToken from '@/lib/models/PasswordResetToken.model';

export const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token: string | null) => {
  if (!token) {
    return { error: 'Falta el token!' };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Campo Inválido.' };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: 'Token Inválido.' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'El token expiró!' };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: 'El correo no existe.' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await User.updateOne({ _id: existingUser._id }, { $set: { password: hashedPassword } });

  await PasswordResetToken.deleteOne({ id: existingToken.id });

  return { success: 'Contraseña actualizada!' };
};
