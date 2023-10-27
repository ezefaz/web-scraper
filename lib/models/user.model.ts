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
  // products: {
  //   type: [String],
  // },
  // favoriteProducts: {
  //   type: [String],
  // },
  // subscription: {
  //   type: String,
  //   default: 'basic',
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
