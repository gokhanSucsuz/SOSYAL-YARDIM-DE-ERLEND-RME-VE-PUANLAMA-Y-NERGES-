import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { encryptSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-posta ve şifre gereklidir' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'E-posta veya şifre hatalı' }, { status: 401 });
    }

    if (user.role !== 'superadmin') {
      return NextResponse.json({ error: 'Bu alana sadece süper yöneticiler giriş yapabilir.' }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash || '');
    if (!isMatch) {
      return NextResponse.json({ error: 'E-posta veya şifre hatalı' }, { status: 401 });
    }

    if (user.isTwoFactorEnabled) {
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
      role: user.role
    };

    const session = await encryptSession(sessionData);
    const res = NextResponse.json({ success: true, user: { name: user.name, role: user.role } });
    res.cookies.set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    return res;

  } catch (error: any) {
    console.error('SA Login error:', error);
    return NextResponse.json({ error: error.message || 'Sunucu içi hata' }, { status: 500 });
  }
}
