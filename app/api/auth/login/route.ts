import { NextResponse } from 'next/server';
import type { User } from '@/lib/types';
import { authenticateUser } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }
    const user = await authenticateUser(email, password);
    if (user) {
      return NextResponse.json({ user } as { user: User });
    }
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (err) {
    console.error('[API] /api/auth/login POST error', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
} 