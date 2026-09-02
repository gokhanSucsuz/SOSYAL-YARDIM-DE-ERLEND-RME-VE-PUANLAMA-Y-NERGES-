import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Assessment from '@/models/Assessment';
import AuditLog from '@/models/AuditLog';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { ids, groupName } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Geçersiz ID listesi' }, { status: 400 });
    }

    const sessionData = await getSession(req);
    const actorId = sessionData?.id || 'unknown';
    const actorName = sessionData?.name || 'unknown';
    const actorRole = sessionData?.role || 'unknown';
    const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';

    // Start MongoDB session for transaction
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
      // Perform batch update
      await Assessment.updateMany(
        { id: { $in: ids } },
        { $set: { managerGroup: groupName || '' } },
        { session: dbSession }
      );

      // Create Audit Logs for each
      const auditDocs = ids.map((id: string) => ({
        action: 'BATCH_ASSIGN_GROUP',
        actorId,
        actorName,
        actorRole,
        targetResource: 'ASSESSMENT',
        targetId: id,
        ipAddress,
        details: { managerGroup: groupName || '' }
      }));
      await AuditLog.insertMany(auditDocs, { session: dbSession });

      await dbSession.commitTransaction();
      dbSession.endSession();

      return NextResponse.json({ success: true, updatedCount: ids.length });
    } catch (txErr) {
      await dbSession.abortTransaction();
      dbSession.endSession();
      throw txErr;
    }
  } catch (error) {
    console.error('Error in batch assessment group assignment:', error);
    return NextResponse.json({ error: 'Toplu grup ataması başarısız oldu' }, { status: 500 });
  }
}
