import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      `SELECT city, state, listing_count
      FROM public.v_offmarket_lots_by_city
      ORDER BY listing_count DESC`
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}