import mongoose, { Schema, Document } from 'mongoose';

export interface IMeeting extends Document {
  id: string;
  meetingNo: string;
  date: string;
  createdAt: string;
  managerName: string;
  description?: string;
  isClosed?: boolean;
  forceOpen?: boolean;
  budgetTL?: number;
}

const MeetingSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  meetingNo: { type: String, required: true },
  date: { type: String, required: true, index: true },
  createdAt: { type: String, required: true },
  managerName: { type: String, required: true },
  description: { type: String },
  isClosed: { type: Boolean, default: false },
  forceOpen: { type: Boolean, default: false },
  budgetTL: { type: Number }
}, { timestamps: true });

export default mongoose.models.Meeting || mongoose.model<IMeeting>('Meeting', MeetingSchema);
