import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { encryptSession } from '@/lib/auth'; // Using existing logic but for google_session

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Token bulunamadı' }, { status: 400 });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return NextResponse.json({ error: 'Geçersiz token payload' }, { status: 401 });
    }

    // ONLY allow edirnesydv@gmail.com
    if (payload.email !== 'edirnesydv@gmail.com') {
      return NextResponse.json({ error: 'Yalnızca yetkili kurum hesabı ile giriş yapılabilir.' }, { status: 403 });
    }

    // If valid, create a Google session
    const googleSessionData = {
      isGoogleVerified: true,
      email: payload.email,
      timestamp: Date.now()
    };

    // We can reuse our `encryptSession` function from lib/auth, 
    // but the payload needs to conform to SessionPayload which requires `role`.
    // Let's just create a specialized token or bypass the strict TS type by casting.
    const sessionToken = await encryptSession(googleSessionData as any);

    const res = NextResponse.json({ success: true });
    
    // Set a specialized cookie for the gatekeeper
    res.cookies.set('google_gate_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return res;

  } catch (error) {
    console.error('Google verification error:', error);
    return NextResponse.json({ error: 'Kimlik doğrulama başarısız.' }, { status: 500 });
  }
}
