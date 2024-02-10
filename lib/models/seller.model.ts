import mongoose from "mongoose";

const identificationSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  number: {
    type: String,
  },
});

const addressSchema = new mongoose.Schema({
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
});

const phoneSchema = new mongoose.Schema({
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
});

const alternativePhoneSchema = new mongoose.Schema({
  area_code: {
    type: String,
  },
  number: {
    type: String,
  },
  extension: {
    type: String,
  },
});

const transactionsSchema = new mongoose.Schema({
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
});

const reputationSchema = new mongoose.Schema({
  level_id: {
    type: String,
  },
  power_seller_status: {
    type: String,
  },
  transactions: transactionsSchema,
});

const statusSchema = new mongoose.Schema({
  site_status: {
    type: String,
  },
  list: {
    allow: {
      type: Boolean,
    },
    codes: [String],
    immediate_payment: {
      required: {
        type: Boolean,
      },
      reasons: [String],
    },
  },
  buy: {
    allow: {
      type: Boolean,
    },
    codes: [String],
    immediate_payment: {
      required: {
        type: Boolean,
      },
      reasons: [String],
    },
  },
  sell: {
    allow: {
      type: Boolean,
    },
    codes: [String],
    immediate_payment: {
      required: {
        type: Boolean,
      },
      reasons: [String],
    },
  },
  billing: {
    allow: {
      type: Boolean,
    },
    codes: [String],
  },
  mercadopago_tc_accepted: {
    type: Boolean,
  },
  mercadoenvios: {
    type: String,
  },
  immediate_payment: {
    type: Boolean,
  },
  confirmed_email: {
    type: Boolean,
  },
  user_type: {
    type: String,
  },
  required_action: {
    type: String,
  },
});

const creditSchema = new mongoose.Schema({
  consumed: {
    type: Number,
  },
  credit_level_id: {
    type: String,
  },
});

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
  alternative_phone: alternativePhoneSchema,
  user_type: {
    type: String,
  },
  tags: [String],
  logo: {
    type: String,
  },
  points: {
    type: Number,
  },
  site_id: {
    type: String,
  },
  permalink: {
    type: String,
  },
  seller_experience: {
    type: String,
  },
  seller_reputation: reputationSchema,
  buyer_reputation: {
    canceled_transactions: {
      type: Number,
    },
    transactions: transactionsSchema,
    tags: [String],
  },
  status: statusSchema,
  credit: creditSchema,
});

export default mongoose.models?.Seller ||
  mongoose.model("Seller", sellerSchema);
