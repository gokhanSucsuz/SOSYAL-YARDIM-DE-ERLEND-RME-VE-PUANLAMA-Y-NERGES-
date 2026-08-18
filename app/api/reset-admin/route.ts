import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  await connectToDatabase();
  const user = await User.findOne({ email: 'gokhansucsuz@gmail.com' });
  if (user) {
    user.passwordHash = ''; // Şifreyi temizle
    user.forcePasswordReset = true;
    await user.save();
    return NextResponse.json({ success: true, message: 'Süper admin hesabı şifresi sıfırlandı. Artık şifre kısmını boş bırakarak giriş yapabilirsiniz.' });
  }
  return NextResponse.json({ error: 'Süper admin hesabı bulunamadı.' });
}
