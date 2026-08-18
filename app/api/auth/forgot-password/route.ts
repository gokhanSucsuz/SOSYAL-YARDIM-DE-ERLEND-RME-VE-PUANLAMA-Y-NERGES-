import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { sendMail } from '@/lib/mailer';

function generateRandomPassword(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'E-posta adresi gereklidir' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Güvenlik gereği e-postanın sistemde bulunup bulunmadığını ifşa etmeyiz
      return NextResponse.json({ success: true, message: 'Eğer e-posta sistemde kayıtlıysa, şifre sıfırlama talimatları gönderilmiştir.' });
    }

    // Yeni rastgele şifre oluştur
    const tempPassword = generateRandomPassword(8);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(tempPassword, salt);

    // Kaydet ve forcePasswordReset bayrağını yak
    user.passwordHash = hash;
    user.forcePasswordReset = true;
    await user.save();

    // E-posta gönderimi
    const subject = 'Sistem Girişi - Tek Kullanımlık Şifre (Sıfırlama)';
    const htmlContent = `
      <div style="font-family: sans-serif; max-w-md; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-bottom: 1px solid #e2e8f0;">
          <h2 style="margin: 0; color: #0f172a;">Sosyal Yardım Otomasyonu</h2>
        </div>
        <div style="padding: 20px;">
          <p style="color: #334155; font-size: 16px;">Merhaba <strong>${user.name}</strong>,</p>
          <p style="color: #334155; font-size: 16px;">Hesabınız için şifre sıfırlama talebinde bulundunuz.</p>
          <p style="color: #334155; font-size: 16px;">Aşağıdaki tek kullanımlık geçici şifreniz ile sisteme giriş yapabilirsiniz. Giriş yaptıktan sonra sistem sizi <strong>yeni bir şifre belirlemeniz için</strong> ilgili ekrana yönlendirecektir.</p>
          
          <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #0284c7; letter-spacing: 2px;">${tempPassword}</span>
          </div>

          <p style="color: #64748b; font-size: 14px;">Eğer bu işlemi siz talep etmediyseniz, lütfen sistem yöneticinizle iletişime geçin.</p>
        </div>
      </div>
    `;

    // Gönderimi arka planda yap (fire and forget), böylece kullanıcı beklemez
    sendMail(user.email, subject, htmlContent).catch(console.error);

    return NextResponse.json({ success: true, message: 'Geçici şifreniz e-posta adresinize gönderildi.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'İşlem sırasında bir hata oluştu' }, { status: 500 });
  }
}
