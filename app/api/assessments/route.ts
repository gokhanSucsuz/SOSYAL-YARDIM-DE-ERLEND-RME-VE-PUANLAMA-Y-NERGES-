import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Assessment from '@/models/Assessment';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const personnelId = searchParams.get('personnelId');

    let assessments;
    if (personnelId) {
      assessments = await Assessment.find({ personnelId }).sort({ date: -1 });
    } else {
      assessments = await Assessment.find({}).sort({ date: -1 });
    }

    return NextResponse.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Check if assessment with ID already exists
    const existing = await Assessment.findOne({ id: body.id });
    if (existing) {
      // Update existing
      Object.assign(existing, body);
      await existing.save();
      return NextResponse.json(existing);
    } else {
      // Create new
      const assessment = new Assessment(body);
      await assessment.save();
      return NextResponse.json(assessment, { status: 201 });
    }
  } catch (error) {
    console.error('Error saving assessment:', error);
    return NextResponse.json({ error: 'Failed to save assessment' }, { status: 500 });
  }
}
