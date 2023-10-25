import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true,
  },
  token: {
    type: String, // Token for authentication/authorization
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  products: {
    type: [String], // Array of product names or IDs
  },
  favoriteProducts: {
    type: [String], // Array of favorite product names or IDs
  },
  subscription: {
    type: String, // You can define the type based on your plan structure
    default: 'basic', // Set a default value if needed
  },
  // Add more fields as needed
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
