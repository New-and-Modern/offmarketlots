import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const stats = await query(
      `SELECT * FROM public.v_offmarket_lots_stats`
    );

    const statsData = stats.rows[0];

    if (!statsData) {
      return NextResponse.json({
        suggestedLotPrice: 0,
        potentialSalePrice: 0,
        builderPurchaseStats: {
          count: 0,
          avgPrice: 0,
          avgPricePerSqft: 0,
          avgLotSize: 0
        },
        newConstructionStats: {
          count: 0,
          avgPrice: 0,
          avgPricePerSqft: 0,
          avgLotSize: 0
        },
        overallStats: {
          totalListings: 0,
          citiesCount: 0,
          priceRange: {
            min: 0,
            max: 0
          },
          lotSizeRange: {
            min: 0,
            max: 0
          }
        }
      });
    }

    return NextResponse.json({
      suggestedLotPrice: Number(statsData.avg_predicted_lot_price || 0),
      potentialSalePrice: Number(statsData.avg_predicted_sale_price || 0),
      builderPurchaseStats: {
        count: Number(statsData.builder_purchase_count || 0),
        avgPrice: Number(statsData.builder_purchase_avg_price || 0),
        avgPricePerSqft: Number(statsData.builder_purchase_avg_price_per_sqft || 0),
        avgLotSize: Number(statsData.builder_purchase_avg_lot_size || 0)
      },
      newConstructionStats: {
        count: Number(statsData.new_construction_count || 0),
        avgPrice: Number(statsData.new_construction_avg_price || 0),
        avgPricePerSqft: Number(statsData.new_construction_avg_price_per_sqft || 0),
        avgLotSize: Number(statsData.new_construction_avg_lot_size || 0)
      },
      overallStats: {
        totalListings: Number(statsData.total_listings || 0),
        citiesCount: Number(statsData.total_cities || 0),
        priceRange: {
          min: Number(statsData.min_price || 0),
          max: Number(statsData.max_price || 0)
        },
        lotSizeRange: {
          min: Number(statsData.min_lot_size || 0),
          max: Number(statsData.max_lot_size || 0)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}