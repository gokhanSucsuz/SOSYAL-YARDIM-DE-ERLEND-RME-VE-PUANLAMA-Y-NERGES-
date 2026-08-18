import mongoose, { Schema, Document } from 'mongoose';
import mongooseFieldEncryption from 'mongoose-field-encryption';

export interface IUser extends Document {
  email: string;
  name: string;
  role: 'superadmin' | 'manager' | 'personnel';
  passwordHash?: string;
  twoFactorSecret?: string;
  isTwoFactorEnabled: boolean;
  forcePasswordReset?: boolean;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'manager', 'personnel'], required: true },
    passwordHash: { type: String }, // null for manager initially
    twoFactorSecret: { type: String },
    isTwoFactorEnabled: { type: Boolean, default: false },
    forcePasswordReset: { type: Boolean, default: false },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
  },
  { timestamps: true }
);

// KVKK Encryption: Encrypt the user's personal name and 2FA secret
UserSchema.plugin(mongooseFieldEncryption.fieldEncryption, {
  fields: ['name', 'twoFactorSecret'],
  secret: process.env.ENCRYPTION_KEY || 'default_secret_key_please_change_in_production_to_64_chars_length',
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
