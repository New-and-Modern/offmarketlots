import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Building2, DollarSign, TrendingUp, MapPin, Home, Calculator, Calendar, ArrowLeft, Percent, Square, BarChart3 } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

async function getPropertyData(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/property/${id}`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch property');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US').format(value);
}

export default async function PropertyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getPropertyData(id);

  if (!data) {
    notFound();
  }

  const { property, builderComps, mlsComps } = data;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-2">Property Analysis</h1>
            <p className="text-xl opacity-90">
              Comprehensive investment analysis for off-market lot opportunity
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Property Overview */}
        <Card className="border-2 mb-8">
          <CardHeader className="bg-gray-50">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2 text-gray-900">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  {property.situs_address}
                </CardTitle>
                <CardDescription className="text-lg mt-2 text-gray-600">
                  {property.situs_city}, {property.situs_state} {property.situs_zip}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                ID: {property.attom_id}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Square className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lot Size</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatNumber(property.lot_size_square_feet)} sq ft
                  </p>
                </div>
              </div>
              {property.year_built && (
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year Built</p>
                    <p className="text-lg font-semibold text-gray-900">{property.year_built}</p>
                  </div>
                </div>
              )}
              {property.square_footage && (
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Home className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Building Size</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatNumber(property.square_footage)} sq ft
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Investment Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-700">
                <DollarSign className="h-4 w-4 text-blue-600" />
                Suggested Lot Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(property.predicted_lot_price)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Based on builder comparables
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-700">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Potential Sale Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(property.predicted_sale_price)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                New construction value
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-700">
                <Calculator className="h-4 w-4 text-purple-600" />
                Potential Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(property.potential_profit)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Gross profit estimate
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-orange-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-700">
                <Percent className="h-4 w-4 text-orange-600" />
                ROI Percentage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">
                {property.potential_profit_percentage !== null && property.potential_profit_percentage !== undefined
                  ? `${Number(property.potential_profit_percentage).toFixed(1)}%`
                  : 'N/A'}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Return on investment
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Comparables Tables */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Builder Comps */}
          <Card className="border-2">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-900">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Builder Purchase Comps
                </span>
                <Badge variant="secondary">{builderComps.length} comps</Badge>
              </CardTitle>
              <CardDescription className="text-gray-600">
                Recent vacant lot purchases by builders in this area
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Address</TableHead>
                      <TableHead className="font-semibold text-gray-700">Date</TableHead>
                      <TableHead className="font-semibold text-gray-700">Price</TableHead>
                      <TableHead className="font-semibold text-gray-700">$/sqft</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {builderComps.length > 0 ? (
                      builderComps.slice(0, 10).map((comp: { transaction_id: string; full_address: string; instrument_date: string; transfer_amount: number; price_per_sqft: number }) => (
                        <TableRow key={comp.transaction_id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-gray-900">
                            {comp.full_address}
                          </TableCell>
                          <TableCell className="text-gray-700">{formatDate(comp.instrument_date)}</TableCell>
                          <TableCell className="font-semibold text-gray-900">{formatCurrency(comp.transfer_amount)}</TableCell>
                          <TableCell className="text-gray-700">{formatCurrency(comp.price_per_sqft)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                          No builder purchase comps available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* MLS Comps */}
          <Card className="border-2">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-900">
                  <Home className="h-5 w-5 text-green-600" />
                  New Construction Sales
                </span>
                <Badge variant="secondary">{mlsComps.length} comps</Badge>
              </CardTitle>
              <CardDescription className="text-gray-600">
                Recently built and sold homes in the neighborhood
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Address</TableHead>
                      <TableHead className="font-semibold text-gray-700">List Date</TableHead>
                      <TableHead className="font-semibold text-gray-700">Sale Price</TableHead>
                      <TableHead className="font-semibold text-gray-700">$/sqft</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mlsComps.length > 0 ? (
                      mlsComps.slice(0, 10).map((comp: { mls_id?: string; full_address: string; list_date: string; sale_price?: number; current_price?: number; list_price?: number; price_per_sqft: number }, index: number) => (
                        <TableRow key={comp.mls_id || index} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-gray-900">
                            {comp.full_address}
                          </TableCell>
                          <TableCell className="text-gray-700">{formatDate(comp.list_date)}</TableCell>
                          <TableCell className="font-semibold text-gray-900">
                            {formatCurrency(comp.sale_price || comp.current_price || comp.list_price)}
                          </TableCell>
                          <TableCell className="text-gray-700">{formatCurrency(comp.price_per_sqft)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                          No new construction comps available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Summary */}
        <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-0">
          <CardContent className="pt-8 pb-8">
            <h2 className="text-2xl font-bold text-center mb-8">Investment Analysis Summary</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  Investment Metrics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Suggested Lot Purchase:</span>
                    <span className="font-semibold text-lg">{formatCurrency(property.predicted_lot_price)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Potential Sale Price:</span>
                    <span className="font-semibold text-lg">{formatCurrency(property.predicted_sale_price)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-300">Potential Profit:</span>
                    <span className="font-bold text-xl text-green-400">
                      {formatCurrency(property.potential_profit)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Comparable Analysis
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Builder Purchases Analyzed:</span>
                    <span className="font-semibold text-lg">{builderComps.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">New Construction Sales:</span>
                    <span className="font-semibold text-lg">{mlsComps.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-300">Total Comparables:</span>
                    <span className="font-bold text-xl">{builderComps.length + mlsComps.length}</span>
                  </div>
                </div>
              </div>
            </div>
            <Separator className="my-6 bg-gray-700" />
            <p className="text-sm text-gray-400 text-center">
              All prices are estimates based on comparable sales. Actual values may vary.
              Professional consultation recommended before making investment decisions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}