import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;
    const offset = (page - 1) * limit;

    let conditions = [];
    let params = [];
    let paramCount = 1;

    if (city) {
      conditions.push(`situs_city = $${paramCount++}`);
      params.push(city);
    }
    if (minPrice) {
      conditions.push(`predicted_lot_price >= $${paramCount++}`);
      params.push(minPrice);
    }
    if (maxPrice) {
      conditions.push(`predicted_lot_price <= $${paramCount++}`);
      params.push(maxPrice);
    }

    const whereClause = conditions.length > 0
      ? 'WHERE ' + conditions.join(' AND ')
      : '';

    const result = await query(
      `SELECT
        attom_id, situs_address, situs_city, situs_state, situs_zip,
        lot_size_square_feet,
        predicted_lot_price, predicted_sale_price,
        potential_profit, potential_profit_percentage,
        year_built, square_footage,
        array_length(builder_transaction_ids, 1) as builder_comp_count,
        array_length(new_construction_mls_ids, 1) as mls_comp_count
      FROM public.v_offmarket_lots
      ${whereClause}
      ORDER BY published_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM public.v_offmarket_lots ${whereClause}`,
      params
    );

    return NextResponse.json({
      properties: result.rows,
      total: parseInt(countResult.rows[0].total),
      page
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}