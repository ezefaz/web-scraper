'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { RegisterSchema } from '@/schemas';
import User from '@/lib/models/user.model';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Campos incorrectos' };
  }

  const { email, name, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Correo en uso' };
  }

  await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: 'Correo de confirmación enviado!' };
};
