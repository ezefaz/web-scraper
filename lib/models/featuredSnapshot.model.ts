import mongoose from "mongoose";
import { FEATURED_CATEGORY_IDS } from "@/lib/featured/engine";

const featuredProductItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    url: { type: String, required: true },
    image: { type: String, required: true },
    store: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number, required: true },
    discountRate: { type: Number, required: true },
    shipping: { type: String, required: true },
    currency: { type: String, required: true },
    updatedAt: { type: String, required: true },
    demandScore: { type: Number, required: true },
    variationScore: { type: Number, required: true },
    impulseScore: { type: Number, required: true },
    totalScore: { type: Number, required: true },
    qualityTier: {
      type: String,
      enum: ["strict", "high", "medium", "broad"],
      default: "strict",
    },
  },
  { _id: false },
);

const featuredSnapshotSchema = new mongoose.Schema(
  {
    scope: {
      type: String,
      required: true,
      unique: true,
      default: "homepage",
      index: true,
    },
    categories: {
      tech: {
        type: [featuredProductItemSchema],
        default: [],
      },
      gaming: {
        type: [featuredProductItemSchema],
        default: [],
      },
      sneakers: {
        type: [featuredProductItemSchema],
        default: [],
      },
      appliances: {
        type: [featuredProductItemSchema],
        default: [],
      },
    },
    generatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    totalOffers: {
      type: Number,
      default: 0,
    },
    sourceProducts: {
      type: Number,
      default: 0,
    },
    criteriaVersion: {
      type: String,
      default: "v1-weekly-scored",
    },
  },
  { timestamps: true },
);

featuredSnapshotSchema.pre("save", function preSave(next) {
  const categories = (this.get("categories") || {}) as Record<string, unknown[]>;
  const totalOffers = FEATURED_CATEGORY_IDS.reduce((sum, category) => {
    const list = Array.isArray(categories[category]) ? categories[category] : [];
    return sum + list.length;
  }, 0);
  this.set("totalOffers", totalOffers);
  next();
});

const FeaturedSnapshot =
  mongoose.models.FeaturedSnapshot ||
  mongoose.model("FeaturedSnapshot", featuredSnapshotSchema);

export default FeaturedSnapshot;
