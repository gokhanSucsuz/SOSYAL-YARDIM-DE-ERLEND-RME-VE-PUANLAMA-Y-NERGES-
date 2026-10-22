import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';
import AuditLog from '@/models/AuditLog';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Oturum açmanız gerekmektedir.' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Mevcut şifre ve yeni şifre alanları zorunludur.' }, { status: 400 });
    }

    const trimmedNew = (newPassword || '').trim();
    if (trimmedNew.length < 6) {
      return NextResponse.json({ error: 'Yeni şifre en az 6 karakter olmalıdır.' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı hesabı bulunamadı.' }, { status: 404 });
    }

    // Capture decrypted fields before any save (KVKK mongoose-field-encryption precaution)
    const userId = user.id;
    const userName = user.name;
    const userRole = user.role;

    // Verify current password against stored hash or legacy plain-text
    const trimmedCurrent = (currentPassword || '').trim();
    let isCurrentMatch = false;

    if (user.passwordHash) {
      try {
        isCurrentMatch = await bcrypt.compare(trimmedCurrent, user.passwordHash);
      } catch (err) {
        isCurrentMatch = false;
      }
      if (!isCurrentMatch && trimmedCurrent === user.passwordHash) {
        isCurrentMatch = true;
      }
    }

    if (!isCurrentMatch) {
      return NextResponse.json({ error: 'Mevcut şifrenizi hatalı girdiniz.' }, { status: 400 });
    }

    // Hash and store the new password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(trimmedNew, salt);

    user.passwordHash = hash;
    user.forcePasswordReset = false;
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Audit log
    const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';
    await AuditLog.create({
      action: 'PASSWORD_CHANGE_SUCCESS',
      actorId: userId,
      actorName: userName,
      actorRole: userRole,
      targetResource: 'AUTH',
      ipAddress
    }).catch(() => {});

    return NextResponse.json({ success: true, message: 'Şifreniz başarıyla güncellendi.' });
  } catch (error: any) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Şifre güncellenirken sunucu hatası oluştu.' }, { status: 500 });
  }
}
