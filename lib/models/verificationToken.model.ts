import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const tokenSchema = new Schema({
  id: { type: String, default: uuidv4() },
  email: String,
  token: { type: String, unique: true },
  expires: Date,
});

const VerificationToken = mongoose.models.VerificationToken || mongoose.model('VerificationToken', tokenSchema);

export default VerificationToken;
