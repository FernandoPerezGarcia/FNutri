import { NextResponse } from 'next/server';
import { getProducts, waitForData } from '@/lib/data';

export async function GET() {
  try {
    console.log('[API] /api/products: Fetching products');
    
    // Make sure data is initialized on the server
    await waitForData();
    
    // Now get the products
    const products = await getProducts();
    console.log(`[API] /api/products: Returning ${products.length} products`);
    
    return NextResponse.json({ products });
  } catch (error) {
    console.error('[API] /api/products: Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 