import { NextResponse } from 'next/server';
import { getOrders, getOrderItems, addOrder } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  try {
    const orders = await getOrders(userId);
    // include items for each order
    const ordersWithItems = await Promise.all(orders.map(async (o) => ({
      ...o,
      items: await getOrderItems(o.id)
    })));
    return NextResponse.json({ orders: ordersWithItems });
  } catch (err) {
    console.error('[API] /api/orders GET error', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const order = await request.json();
    const success = await addOrder(order);
    return NextResponse.json({ success });
  } catch (err) {
    console.error('[API] /api/orders POST error', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
} 