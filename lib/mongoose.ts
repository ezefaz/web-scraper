import mongoose from "mongoose";

let isConnected = false;

export const connectToDb = async () => {
	mongoose.set("strictQuery", true);

	if (!process.env.MONGODB_URI) {
		throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
	}

	if (isConnected) return console.log("--> Using existing database connection");

	try {
		await mongoose.connect(process.env.MONGODB_URI);

		isConnected = true;

		console.log("Database Connected!");
	} catch (error) {
		console.log(error);
	}
};
