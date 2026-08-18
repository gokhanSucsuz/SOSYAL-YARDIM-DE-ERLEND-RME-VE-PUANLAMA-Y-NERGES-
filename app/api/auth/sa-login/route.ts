import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { encryptSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'E-posta gereklidir' }, { status: 400 });
    }

    // Katı kural: Sadece gokhansucsuz@gmail.com süper admin olarak girebilir
    if (email !== 'gokhansucsuz@gmail.com') {
      return NextResponse.json({ error: 'Bu alana sadece yetkili süper yönetici giriş yapabilir.' }, { status: 403 });
    }

    let user = await User.findOne({ email });
    
    // Eğer süper admin hesabı veritabanında yoksa otomatik oluştur
    if (!user) {
      user = new User({
        email: 'gokhansucsuz@gmail.com',
        name: 'Süper Admin',
        role: 'superadmin',
        isTwoFactorEnabled: false
      });
      await user.save();
    }

    // İlk giriş veya şifre sıfırlanmış durum: Şifresiz girişe izin ver ve needsSetup: true yap
    let needsSetup = false;
    if (!user.passwordHash || user.forcePasswordReset) {
      needsSetup = true;
    }

    // İlk giriş (şifre yok): şifre sorulmaz, boş geçebilir.
    if (!user.passwordHash) {
      // Şifre yok, direk geç (zaten needsSetup true oldu)
    } else {
      // Şifre varsa mutlaka kontrol et
      if (!password) {
        return NextResponse.json({ error: 'Lütfen şifrenizi girin' }, { status: 400 });
      }
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ error: 'Şifre hatalı' }, { status: 401 });
      }
    }

    // 2FA kontrolü (eğer ihtiyaç varsa ve şifre kurulum aşamasında değilse)
    if (user.isTwoFactorEnabled && !needsSetup) {
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
    console.error('SA Login error:', error);
    return NextResponse.json({ error: error.message || 'Sunucu içi hata' }, { status: 500 });
  }
}
