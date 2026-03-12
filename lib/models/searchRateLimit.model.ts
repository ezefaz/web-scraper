import mongoose, { Schema } from 'mongoose';

const searchRateLimitSchema = new Schema(
  {
    identifier: { type: String, required: true, index: true },
    scope: { type: String, required: true, index: true },
    windowStart: { type: Date, required: true, index: true },
    count: { type: Number, required: true, default: 1 },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

searchRateLimitSchema.index(
  { identifier: 1, scope: 1, windowStart: 1 },
  { unique: true },
);
searchRateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const SearchRateLimit =
  mongoose.models.SearchRateLimit || mongoose.model('SearchRateLimit', searchRateLimitSchema);

export default SearchRateLimit;
