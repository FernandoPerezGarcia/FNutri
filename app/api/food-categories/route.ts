import { NextResponse } from 'next/server';
import type { FoodCategory } from '@/lib/types';
import { getFoodCategories } from '@/lib/data';

export async function GET() {
  try {
    const categories: FoodCategory[] = await getFoodCategories();
    return NextResponse.json({ categories });
  } catch (err) {
    console.error('[API] /api/food-categories GET error', err);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
} 