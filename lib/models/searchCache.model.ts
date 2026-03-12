import mongoose, { Schema } from 'mongoose';

const searchCacheSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    namespace: { type: String, required: true, index: true },
    value: { type: Schema.Types.Mixed, default: null },
    expiresAt: { type: Date, required: true, index: true },
    lockedUntil: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

searchCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const SearchCache =
  mongoose.models.SearchCache || mongoose.model('SearchCache', searchCacheSchema);

export default SearchCache;
