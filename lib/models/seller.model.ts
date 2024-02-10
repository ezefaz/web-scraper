import mongoose from "mongoose";

const identificationSchema = new mongoose.Schema(
	{
		type: {
			type: String,
		},
		number: {
			type: String,
		},
	},
	{ _id: false }
);

const addressSchema = new mongoose.Schema(
	{
		state: {
			type: String,
		},
		city: {
			type: String,
		},
		address: {
			type: String,
		},
		zip_code: {
			type: String,
		},
	},
	{ _id: false }
);

const phoneSchema = new mongoose.Schema(
	{
		area_code: {
			type: String,
		},
		number: {
			type: String,
		},
		extension: {
			type: String,
		},
		verified: {
			type: Boolean,
		},
	},
	{ _id: false }
);

const transactionsSchema = new mongoose.Schema(
	{
		period: {
			type: String,
		},
		total: {
			type: Number,
		},
		completed: {
			type: Number,
		},
		canceled: {
			type: Number,
		},
		ratings: {
			positive: {
				type: Number,
			},
			negative: {
				type: Number,
			},
			neutral: {
				type: Number,
			},
		},
	},
	{ _id: false }
);

const reputationSchema = new mongoose.Schema(
	{
		level_id: {
			type: String,
		},
		power_seller_status: {
			type: String,
		},
		transactions: transactionsSchema,
	},
	{ _id: false }
);

const sellerSchema = new mongoose.Schema({
	id: {
		type: Number,
	},
	nickname: {
		type: String,
	},
	registration_date: {
		type: Date,
	},
	first_name: {
		type: String,
	},
	last_name: {
		type: String,
	},
	country_id: {
		type: String,
	},
	email: {
		type: String,
	},
	identification: identificationSchema,
	address: addressSchema,
	phone: phoneSchema,
	user_type: {
		type: String,
	},
	tags: [String],
	logo: {
		type: String,
	},
	// points: {
	// 	type: Number,
	// },
	// site_id: {
	// 	type: String,
	// },
	// permalink: {
	// 	type: String,
	// },
	seller_experience: {
		type: String,
	},
	seller_reputation: reputationSchema,
	// buyer_reputation: {
	// 	canceled_transactions: {
	// 		type: Number,
	// 	},
	// 	transactions: transactionsSchema,
	// 	tags: [String],
	// },
	// company: {
	// 	brand_name: {
	// 		type: String,
	// 	},
	// 	city_tax_id: {
	// 		type: String,
	// 	},
	// 	corporate_name: {
	// 		type: String,
	// 	},
	// 	identification: {
	// 		type: String,
	// 	},
	// 	state_tax_id: {
	// 		type: String,
	// 	},
	// 	cust_type_id: {
	// 		type: String,
	// 	},
	// 	soft_descriptor: {
	// 		type: String,
	// 	},
	// },
});

export default mongoose.models?.Seller ||
	mongoose.model("Seller", sellerSchema);
