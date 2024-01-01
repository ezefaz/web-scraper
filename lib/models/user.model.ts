import { UUID } from "mongodb";
import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema({
	id: { type: String, default: uuidv4() },
	name: {
		type: String,
	},
	email: {
		type: String,
		unique: true,
	},
	image: {
		type: String,
	},
	password: {
		type: String,
	},
	emailVerified: Date,
	role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
	isTwoFactorEnabled: { type: Boolean, default: false },
	twoFactorConfirmation: {
		type: Schema.Types.ObjectId,
		ref: "TwoFactorConfirmation",
	},
	products: [
		{
			url: { type: String, unique: true },
			currency: { type: String },
			image: { type: String },
			title: { type: String },
			currentPrice: { type: Number },
			originalPrice: { type: Number },
			currentDolar: {
				value: { type: Number },
				date: { type: Date, default: Date.now },
			},
			priceHistory: [
				{
					price: { type: Number },
					date: { type: Date, default: Date.now },
				},
			],
			dolarHistory: [
				{
					value: { type: Number },
					date: { type: Date, default: Date.now },
				},
			],
			lowestPrice: { type: Number },
			highestPrice: { type: Number },
			averagePrice: { type: Number },
			discountRate: { type: Number },
			description: { type: String },
			category: { type: String },
			reviewsCount: { type: Number },
			stockAvailable: { type: String },
			stars: { type: String },
			isOutOfStock: { type: Boolean, default: false },
		},
	],
	favoriteProducts: {
		type: [String],
	},
	subscription: {
		type: String,
		default: "basic",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const accountSchema = new Schema({
	id: { type: String, default: UUID },
	userId: { type: String, ref: "User" },
	type: String,
	provider: { type: String, unique: true },
	providerAccountId: { type: String, unique: true },
	refresh_token: { type: String, select: false },
	access_token: { type: String, select: false },
	expires_at: Number,
	token_type: String,
	scope: String,
	id_token: { type: String, select: false },
	session_state: String,
});

const tokenSchema = new Schema({
	id: { type: String, default: uuidv4() },
	email: String,
	token: { type: String, unique: true },
	expires: Date,
});

const twoFactorConfirmationSchema = new Schema({
	id: { type: String, default: uuidv4() },
	userId: { type: String, ref: "User" },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Account =
	mongoose.models.Account || mongoose.model("Account", accountSchema);
const VerificationToken =
	mongoose.models.VerificationToken ||
	mongoose.model("VerificationToken", tokenSchema);
const PasswordResetToken =
	mongoose.models.PasswordResetToken ||
	mongoose.model("PasswordResetToken", tokenSchema);
const TwoFactorToken =
	mongoose.models.TwoFactorToken ||
	mongoose.model("TwoFactorToken", tokenSchema);
const TwoFactorConfirmation =
	mongoose.models.TwoFactorConfirmation ||
	mongoose.model("TwoFactorConfirmation", twoFactorConfirmationSchema);

export default User;
