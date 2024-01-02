import VerificationToken from "@/lib/models/verificationToken.model";

export const getVerificationTokenByToken = async (token: string) => {
	try {
		const verificationToken = await VerificationToken.find({ token });

		return verificationToken;
	} catch (error) {
		return null;
	}
};

export const getVerificationTokenByEmail = async (email: string) => {
	try {
		const verificationToken = await VerificationToken.findOne({ email });

		return verificationToken;
	} catch (error) {
		return null;
	}
};
