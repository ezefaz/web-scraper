import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
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
    isOutOfStock: { type: Boolean },
    isFreeReturning: {
      type: Boolean,
    },
    isFreeShipping: {
      type: Boolean,
    },
    status: { type: String, enum: ['Nuevo', 'Usado', 'Reacondicionado'] },
    storeName: { type: String },
    users: [
      {
        name: {
          type: String,
          // required: true,
        },
        email: {
          type: String,
        },
        image: {
          type: String,
        },
        isFollowing: {
          type: Boolean,
          default: false,
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
        subscription: {
          type: String,
          default: 'basic',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
