import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Meeting from '@/models/Meeting';

export async function GET() {
  try {
    await connectToDatabase();
    const meetings = await Meeting.find({}).sort({ date: -1 });
    return NextResponse.json(meetings);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Check if meeting with ID already exists
    const existing = await Meeting.findOne({ id: body.id });
    if (existing) {
      Object.assign(existing, body);
      await existing.save();
      return NextResponse.json(existing);
    } else {
      const meeting = new Meeting(body);
      await meeting.save();
      return NextResponse.json(meeting, { status: 201 });
    }
  } catch (error) {
    console.error('Error saving meeting:', error);
    return NextResponse.json({ error: 'Failed to save meeting' }, { status: 500 });
  }
}
