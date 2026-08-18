import mongoose from 'mongoose';

export interface IAuditLog extends mongoose.Document {
  action: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  targetResource: string;
  targetId?: string;
  details?: any;
  ipAddress?: string;
  timestamp: Date;
}

const AuditLogSchema = new mongoose.Schema<IAuditLog>({
  action: { type: String, required: true },
  actorId: { type: String, required: true },
  actorName: { type: String, required: true },
  actorRole: { type: String, required: true },
  targetResource: { type: String, required: true },
  targetId: { type: String },
  details: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now }
});

AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ targetResource: 1, targetId: 1 });
AuditLogSchema.index({ actorId: 1 });

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
