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
    const trimmedPassword = (password || '').trim();
    if (!trimmedPassword || trimmedPassword.length < 6) {
      return NextResponse.json({ error: 'Şifre en az 6 karakter olmalıdır' }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    // Capture decrypted fields before user.save() encrypts them
    const userId = user.id;
    const userName = user.name;
    const userEmail = user.email;
    const userRole = user.role;

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(trimmedPassword, salt);
    
    user.passwordHash = hash;
    user.forcePasswordReset = false; // Reset the flag
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Create a new session without needsSetup
    const sessionData = {
      id: userId,
      email: userEmail,
      name: userName,
      role: userRole
    };

    const newSessionToken = await encryptSession(sessionData);
    const res = NextResponse.json({ success: true, user: { id: userId, name: userName, role: userRole } });
    res.cookies.set('session', newSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && req.nextUrl.protocol === 'https:',
      sameSite: 'lax',
      path: '/'
    });

    return res;
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
