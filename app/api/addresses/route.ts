import { NextResponse } from 'next/server';
import type { Address } from '@/lib/types';
import { getAddresses, addAddress } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  try {
    const addresses = await getAddresses(userId);
    return NextResponse.json({ addresses });
  } catch (err) {
    console.error('[API] /api/addresses GET error', err);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const address = (await request.json()) as Address;
    const success = await addAddress(address);
    return NextResponse.json({ success });
  } catch (err) {
    console.error('[API] /api/addresses POST error', err);
    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 });
  }
} 