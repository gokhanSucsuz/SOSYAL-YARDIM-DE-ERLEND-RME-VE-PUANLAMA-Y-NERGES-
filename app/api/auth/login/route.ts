import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { encryptSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Ensure manager exists
    let manager = await User.findOne({ email: 'edirnesydv@gmail.com' });
    if (!manager) {
      manager = new User({
        email: 'edirnesydv@gmail.com',
        name: 'Vakıf Müdürü',
        role: 'manager',
        passwordHash: null
      });
      await manager.save();
    }

    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'E-posta adresi gereklidir' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'E-posta veya şifre hatalı' }, { status: 401 });
    }

    // Manager first login without password
    if (user.role === 'manager' && !user.passwordHash) {
      // Must set password, we will redirect to setup from frontend, but we need to log them in first or provide a temporary token
      // Let's create a full session anyway, but frontend will see they don't have a password
      const sessionData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        needsSetup: true
      };
      
      const session = await encryptSession(sessionData);
      const res = NextResponse.json({ success: true, needsSetup: true, user: { name: user.name, role: user.role } });
      res.cookies.set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      return res;
    }

    // Normal login with password
    if (!password) {
      return NextResponse.json({ error: 'Şifre gereklidir' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash || '');
    if (!isMatch) {
      return NextResponse.json({ error: 'Şifre hatalı' }, { status: 401 });
    }

    let needsSetup = false;
    if (user.forcePasswordReset) {
      needsSetup = true;
    }

    if (user.isTwoFactorEnabled && !needsSetup) {
      // 2FA is enabled, issue a temporary token
      const tempSessionData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        requires2FA: true
      };
      const session = await encryptSession(tempSessionData);
      const res = NextResponse.json({ success: true, requires2FA: true });
      res.cookies.set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      return res;
    }

    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      needsSetup
    };

    const session = await encryptSession(sessionData);
    const res = NextResponse.json({ success: true, user: { name: user.name, role: user.role, needsSetup } });
    res.cookies.set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    return res;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Sunucu içi hata', stack: error.stack }, { status: 500 });
  }
}
