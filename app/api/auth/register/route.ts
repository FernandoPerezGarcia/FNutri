import { NextResponse } from 'next/server';
import type { User } from '@/lib/types';
import { createUser } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const user = await createUser(name, email, password);
    if (user) {
      return NextResponse.json({ user } as { user: User });
    }
    return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
  } catch (err) {
    console.error('[API] /api/auth/register POST error', err);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
} 