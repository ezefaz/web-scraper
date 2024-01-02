import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuidv4 } from "uuid";
import VerificationToken from "./models/verificationToken.model";

export const generateVerificationToken = async (email: string) => {
	const token = uuidv4;
	const expires = new Date(new Date().getTime() + 3600 + 1000);

	const existingToken = await getVerificationTokenByEmail(email);

	if (existingToken) {
		await VerificationToken.deleteOne({ id: existingToken.id });
	}

	const verificationToken = await VerificationToken.create({
		data: {
			email,
			token,
			expires,
		},
	});

	return verificationToken;
};
