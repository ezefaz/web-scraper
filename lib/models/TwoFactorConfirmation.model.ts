import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const twoFactorConfirmationSchema = new Schema({
	id: { type: String, default: uuidv4() },
	userId: { type: String, ref: "User" },
});

const TwoFactorConfirmation =
	mongoose.models.TwoFactorConfirmation ||
	mongoose.model("TwoFactorConfirmation", twoFactorConfirmationSchema);

export default TwoFactorConfirmation;
