import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  isMaintenanceMode: boolean;
}

const SettingsSchema: Schema = new Schema(
  {
    isMaintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
