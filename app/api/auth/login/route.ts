import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { encryptSession } from '@/lib/auth';
import AuditLog from '@/models/AuditLog';

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

    const ipAddress = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const now = new Date();

    // Check rate limit lock
    if (user.lockUntil && user.lockUntil > now) {
      const remainingMins = Math.ceil((user.lockUntil.getTime() - now.getTime()) / 60000);
      
      await AuditLog.create({
        action: 'LOGIN_RATE_LIMITED',
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        targetResource: 'AUTH',
        ipAddress,
        details: { email }
      });

      return NextResponse.json(
        { error: `Çok fazla hatalı giriş. Hesap ${remainingMins} dakika kilitlendi.` },
        { status: 429 }
      );
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
      // Increment failed attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      let errorMsg = 'Şifre hatalı';
      
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60000); // Lock for 15 mins
        errorMsg = 'Üst üste 5 hatalı giriş nedeniyle hesap 15 dakika kilitlendi.';
      }
      
      await user.save();
      
      await AuditLog.create({
        action: 'LOGIN_FAILED_PASSWORD',
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        targetResource: 'AUTH',
        ipAddress,
        details: { attempts: user.failedLoginAttempts }
      });

      return NextResponse.json({ error: errorMsg }, { status: 401 });
    }

    // Reset failed attempts on success
    if (user.failedLoginAttempts > 0) {
      user.failedLoginAttempts = 0;
      user.lockUntil = null;
      await user.save();
    }

    let needsSetup = false;
    if (user.forcePasswordReset) {
      needsSetup = true;
    }

    if (user.isTwoFactorEnabled && !needsSetup) {
      // 2FA is enabled
      if (!user.twoFactorSecret) {
        const sessionData = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          needsSetup: false
        };
        const session = await encryptSession(sessionData);
        const res = NextResponse.json({ success: true, needs2FASetup: true, user: { name: user.name, role: user.role } });
        res.cookies.set('session', session, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
        return res;
      } else {
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
    
    // Log successful login
    await AuditLog.create({
      action: 'LOGIN_SUCCESS',
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      targetResource: 'AUTH',
      ipAddress
    });

    return res;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Sunucu içi hata', stack: error.stack }, { status: 500 });
  }
}
