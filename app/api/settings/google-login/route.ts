import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    let settings = await Settings.findOne({}).lean();
    if (!settings) {
      const created = new Settings({ isMaintenanceMode: false, isGoogleLoginEnabled: false });
      await created.save();
      return NextResponse.json(
        { isGoogleLoginEnabled: false },
        { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } }
      );
    }
    return NextResponse.json(
      { isGoogleLoginEnabled: !!settings.isGoogleLoginEnabled },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } }
    );
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

    const { isGoogleLoginEnabled } = await req.json();

    await connectToDatabase();
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings({ isMaintenanceMode: false, isGoogleLoginEnabled });
    } else {
      settings.isGoogleLoginEnabled = isGoogleLoginEnabled;
    }
    await settings.save();

    return NextResponse.json({ success: true, isGoogleLoginEnabled: settings.isGoogleLoginEnabled });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
