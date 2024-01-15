'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { RegisterSchema } from '@/schemas';
import User from '@/lib/models/user.model';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';
import { connectToDb } from '@/lib/mongoose';
import mongoose from 'mongoose';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Campos incorrectos' };
  }

  const { email, name, password, country } = validatedFields.data;

  console.log(country);

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Correo en uso' };
  }

  try {
    await User.collection.dropIndexes();
  } catch (error) {
    console.error('Error dropping indexes:', error);
  }

  try {
    await User.create({
      name,
      email,
      password: hashedPassword,
      country,
    });
  } catch (error) {
    console.error('Error inserting user:', error);
    return { error: 'Error durante el registro' };
  }

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: 'Correo de confirmación enviado!' };
};
