import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, DollarSign, TrendingUp, Calculator, MapPin, BarChart3, CheckCircle2, Target, Users, TrendingDown } from "lucide-react";

async function getStatistics() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/statistics`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch statistics');
    return await res.json();
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return null;
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function Home() {
  const stats = await getStatistics();

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold mb-6">
              OffMarketLots.com
            </h1>
            <p className="text-xl opacity-95 leading-relaxed">
              Exclusive off-market lot opportunities for builders and developers.
              Pre-comped properties with profit calculations and comprehensive market analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="bg-gray-50 border-y">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <DollarSign className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">Average Lot Price</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(stats.suggestedLotPrice)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Based on {stats.builderPurchaseStats?.count || 0} builder purchases
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">Average Sale Price</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(stats.potentialSalePrice)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Based on {stats.newConstructionStats?.count || 0} new constructions
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Building2 className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Listings</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.overallStats?.totalListings || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Across {stats.overallStats?.citiesCount || 0} cities
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* What We Do Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Do</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We identify and analyze off-market lot opportunities before they hit the general market
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardHeader>
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Property Pre-Comping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive analysis of comparable sales to predict accurate lot purchase prices and potential sale values for new construction.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-500 transition-colors">
              <CardHeader>
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Profit Calculations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Detailed profit margin and ROI calculations for new construction projects, helping you identify the most lucrative opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-500 transition-colors">
              <CardHeader>
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Market Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Historical data on builder purchases and new construction sales, providing deep insights into market trends and opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-16" />

        {/* How It Works Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our systematic approach to identifying profitable lot opportunities
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Collection</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We aggregate transaction data from public records and MLS listings to build a comprehensive database of property sales and builder activities.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Pattern Analysis</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our algorithms identify areas where builders are actively purchasing lots, revealing emerging development hotspots before they become widely known.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Price Prediction</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Using comparable sales data, we estimate realistic purchase and sale prices, giving you confidence in your investment decisions.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Opportunity Identification</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We highlight properties with the highest profit potential, allowing you to focus on the most promising investment opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-16" />

        {/* Who We Serve Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who We Serve</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trusted by industry professionals for identifying profitable opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-10 w-10 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Builders</h3>
              <p className="text-sm text-gray-600">Find perfect lots for your next development project</p>
            </div>

            <div className="text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-10 w-10 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Investors</h3>
              <p className="text-sm text-gray-600">Discover off-market opportunities before competitors</p>
            </div>

            <div className="text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Wholesalers</h3>
              <p className="text-sm text-gray-600">Identify properties to flip to builders at profit</p>
            </div>

            <div className="text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-10 w-10 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Landowners</h3>
              <p className="text-sm text-gray-600">Understand the true development value of your property</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Find Your Next Opportunity?</h2>
            <p className="text-xl opacity-90 mb-8 leading-relaxed">
              Access exclusive off-market lots with comprehensive market analysis.
              Each property includes detailed builder purchase comps and new construction sales data.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>Direct Property Links</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>Builder Comparables</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>ROI Analysis</span>
              </div>
            </div>
            <p className="text-sm opacity-75">
              Properties are available via direct link only. Contact us to receive property links tailored to your investment criteria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}