import User from "@/lib/models/user.model";
import { connectToDb } from "@/lib/mongoose";

export const getUserByEmail = async (email: string) => {
	try {
		await connectToDb();

		const user = await User.findOne({ email: email });

		return user;
	} catch {
		return null;
	}
};

export const getUserById = async (id: string) => {
	try {
		await connectToDb();
		const user = await User.findOne({ id: id });

		return user;
	} catch {
		return null;
	}
};
