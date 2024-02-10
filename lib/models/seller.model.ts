import mongoose, { Schema } from "mongoose";

const sellerSchema = new mongoose.Schema({
	userId: {
		type: String,
	},
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	nickname: {
		type: String,
	},
	email: {
		type: String,
	},
	registration_date: {
		type: Date,
	},
	logo: {
		type: String,
	},

	country_id: {
		type: String,
	},
	identification: {},
	role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
	gender: { type: String },
	twoFactorConfirmation: {
		type: Schema.Types.ObjectId,
		ref: "TwoFactorConfirmation",
	},
	country: {
		type: String,
		enum: ["argentina", "brasil", "colombia", "uruguay"],
		default: "argentina",
	},
	products: [
		{
			url: { type: String },
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
			isFreeShipping: {
				type: Boolean,
			},
			isFollowing: {
				type: Boolean,
			},
			isFreeReturning: {
				type: Boolean,
			},
			status: { type: String },
		},
	],
	subscription: {
		type: String,
		default: "basic",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.models?.Seller ||
	mongoose.model("Seller", sellerSchema);
