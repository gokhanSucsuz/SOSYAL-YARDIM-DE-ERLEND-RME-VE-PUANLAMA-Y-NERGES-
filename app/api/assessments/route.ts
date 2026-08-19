import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Assessment from '@/models/Assessment';
import AuditLog from '@/models/AuditLog';
import { AssessmentSchema } from '@/lib/validations';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const personnelId = searchParams.get('personnelId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const skip = (page - 1) * limit;

    let query = personnelId ? { personnelId } : {};

    const [data, total] = await Promise.all([
      Assessment.find(query).sort({ date: -1 }).skip(skip).limit(limit),
      Assessment.countDocuments(query)
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Zod Validation
    const parsed = AssessmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Geçersiz veri formatı', details: parsed.error.format() }, { status: 400 });
    }

    const sessionData = await getSession(req);
    const actorId = sessionData?.id || 'unknown';
    const actorName = sessionData?.name || 'unknown';
    const actorRole = sessionData?.role || 'unknown';
    const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';

    // Check if assessment with ID already exists
    const existing = await Assessment.findOne({ id: parsed.data.id });
    if (existing) {
      // Update existing
      Object.assign(existing, parsed.data);
      await existing.save();

      await AuditLog.create({
        action: 'UPDATE_ASSESSMENT',
        actorId, actorName, actorRole, ipAddress,
        targetResource: 'ASSESSMENT',
        targetId: existing.id,
        details: { applicantName: existing.applicantName, applicantTc: existing.applicantTc }
      });

      return NextResponse.json(existing);
    } else {
      // Create new
      const assessment = new Assessment(parsed.data);
      await assessment.save();

      await AuditLog.create({
        action: 'CREATE_ASSESSMENT',
        actorId, actorName, actorRole, ipAddress,
        targetResource: 'ASSESSMENT',
        targetId: assessment.id,
        details: { applicantName: assessment.applicantName, applicantTc: assessment.applicantTc }
      });

      return NextResponse.json(assessment, { status: 201 });
    }
  } catch (error: any) {
    console.error('Error saving assessment:', error);
    return NextResponse.json({ error: error.message || 'Failed to save assessment', stack: error.stack }, { status: 500 });
  }
}
