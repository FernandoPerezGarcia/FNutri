import { NextResponse } from 'next/server';
import type { Consultation } from '@/lib/types';
import { getConsultations, addConsultation } from '@/lib/data';

export async function GET(request: Request) {
  try {
    const consultations = await getConsultations();
    return NextResponse.json({ consultations });
  } catch (err) {
    console.error('[API] /api/consultations GET error', err);
    return NextResponse.json({ error: 'Failed to fetch consultations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const consultation = (await request.json()) as Consultation;
    const success = await addConsultation(consultation);
    return NextResponse.json({ success });
  } catch (err) {
    console.error('[API] /api/consultations POST error', err);
    return NextResponse.json({ error: 'Failed to add consultation' }, { status: 500 });
  }
} 