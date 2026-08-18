import mongoose, { Schema, Document } from 'mongoose';
import mongooseFieldEncryption from 'mongoose-field-encryption';

export interface IAssessment extends Document {
  id: string;
  meetingId?: string;
  date: string;
  personnelId: string;
  personnelName: string;
  managerName?: string;
  applicantName: string;
  applicantTc: string;
  applicantAddress?: string;
  householdSize?: number;
  phoneNumber?: string;
  householdNo?: string;
  status?: 'pending' | 'approved';
  customOrder?: number;
  data: any;
  result: {
    scoreA: number;
    scoreB: number;
    scoreC: number;
    scoreD: number;
    scoreE: number;
    scoreF: number;
    scoreG?: number;
    scorePenalty?: number;
    totalScore: number;
    assistance: { text: string; amount: number };
    priorities: string[];
    isRejected: boolean;
  };
}

const AssessmentSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  meetingId: { type: String, index: true },
  date: { type: String, required: true, index: true },
  personnelId: { type: String, required: true, index: true },
  personnelName: { type: String, required: true },
  managerName: { type: String },
  applicantName: { type: String, required: true },
  applicantTc: { type: String, required: true },
  applicantAddress: { type: String },
  householdSize: { type: Number },
  phoneNumber: { type: String },
  householdNo: { type: String },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  customOrder: { type: Number },
  data: { type: Schema.Types.Mixed, required: true },
  result: {
    scoreA: { type: Number, required: true },
    scoreB: { type: Number, required: true },
    scoreC: { type: Number, required: true },
    scoreD: { type: Number, required: true },
    scoreE: { type: Number, required: true },
    scoreF: { type: Number, required: true },
    scoreG: { type: Number },
    scorePenalty: { type: Number },
    totalScore: { type: Number, required: true },
    assistance: {
      text: { type: String, required: true },
      amount: { type: Number, required: true }
    },
    priorities: [{ type: String }],
    isRejected: { type: Boolean, required: true }
  }
}, { timestamps: true });

// Plugin for KVKK Encryption (Maximum Security)
AssessmentSchema.plugin(mongooseFieldEncryption.fieldEncryption, {
  fields: ['applicantName', 'applicantTc', 'applicantAddress', 'phoneNumber', 'data'],
  secret: process.env.ENCRYPTION_KEY || 'default_secret_key_please_change_in_production_to_64_chars_length',
});

// Since we use a string 'id' from the client, we use it as the primary key reference instead of ObjectId for simplicity with existing code.

export default mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);
