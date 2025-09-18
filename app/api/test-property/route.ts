import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // First check if any properties exist in the view
    const countCheck = await query<{ total: string }>(
      `SELECT COUNT(*) as total FROM public.v_offmarket_lots`
    );

    // Then check if it's in the view
    const viewCheck = await query(
      `SELECT attom_id, situs_address, situs_city FROM public.v_offmarket_lots WHERE attom_id = $1`,
      ['188827418']
    );

    // Get a sample of properties from the view to see the format
    const sampleProperties = await query(
      `SELECT attom_id, situs_address, situs_city FROM public.v_offmarket_lots LIMIT 5`
    );

    return NextResponse.json({
      totalPropertiesInView: Number(countCheck.rows[0]?.total || 0),
      propertyInView: viewCheck.rows.length > 0,
      viewData: viewCheck.rows[0] || null,
      sampleProperties: sampleProperties.rows,
      message: `Total properties in view: ${countCheck.rows[0]?.total || 0}, Property 188827418 found: ${viewCheck.rows.length > 0}`
    });
  } catch (error) {
    console.error('Error checking property:', error);
    return NextResponse.json({
      error: 'Failed to check property',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}