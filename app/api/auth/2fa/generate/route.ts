import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

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

    await connectToDatabase();
    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    if (user.isTwoFactorEnabled && user.twoFactorSecret) {
      return NextResponse.json({ error: '2FA zaten aktif.' }, { status: 400 });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
        name: `SosyalYardim(${user.email})`
    });

    // Save temporary secret to user
    user.twoFactorSecret = secret.base32;
    await user.save();

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url || '');

    return NextResponse.json({ success: true, qrCode: qrCodeDataUrl, secret: secret.base32 });

  } catch (error: any) {
    console.error('2FA Generate error:', error);
    return NextResponse.json({ error: error.message || 'Sunucu hatası' }, { status: 500 });
  }
}
