'use server';

import * as z from 'zod';
import { LoginSchema } from '@/schemas';

import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { generateVerificationToken } from '@/lib/tokens';
import { getUserByEmail } from '@/data/user';
import { sendVerificationEmail } from '@/lib/mail';
import { AuthError } from 'next-auth';

export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error('Validation error:', validatedFields.error);
    return { error: 'Campos incorrectos' };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    console.error('User not found or incomplete data:', existingUser);

    return { error: 'El usuario no existe!' };
  }

  if (!existingUser.emailVerified) {
    console.log('Email not verified. Sending verification...');
    const verificationToken = await generateVerificationToken(existingUser.email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: 'Verifica tu correo!' };
  }

  try {
    console.log('Signing in...');
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Credenciales Invalidas' };
        default:
          return { error: 'Algo salio mal..' };
      }
    }

    throw error;
  }
};
