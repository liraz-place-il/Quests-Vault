import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, computeAdminToken } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD is not configured. Add it to .env.local' },
      { status: 500 }
    );
  }

  const { password } = await req.json().catch(() => ({ password: '' }));
  if (password !== expected) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const res = NextResponse.json({ data: { ok: true } });
  res.cookies.set(ADMIN_COOKIE, await computeAdminToken(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return res;
}
