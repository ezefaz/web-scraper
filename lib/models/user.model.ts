import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	// hashedPassword: {
	//   type: String,
	// },
	image: {
		type: String,
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
	// favoriteProducts: {
	//   type: [String],
	// },
	subscription: {
		type: String,
		default: "basic",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
