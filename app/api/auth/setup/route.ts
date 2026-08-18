import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { getSession, encryptSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || !session.needsSetup) {
      return NextResponse.json({ error: 'Unauthorized or no setup needed' }, { status: 401 });
    }

    const { password } = await req.json();
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    user.passwordHash = hash;
    user.forcePasswordReset = false; // Reset the flag
    await user.save();

    // Create a new session without needsSetup
    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const newSessionToken = await encryptSession(sessionData);
    const res = NextResponse.json({ success: true, user: { name: user.name, role: user.role } });
    res.cookies.set('session', newSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return res;
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
