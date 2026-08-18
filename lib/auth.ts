import { SignJWT, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback';
const key = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  id: string;
  email: string;
  name: string;
  role: 'manager' | 'personnel';
  [key: string]: any;
}

export async function encryptSession(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // 1 day expiration
    .sign(key);
}

export async function decryptSession(input: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload as SessionPayload;
}

export async function getSession(req: NextRequest) {
  const session = req.cookies.get('session')?.value;
  if (!session) return null;
  try {
    return await decryptSession(session);
  } catch (err) {
    return null;
  }
}
