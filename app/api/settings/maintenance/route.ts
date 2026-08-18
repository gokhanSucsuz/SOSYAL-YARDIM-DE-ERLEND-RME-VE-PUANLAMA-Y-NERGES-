import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings({ isMaintenanceMode: false });
      await settings.save();
    }
    return NextResponse.json({ isMaintenanceMode: settings.isMaintenanceMode });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { isMaintenanceMode } = await req.json();

    await connectToDatabase();
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings({ isMaintenanceMode });
    } else {
      settings.isMaintenanceMode = isMaintenanceMode;
    }
    await settings.save();

    return NextResponse.json({ success: true, isMaintenanceMode: settings.isMaintenanceMode });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
