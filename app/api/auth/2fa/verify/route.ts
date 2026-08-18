import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import speakeasy from 'speakeasy';
import { encryptSession } from '@/lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback';
const key = new TextEncoder().encode(JWT_SECRET);

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Oturum bulunamadı' }, { status: 401 });
    }

    const { payload } = await jwtVerify(sessionCookie, key, { algorithms: ['HS256'] });
    
    // Only process if it requires 2FA or is a full session (re-verification)
    if (!payload.requires2FA) {
       return NextResponse.json({ error: '2FA doğrulaması gerekmiyor.' }, { status: 400 });
    }

    const { token } = await req.json();
    if (!token) {
        return NextResponse.json({ error: 'Doğrulama kodu gereklidir' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    if (!user.isTwoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json({ error: '2FA aktif değil.' }, { status: 400 });
    }

    const isVerified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: token,
        window: 1 // allows 30 seconds before or after
    });

    if (isVerified) {
        // Issue full session token without requires2FA
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

    } else {
        return NextResponse.json({ error: 'Geçersiz doğrulama kodu' }, { status: 401 });
    }

  } catch (error: any) {
    console.error('2FA Verify error:', error);
    return NextResponse.json({ error: error.message || 'Sunucu hatası' }, { status: 500 });
  }
}
