"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { Building, Star, MapPin, Shield, Phone, Search, Filter, Package, CheckCircle } from "lucide-react";

export default function ShopsPage() {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const router = useRouter();

  // Shop categories based on your available shops (category_id 1,2,3,6)
  const categories = [
    { id: "all", name: "All Shops", count: 0 },
    { id: "1", name: "Category 1", count: 0 },
    { id: "2", name: "Category 2", count: 0 },
    { id: "3", name: "Category 3", count: 0 },
    { id: "6", name: "Category 6", count: 0 }
  ];

  useEffect(() => {
    const fetchShops = async () => {
      try {
        // Fetch all shops but only display those with category_id 1,2,3,6
        const { data, error } = await supabase
          .from("shops")
          .select("*")
          .in("category_id", [1, 2, 3, 6]); // Only fetch shops with category_id 1,2,3,6
        
        if (error) throw error;
        
        const shopsData = data || [];
        setShops(shopsData);
        setFilteredShops(shopsData);
        
        // Update category counts
        updateCategoryCounts(shopsData);
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  const updateCategoryCounts = (shopsData) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === "all") {
        return { ...cat, count: shopsData.length };
      } else {
        return {
          ...cat,
          count: shopsData.filter(shop => shop.category_id === parseInt(cat.id)).length
        };
      }
    });
    // Update categories state if needed, or use locally
    categories.forEach((cat, index) => {
      categories[index] = updatedCategories[index];
    });
  };

  useEffect(() => {
    let filtered = shops;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(shop =>
        shop.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(shop => shop.category_id === parseInt(selectedCategory));
    }

    setFilteredShops(filtered);
  }, [searchTerm, selectedCategory, shops]);

  const handleShopClick = (shop) => {
    // Navigate to items page with shop ID and category ID
    router.push(`/shops/${shop.id}?category_id=${shop.category_id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Discovering amazing shops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Building className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Construction Shops</h1>
                <p className="text-gray-600">Find trusted suppliers for your projects</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2 text-sm text-gray-500 bg-blue-50 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{shops.length} shops available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile counter */}
      <div className="sm:hidden bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>{shops.length} shops available</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search shops by name, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-xl">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">Filter by Category:</span>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${category.count === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={category.count === 0 && category.id !== "all"}
              >
                {category.name}
                <span className="ml-2 text-sm opacity-80">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Shops Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Shops
              <span className="text-blue-600 ml-2">({filteredShops.length})</span>
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Package className="w-5 h-5" />
              <span>Showing {filteredShops.length} of {shops.length} shops</span>
            </div>
          </div>

          {filteredShops.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-sm">
              <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Shops Found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "No shops available at the moment"
                }
              </p>
              {(searchTerm || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredShops.map((shop) => (
                <div
                  key={shop.id}
                  className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                >
                  {/* Shop Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        shop.banner_url ||
                        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                      }
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      {shop.verified && (
                        <div className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          <Shield className="w-4 h-4" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-black/70 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                        Category {shop.category_id}
                      </span>
                    </div>
                  </div>

                  {/* Shop Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {shop.name}
                      </h3>
                      <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{shop.rating || "New"}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">
                        {shop.city}, {shop.state}
                      </span>
                    </div>

                    {shop.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {shop.description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleShopClick(shop)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        View Products
                      </button>
                      {shop.phone && (
                        <button
                          onClick={() => (window.location.href = `tel:${shop.phone}`)}
                          className="p-3 border-2 border-gray-200 text-gray-600 rounded-xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                          title={`Call ${shop.phone}`}
                        >
                          <Phone className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4 text-center">Why Choose Our Shops?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <Shield className="w-8 h-8 mx-auto text-green-300" />
              <h4 className="font-semibold">Verified Suppliers</h4>
              <p className="text-blue-100 text-sm">All shops are thoroughly verified for quality</p>
            </div>
            <div className="space-y-2">
              <Package className="w-8 h-8 mx-auto text-green-300" />
              <h4 className="font-semibold">Category Specific</h4>
              <p className="text-blue-100 text-sm">Find items specific to each shop category</p>
            </div>
            <div className="space-y-2">
              <Star className="w-8 h-8 mx-auto text-green-300" />
              <h4 className="font-semibold">Customer Rated</h4>
              <p className="text-blue-100 text-sm">Real ratings from construction professionals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}