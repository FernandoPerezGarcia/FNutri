import { NextResponse } from 'next/server';
import { getProductById } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const product = await getProductById(id);
    if (product) {
      return NextResponse.json({ product });
    }
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  } catch (err) {
    console.error('[API] /api/products/[id] GET error', err);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
} 