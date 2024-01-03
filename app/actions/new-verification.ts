'use server';

import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByToken } from '@/data/verification-token';
import User from '@/lib/models/user.model';
import VerificationToken from '@/lib/models/verificationToken.model';

export const newVerification = async (token: string) => {
  const existingToken: any = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: 'El token no existe.' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'El token ha expirado.' };
  }

  const existingUser: any = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: 'El correo no existe.' };
  }

  const updatedUser = await User.updateOne({
    where: { _id: existingUser._id },
    emailVerified: new Date(),
    email: existingToken.email,
  });
  console.log('updateado', updatedUser);

  await VerificationToken.deleteOne({ _id: existingToken._id });
};
