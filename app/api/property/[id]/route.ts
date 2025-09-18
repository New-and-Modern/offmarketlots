import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: attom_id } = await params;

    // Get property details
    const propertyResult = await query(
      `SELECT * FROM public.v_offmarket_lots WHERE attom_id = $1`,
      [attom_id]
    );

    if (propertyResult.rows.length === 0) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const property = propertyResult.rows[0];

    // Get builder purchase comps
    const builderComps = await query(
      `SELECT
        transaction_id, full_address, instrument_date,
        transfer_amount, grantee_1_name_full,
        lot_size_square_feet, price_per_sqft
      FROM public.v_offmarket_lots_builder_comps
      WHERE published_property_id = $1
      ORDER BY instrument_date DESC`,
      [attom_id]
    );

    // Get new construction comps
    const mlsComps = await query(
      `SELECT
        mls_id, full_address, list_date,
        list_price, current_price, sale_price,
        lot_size_square_feet, price_per_sqft, status
      FROM public.v_offmarket_lots_mls_comps
      WHERE published_property_id = $1
      ORDER BY list_date DESC`,
      [attom_id]
    );

    return NextResponse.json({
      property,
      builderComps: builderComps.rows,
      mlsComps: mlsComps.rows
    });
  } catch (error) {
    console.error('Error fetching property details:', error);
    return NextResponse.json({ error: 'Failed to fetch property details' }, { status: 500 });
  }
}