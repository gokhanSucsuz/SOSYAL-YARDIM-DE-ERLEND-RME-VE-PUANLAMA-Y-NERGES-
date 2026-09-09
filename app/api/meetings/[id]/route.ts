import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Meeting from '@/models/Meeting';
import { getSession } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Only superadmin can delete meetings
    const session = await getSession(req);
    if (!session || session.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Toplantı dosyasını silme yetkisi yalnızca Süper Admin\'e aittir.' }, 
        { status: 403 }
      );
    }

    const { id } = await params;
    await connectToDatabase();
    
    const meeting = await Meeting.findOne({ id });
    if (!meeting) {
      return NextResponse.json({ error: 'Toplantı dosyası bulunamadı.' }, { status: 404 });
    }

    await Meeting.deleteOne({ id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return NextResponse.json({ error: 'Failed to delete meeting' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Only superadmin can update meetings via PUT
    const session = await getSession(req);
    if (!session || session.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Toplantı dosyasını güncelleme yetkisi yalnızca Süper Admin\'e aittir.' }, 
        { status: 403 }
      );
    }

    const { id } = await params;
    await connectToDatabase();
    const body = await req.json();

    // Check for duplicate meetingNo
    if (body.meetingNo) {
      const duplicateName = await Meeting.findOne({ 
        meetingNo: body.meetingNo, 
        id: { $ne: id }
      });
      if (duplicateName) {
        return NextResponse.json(
          { error: `"${body.meetingNo}" isimli bir toplantı dosyası zaten mevcut. Lütfen farklı bir isim giriniz.` }, 
          { status: 409 }
        );
      }
    }

    const meeting = await Meeting.findOne({ id });
    if (!meeting) {
      return NextResponse.json({ error: 'Toplantı dosyası bulunamadı.' }, { status: 404 });
    }

    Object.assign(meeting, body);
    await meeting.save();
    return NextResponse.json(meeting);
  } catch (error) {
    console.error('Error updating meeting:', error);
    return NextResponse.json({ error: 'Failed to update meeting' }, { status: 500 });
  }
}
