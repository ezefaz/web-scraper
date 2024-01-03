import VerificationToken from '@/lib/models/verificationToken.model';

export const getVerificationTokenByToken = async (token: string) => {
  try {
    console.log('randal', token);
    const verificationToken = await VerificationToken.findOne({ token: token });
    console.log('randal', verificationToken);

    return verificationToken;
  } catch (error) {
    return null;
  }
};
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await VerificationToken.findOne({ email });

    return verificationToken;
  } catch {
    return null;
  }
};
