import mongoose, { Schema, Document } from 'mongoose';
import mongooseFieldEncryption from 'mongoose-field-encryption';

export interface IUser extends Document {
  email: string;
  name: string;
  role: 'manager' | 'personnel';
  passwordHash?: string;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['manager', 'personnel'], required: true },
    passwordHash: { type: String }, // null for manager initially
  },
  { timestamps: true }
);

// KVKK Encryption: Encrypt the user's personal name
UserSchema.plugin(mongooseFieldEncryption.fieldEncryption, {
  fields: ['name'],
  secret: process.env.ENCRYPTION_KEY || 'default_secret_key_please_change_in_production_to_64_chars_length',
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
