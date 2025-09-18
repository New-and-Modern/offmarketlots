# OffMarketLots.com - Specification

## Overview
 Website displaying property listings with predicted prices and profit calculations.

 Home Page

 Create a simple home page that introduces the builders to the fact that this website is for getting leads on off market lots that they can buy to build on. Also specify that we pre comp the properties, calculate profit potential for new construction, scope out the property in other ways and provide all details about the property in a single interface along with historical analysis of builder purchases and new construction.

   OffMarketLots.com - Property Comp Analysis Page

  Overview

  A property investment analysis tool that helps identify profitable off-market lot
  opportunities by comparing builder purchase patterns and new construction sales in the
  area.

  Key Components

  1. Property Overview Section

  - Shows the target property's address, lot size, and location
  - Displays predicted lot purchase price (what you could buy it for)
  - Shows predicted sale price (what a builder would sell a new home for)
  - Highlights potential profit margin and ROI percentage

  2. Builder Purchase Comps Section

  - Lists recent vacant lot purchases by builders in the same area
  - Shows what professional builders actually paid for similar lots
  - Includes transaction dates, buyer names (builder companies), and price per square foot
  - Helps validate the predicted lot purchase price based on real market data

  3. New Construction Sales Comps Section

  - Displays recently built and sold homes in the neighborhood
  - Shows actual sale prices of new construction homes on similar lot sizes
  - Includes home details like square footage, bedrooms, bathrooms
  - Helps validate the predicted sale price for a new build

  4. Investment Analysis Summary

  - Suggested Lot Purchase Price: Based on what builders are paying for similar lots
  - Potential Sale Price: Based on what new homes are selling for in the area
  - Potential Profit: The difference between purchase and sale price
  - ROI Percentage: Return on investment calculation
  - Comp Counts: Number of builder purchases and new construction sales analyzed

  How It Works

  1. Data Collection: Aggregates transaction data from public records and MLS listings
  2. Pattern Analysis: Identifies properties where builders are actively purchasing lots
  3. Price Prediction: Uses comparable sales to estimate realistic purchase and sale prices
  4. Opportunity Identification: Highlights properties with the highest profit potential

  Use Cases

  - Investors: Find off-market lots before builders do
  - Developers: Identify areas with active new construction demand
  - Wholesalers: Locate properties to flip to builders
  - Landowners: Understand the true development value of their property

  The page essentially answers: "If I buy this lot at the suggested price and a builder 
  develops it, what's the profit potential based on actual market comparables?"

 The other page would be a template page that would show the property comp for an individual property. There is a separate admin website that publishes these into the tables below. There is no list page. Builders will get direct links. And the link will use attom_id as hte unique key which is a unique key for the property.

 Use shadcn to build the site

 

## Database Architecture

### Database Connection
```
Connection String: postgresql://offmarketlots:pX*YwLSO3lW75wmy@db-postgresql-nyc1-06197-do-user-14246989-0.c.db.ondigitalocean.com:25060/db_newandmodern
```

### Available Views

**1. public.v_offmarket_lots** - Main properties with predicted prices
- attom_id, situs_address, situs_city, situs_state, situs_zip
- lot_size_square_feet, predicted_lot_price, predicted_sale_price
- potential_profit, potential_profit_percentage
- builder_transaction_ids[], new_construction_mls_ids[]

**2. public.v_offmarket_lots_builder_comps** - Builder purchase comparables
- published_property_id (links to attom_id in main view)
- transaction_id, transfer_amount, instrument_date
- full_address, lot_size_square_feet, price_per_sqft

**3. public.v_offmarket_lots_mls_comps** - MLS new construction comparables
- published_property_id (links to attom_id in main view)
- mls_id, list_price, current_price, sale_price
- full_address, lot_size_square_feet, price_per_sqft

**4. public.v_offmarket_lots_stats** - Aggregate statistics
- total_listings, avg_predicted_lot_price, avg_predicted_sale_price
- builder_purchase_count, new_construction_count

**5. public.v_offmarket_lots_by_city** - City aggregations
- city, state, listing_count, avg_predicted_lot_price, avg_predicted_sale_price


## Website Pages

### 1. Homepage (/)
- **Hero Metrics**: Display avg_predicted_lot_price and avg_predicted_sale_price from v_offmarket_lots_stats
- **Property List**: Query v_offmarket_lots with filters for city, price range
- **Search/Filter**: Filter by situs_city, predicted prices, potential_profit
- **Sort Options**: By published_at, potential_profit_percentage, predicted prices

### 2. Property Detail (/property/[attom_id])
- **Property Info**: Query v_offmarket_lots WHERE attom_id = $1
- **Builder Comps Table**: Query v_offmarket_lots_builder_comps WHERE published_property_id = $1
- **MLS Comps Table**: Query v_offmarket_lots_mls_comps WHERE published_property_id = $1
- **Display**: Address, lot size, predicted prices, profit calculations, comp counts

## API Endpoints

```
GET /api/properties - List properties from v_offmarket_lots
GET /api/properties/[attom_id] - Single property details
GET /api/statistics - Query v_offmarket_lots_stats
GET /api/cities - List cities from v_offmarket_lots_by_city
```


### Database Query Examples
```sql
-- List published properties
SELECT
  attom_id, situs_address, situs_city, situs_state, situs_zip,
  lot_size_square_feet, predicted_lot_price, predicted_sale_price,
  potential_profit, potential_profit_percentage,
  year_built, square_footage,
  array_length(builder_transaction_ids, 1) as builder_comp_count,
  array_length(new_construction_mls_ids, 1) as mls_comp_count
FROM public.v_offmarket_lots
WHERE situs_city = $1
ORDER BY published_at DESC
LIMIT 20 OFFSET $2;

-- Get single property with comp details
SELECT * FROM public.v_offmarket_lots WHERE attom_id = $1;

-- Get builder purchase comps for a property
SELECT
  transaction_id, full_address, instrument_date,
  transfer_amount, grantee_1_name_full,
  lot_size_square_feet, price_per_sqft
FROM public.v_offmarket_lots_builder_comps
WHERE published_property_id = $1
ORDER BY instrument_date DESC;

-- Get new construction comps for a property
SELECT
  mls_id, mls_number, full_address, list_date,
  list_price, current_price, sale_price,
  lot_size_square_feet, price_per_sqft, status
FROM public.v_offmarket_lots_mls_comps
WHERE published_property_id = $1
ORDER BY list_date DESC;

-- Get unique cities using optimized view
SELECT city, state, listing_count
FROM public.v_offmarket_lots_by_city
ORDER BY listing_count DESC;

-- Get homepage statistics using dedicated view
SELECT * FROM public.v_offmarket_lots_stats;

-- Properties with highest profit potential
SELECT
  attom_id, address, city,
  predicted_lot_price, predicted_sale_price,
  potential_profit, potential_profit_percentage,
  year_built, square_footage, mls_status
FROM public.v_offmarket_lots
WHERE potential_profit IS NOT NULL
ORDER BY potential_profit DESC
LIMIT 10;
```

### API Implementation for Statistics
```typescript
// /api/statistics/route.ts
import { query } from '@/lib/db';

export async function GET() {
  // Use the optimized statistics view
  const stats = await query(
    `SELECT * FROM public.v_offmarket_lots_stats`
  );

  const statsData = stats.rows[0];

  return NextResponse.json({
    suggestedLotPrice: Number(statsData?.avg_predicted_lot_price || 0),
    potentialSalePrice: Number(statsData?.avg_predicted_sale_price || 0),
    builderPurchaseStats: {
      count: Number(statsData?.builder_purchase_count || 0),
      avgPrice: Number(statsData?.builder_purchase_avg_price || 0),
      avgPricePerSqft: Number(statsData?.builder_purchase_avg_price_per_sqft || 0),
      avgLotSize: Number(statsData?.builder_purchase_avg_lot_size || 0)
    },
    newConstructionStats: {
      count: Number(statsData?.new_construction_count || 0),
      avgPrice: Number(statsData?.new_construction_avg_price || 0),
      avgPricePerSqft: Number(statsData?.new_construction_avg_price_per_sqft || 0),
      avgLotSize: Number(statsData?.new_construction_avg_lot_size || 0)
    },
    overallStats: {
      totalListings: Number(statsData?.total_listings || 0),
      citiesCount: Number(statsData?.total_cities || 0),
      priceRange: {
        min: Number(statsData?.min_price || 0),
        max: Number(statsData?.max_price || 0)
      },
      lotSizeRange: {
        min: Number(statsData?.min_lot_size || 0),
        max: Number(statsData?.max_lot_size || 0)
      }
    }
  });
}
```

### API Implementation for Properties
```typescript
// /api/properties/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const city = searchParams.get('city');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const compType = searchParams.get('compType');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  let conditions = [];
  let params = [];
  let paramCount = 1;

  if (city) {
    conditions.push(`city = $${paramCount++}`);
    params.push(city);
  }
  if (minPrice) {
    conditions.push(`price >= $${paramCount++}`);
    params.push(minPrice);
  }
  if (maxPrice) {
    conditions.push(`price <= $${paramCount++}`);
    params.push(maxPrice);
  }
  if (compType) {
    conditions.push(`comp_type = $${paramCount++}`);
    params.push(compType);
  }

  const whereClause = conditions.length > 0
    ? 'WHERE ' + conditions.join(' AND ')
    : '';

  // Query enriched view with ATTOM data
  const result = await query(
    `SELECT
      attom_id, situs_address, situs_city, situs_state, situs_zip,
      lot_size_square_feet, lot_width, lot_depth,
      predicted_lot_price, predicted_sale_price,
      potential_profit, potential_profit_percentage,
      year_built, square_footage,
      bedrooms_count, bathrooms_total,
      latitude, longitude,
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
}
```


## Key Database Features

### Enriched Property Data
The `public.v_offmarket_lots` view provides:
- **Published comp data**: User-edited predicted prices and marketing metadata
- **ATTOM enrichment**: Property characteristics, tax assessments, ownership
- **MLS integration**: Active listings, sale history, agent contacts, images
- **Parcel geometry**: For accurate map display and boundaries
- **Calculated metrics**: Profit potential, profit percentage

### Performance Optimizations
- Pre-aggregated statistics views (`v_offmarket_lots_stats`, `v_offmarket_lots_by_city`)
- Efficient JOINs with cross-mapping tables
- Array storage for comp IDs reduces table size
- LATERAL unnest for efficient array expansion

## Quick Start Guide

### 2. Set Environment Variables
Create `.env.local`:
```bash
DATABASE_URL=postgresql://offmarketlots:pX*YwLSO3lW75wmy@db-postgresql-nyc1-06197-do-user-14246989-0.c.db.ondigitalocean.com:25060/db_newandmodern?sslmode=require
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key
```

### 3. Create Database Connection (`lib/db.ts`)
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function query(text: string, params?: any[]) {
  const res = await pool.query(text, params);
  return res.rows;
}
```

### 4. Test Database Connection
```typescript
// app/api/test/route.ts
import { query } from '@/lib/db';

export async function GET() {
  const result = await query('SELECT * FROM public.v_offmarket_lots_stats');
  return Response.json(result[0]);
}
```

### 5. Deploy
```bash
npm run build
npm run start
```

## Data Flow
1. **Admin publishes comps** → Premarket Dashboard → Inserts into `xlot_calculator_published_comps`
2. **Website queries views** → OffMarketLots.com → Reads from `public.v_offmarket_*` views
3. **Views join data** → Automatic enrichment with ATTOM properties and MLS data
4. **Users see** → Enriched property listings with profit calculations