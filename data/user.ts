import User from "@/lib/models/user.model";
import { connectToDb } from "@/lib/mongoose";

export const getUserByEmail = async (email: string) => {
	try {
		const user = await User.findOne({ email });

		console.log(user);
		return user;
	} catch {
		return null;
	}
};

export const getUserById = async (id: string) => {
	try {
		await connectToDb();
		const user = await User.findOne({ _id: id });

		return user;
	} catch {
		return null;
	}
};
