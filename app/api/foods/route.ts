import { NextResponse } from 'next/server';
import { getFoods, waitForData } from '@/lib/data';

export async function GET() {
  try {
    console.log('[API] /api/foods: Fetching foods');
    
    // Make sure data is initialized on the server
    await waitForData();
    
    // Now get the foods
    const foods = await getFoods();
    console.log(`[API] /api/foods: Returning ${foods.length} foods`);
    
    return NextResponse.json({ foods });
  } catch (error) {
    console.error('[API] /api/foods: Error fetching foods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch foods' },
      { status: 500 }
    );
  }
} 