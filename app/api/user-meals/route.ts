import { NextResponse } from 'next/server';
import { getUserMeals, addUserMeal, waitForData } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  try {
    console.log('[API] /api/user-meals GET: Waiting for data');
    await waitForData();
    console.log('[API] /api/user-meals GET: Fetching meals for', userId);
    const meals = await getUserMeals(userId);
    return NextResponse.json({ meals });
  } catch (err) {
    console.error('[API] /api/user-meals GET error', err);
    return NextResponse.json({ error: 'Failed to fetch user meals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const meal = await request.json();
    console.log('[API] /api/user-meals POST: Adding meal', meal.id);
    const success = await addUserMeal(meal);
    return NextResponse.json({ success });
  } catch (err) {
    console.error('[API] /api/user-meals POST error', err);
    return NextResponse.json({ error: 'Failed to add user meal' }, { status: 500 });
  }
} 