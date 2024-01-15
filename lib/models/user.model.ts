import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  image: {
    type: String,
  },
  password: {
    type: String,
  },
  emailVerified: {
    type: Date,
  },
  role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' },
  isTwoFactorEnabled: { type: Boolean, default: false },
  twoFactorConfirmation: {
    type: Schema.Types.ObjectId,
    ref: 'TwoFactorConfirmation',
  },
  country: {
    type: String,
    enum: ['argentina', 'brasil', 'colombia', 'uruguay', 'venezuela'],
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
      status: { type: String, enum: ['Nuevo', 'Usado', 'Reacondicionado'] },
    },
  ],
  subscription: {
    type: String,
    default: 'basic',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models?.User || mongoose.model('User', userSchema);
