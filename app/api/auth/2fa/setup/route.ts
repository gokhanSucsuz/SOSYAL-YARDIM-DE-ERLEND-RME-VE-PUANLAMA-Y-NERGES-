import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import speakeasy from 'speakeasy';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback';
const key = new TextEncoder().encode(JWT_SECRET);

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Oturum bulunamadı' }, { status: 401 });
    }

    const { payload } = await jwtVerify(sessionCookie, key, { algorithms: ['HS256'] });
    
    if (payload.requires2FA) {
        return NextResponse.json({ error: 'Önce 2FA doğrulamasını tamamlayın.' }, { status: 403 });
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

    if (user.isTwoFactorEnabled) {
      return NextResponse.json({ error: '2FA zaten aktif.' }, { status: 400 });
    }
    
    if (!user.twoFactorSecret) {
        return NextResponse.json({ error: 'Önce QR kodu oluşturun' }, { status: 400 });
    }

    const isVerified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: token,
        window: 1 // allows 30 seconds before or after
    });

    if (isVerified) {
        user.isTwoFactorEnabled = true;
        await user.save();
        return NextResponse.json({ success: true, message: '2FA başarıyla aktifleştirildi.' });
    } else {
        return NextResponse.json({ error: 'Geçersiz doğrulama kodu' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('2FA Setup error:', error);
    return NextResponse.json({ error: error.message || 'Sunucu hatası' }, { status: 500 });
  }
}
