import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // token: {
  //   type: String,
  // },
  name: {
    type: String,
    required: true,
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
      url: { type: String, required: true, unique: true },
      currency: { type: String, required: true },
      image: { type: String, required: true },
      title: { type: String, required: true },
      currentPrice: { type: Number, required: true },
      originalPrice: { type: Number, required: true },
      currentDolar: {
        value: { type: Number },
        date: { type: Date, default: Date.now },
      },
      priceHistory: [
        {
          price: { type: Number, required: true },
          date: { type: Date, default: Date.now },
        },
      ],
      dolarHistory: [
        {
          value: { type: Number, required: true },
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
    default: 'basic',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
