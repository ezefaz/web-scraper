import { getVerificationTokenByEmail } from '@/data/verification-token';
import { v4 as uuidv4 } from 'uuid';
import VerificationToken from './models/verificationToken.model';
import { connectToDb } from './mongoose';
import mongoose from 'mongoose';

export const generateVerificationToken = async (email: string) => {
  try {
    const token = uuidv4();
    const expires = new Date(Date.now() + 3600 * 1000);

    const existingToken = await VerificationToken.findOne({ email });

    if (existingToken) {
      await VerificationToken.deleteOne({ _id: existingToken._id });
    }

    const newVerificationToken = await VerificationToken.create({
      email,
      token,
      expires,
    });

    return newVerificationToken;
  } catch (error) {
    console.error('Error generating verification token:', error);
    throw new Error('Failed to generate verification token');
  }
};
