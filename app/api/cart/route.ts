import { NextResponse } from 'next/server';
import { getCartItems, addCartItem, updateCartItem, removeCartItem, clearCart } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  try {
    const items = await getCartItems(userId);
    return NextResponse.json({ items });
  } catch (err) {
    console.error('[API] /api/cart GET error', err);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId, productId, quantity } = await request.json();
  if (!userId || !productId || typeof quantity !== 'number') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const success = await addCartItem(userId, productId, quantity);
  return NextResponse.json({ success });
}

export async function PATCH(request: Request) {
  const { userId, productId, quantity } = await request.json();
  if (!userId || !productId || typeof quantity !== 'number') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const success = await updateCartItem(userId, productId, quantity);
  return NextResponse.json({ success });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const productId = searchParams.get('productId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  let success;
  if (productId) {
    success = await removeCartItem(userId, productId);
  } else {
    success = await clearCart(userId);
  }
  return NextResponse.json({ success });
} 