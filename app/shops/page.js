"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle, 
  X, 
  Filter,
  CheckCircle,
  Clock,
  Shield,
  ArrowRight,
  Store,
  Sparkles,
  Tag,
  ShoppingCart,
  Truck
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ShopsPage() {
  const router = useRouter();
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showContactModal, setShowContactModal] = useState(false);

  // Support contact details
  const supportContact = {
    phone: '9480072737',
    name: 'Karia Mitra Support'
  };

  const filterTypes = [
    { key: 'all', label: 'All Shops' },
    { key: 'construction', label: 'Construction' },
    { key: 'materials', label: 'Materials' },
    { key: 'hardware', label: 'Hardware' },
    { key: 'electrical', label: 'Electrical' },
    { key: 'plumbing', label: 'Plumbing' },
    { key: 'paint', label: 'Paint' },
    { key: 'tools', label: 'Tools' }
  ];

  // ✅ Fetch Shops from Supabase
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("shops")
          .select("*")
          .order("rating", { ascending: false });

        if (error) throw error;
        setShops(data || []);
        setFilteredShops(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  // ✅ Apply filters when activeFilter changes
  useEffect(() => {
    const filterShops = () => {
      if (activeFilter === 'all') {
        setFilteredShops(shops);
      } else {
        const filtered = shops.filter(shop => {
          if (!shop.category) return false;
          
          const category = shop.category.toLowerCase();
          
          switch (activeFilter) {
            case 'construction':
              return category.includes('construction');
            case 'materials':
              return category.includes('material');
            case 'hardware':
              return category.includes('hardware');
            case 'electrical':
              return category.includes('electrical');
            case 'plumbing':
              return category.includes('plumbing');
            case 'paint':
              return category.includes('paint');
            case 'tools':
              return category.includes('tool');
            default:
              return true;
          }
        });
        setFilteredShops(filtered);
      }
    };

    filterShops();
  }, [activeFilter, shops]);

  const handleWhatsAppContact = (shop) => {
    const message = `🛍️ *Shop Inquiry - Karia Mitra* 🛍️

🏪 *I'm interested in this shop:*
• *Shop Name:* ${shop.shop_name}
• *Item:* ${shop.item_name || 'Various Products'}
• *Price:* ${shop.item_price ? `₹${shop.item_price}` : 'Contact for price'}
• *Rating:* ${shop.rating || 'New'} ⭐
• *Location:* ${shop.location || 'Not specified'}

📦 *I need:* [Describe what you're looking for]

📍 *Delivery to:* [Your location]

📞 *My Contact:* [Your phone number]

I found this shop on Karia Mitra and would like to get more information!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${supportContact.phone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setShowContactModal(false);
    setSelectedShop(null);
  };

  const handleCallSupport = () => {
    window.location.href = `tel:${supportContact.phone}`;
  };

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#f8fafc"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="#9ca3af">No Image</text>
      </svg>
    `)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading shops...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32 sm:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 sm:p-3 bg-purple-100 rounded-xl">
                  <Store className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Shops & Items
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5">
                    Find construction materials and tools
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                <span>{filteredShops.length} available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile counter for small screens */}
      <div className="sm:hidden bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>{filteredShops.length} shops available</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-4 sm:pt-6">
        <div className="mb-4 sm:mb-6 px-2 sm:px-0">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                Available Shops
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">
                Tap to view items and contact via WhatsApp
              </p>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">Filter:</span>
            </div>
          </div>

          {/* Filter Buttons - Scrollable on mobile */}
          <div className="relative">
            <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-3 -mx-2 px-2 scrollbar-hide">
              {filterTypes.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`flex-shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border whitespace-nowrap ${
                    activeFilter === filter.key
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-100 transform scale-105'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filter Count */}
          <div className="mt-3 flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
            <span>Showing</span>
            <span className="font-semibold text-purple-600">{filteredShops.length}</span>
            <span>of</span>
            <span className="font-semibold text-gray-700">{shops.length}</span>
            <span>shops</span>
            {activeFilter !== 'all' && (
              <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                {filterTypes.find(f => f.key === activeFilter)?.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Shops List */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pb-32 sm:pb-6 lg:pb-8">
        {filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {filteredShops.map((shop) => (
              <div
                key={shop.id}
                onClick={() => setSelectedShop(shop)}
                className="group bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-lg sm:hover:shadow-xl hover:border-purple-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                {/* Shop Header */}
                <div className="flex items-start space-x-4 mb-4">
                  {/* Shop Logo */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={shop.logo_url || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop"}
                      alt={shop.shop_name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl object-cover border-2 border-white shadow-md group-hover:border-purple-200 transition-colors"
                      onError={handleImageError}
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 sm:p-1 border-2 border-white">
                      <Shield className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                    </div>
                  </div>
                  
                  {/* Shop Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg sm:text-xl lg:text-2xl truncate group-hover:text-purple-600 transition-colors">
                          {shop.shop_name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {shop.location && (
                            <div className="flex items-center space-x-1 text-gray-500">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="text-xs sm:text-sm truncate">{shop.location}</span>
                            </div>
                          )}
                          {shop.rating !== null && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                              <span className="text-xs sm:text-sm font-semibold text-gray-700">{shop.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors transform group-hover:translate-x-0.5 sm:group-hover:translate-x-1 flex-shrink-0 mt-1 sm:mt-0" />
                    </div>

                    {/* Shop About */}
                    {shop.about && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
                        {shop.about}
                      </p>
                    )}
                  </div>
                </div>

                {/* Item Section */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Featured Item</h4>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                      {/* Item Image */}
                      <div className="flex-shrink-0 mb-3 sm:mb-0">
                        <img
                          src={shop.item_image_url || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop"}
                          alt={shop.item_name}
                          className="w-full sm:w-32 h-24 object-cover rounded-lg border-2 border-white shadow-sm"
                          onError={handleImageError}
                        />
                      </div>
                      
                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                              {shop.item_name}
                            </h5>
                            {shop.item_description && (
                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mt-1">
                                {shop.item_description}
                              </p>
                            )}
                          </div>
                          
                          {/* Price */}
                          {shop.item_price !== null && (
                            <div className="mt-2 sm:mt-0 sm:ml-4">
                              <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-center">
                                <div className="text-xs text-green-600 font-medium">Price</div>
                                <div className="font-bold text-lg">₹{shop.item_price}</div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Additional Info */}
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="flex items-center space-x-1 text-purple-600">
                            <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-xs font-medium">Delivery Available</span>
                          </div>
                          <div className="flex items-center space-x-1 text-blue-600">
                            <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-xs font-medium">In Stock</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Store className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No Shops Found
            </h3>
            <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto mb-4">
              {activeFilter === 'all' 
                ? 'There are currently no shops available.' 
                : `No ${filterTypes.find(f => f.key === activeFilter)?.label.toLowerCase()} found.`
              }
            </p>
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
              >
                Show All Shops
              </button>
            )}
          </div>
        )}
      </div>

      {/* Shop Detail Modal */}
      {selectedShop && !showContactModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-full sm:max-w-2xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-4 sm:p-6 lg:p-8 border-b border-gray-200">
              <button
                onClick={() => setSelectedShop(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>

              <div className="flex items-start space-x-4 sm:space-x-6">
                <img
                  src={selectedShop.logo_url || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop"}
                  alt={selectedShop.shop_name}
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl object-cover border-4 border-white shadow-lg flex-shrink-0"
                  onError={handleImageError}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                      {selectedShop.shop_name}
                    </h2>
                    <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm mt-1 sm:mt-0 w-fit">
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Verified</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    {selectedShop.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate">{selectedShop.location}</span>
                      </div>
                    )}
                    {selectedShop.rating !== null && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{selectedShop.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              {/* Shop About */}
              {selectedShop.about && (
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3 flex items-center">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600 flex-shrink-0" />
                    About This Shop
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {selectedShop.about}
                  </p>
                </div>
              )}

              {/* Item Details */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 sm:mb-4 flex items-center">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600 flex-shrink-0" />
                  Featured Item
                </h3>
                
                <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
                  {/* Item Image */}
                  <div className="flex-shrink-0 mb-4 sm:mb-0">
                    <img
                      src={selectedShop.item_image_url || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop"}
                      alt={selectedShop.item_name}
                      className="w-full sm:w-48 h-32 object-cover rounded-lg sm:rounded-xl border-2 border-white shadow-lg"
                      onError={handleImageError}
                    />
                  </div>
                  
                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      {selectedShop.item_name}
                    </h4>
                    
                    {selectedShop.item_description && (
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                        {selectedShop.item_description}
                      </p>
                    )}

                    {/* Price */}
                    {selectedShop.item_price !== null && (
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-sm">Price</p>
                            <p className="text-2xl sm:text-3xl font-bold text-green-600">
                              ₹{selectedShop.item_price}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 text-green-600 mb-1">
                              <Truck className="w-4 h-4" />
                              <span className="text-sm font-medium">Free Delivery</span>
                            </div>
                            <div className="flex items-center space-x-1 text-blue-600">
                              <Tag className="w-4 h-4" />
                              <span className="text-sm font-medium">In Stock</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 sm:space-y-4 pt-6 pb-8 sm:pb-4">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 sm:py-4 px-6 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 text-base sm:text-lg hover:shadow-lg hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Contact via WhatsApp</span>
                </button>
                
                <button
                  onClick={handleCallSupport}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 sm:py-4 px-6 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 text-base sm:text-lg hover:shadow-lg hover:scale-105"
                >
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Call Support</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Confirmation Modal */}
      {showContactModal && selectedShop && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-full sm:max-w-md max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 sm:p-8 border-b border-gray-200">
              <button
                onClick={() => setShowContactModal(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Contact This Shop
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Continue to WhatsApp to connect with the shop
                </p>
              </div>
            </div>

            {/* Shop Summary */}
            <div className="p-6 sm:p-8">
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedShop.logo_url || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop"}
                    alt={selectedShop.shop_name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-white shadow-sm"
                    onError={handleImageError}
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg sm:text-xl">
                      {selectedShop.shop_name}
                    </h3>
                    <p className="text-purple-600 font-semibold text-sm sm:text-base">
                      {selectedShop.item_name}
                    </p>
                    {selectedShop.item_price !== null && (
                      <p className="text-green-600 font-bold text-sm sm:text-base mt-1">
                        ₹{selectedShop.item_price}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex items-center space-x-3 text-sm sm:text-base text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Get product details & pricing</span>
                </div>
                <div className="flex items-center space-x-3 text-sm sm:text-base text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Check availability & delivery</span>
                </div>
                <div className="flex items-center space-x-3 text-sm sm:text-base text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Discuss bulk orders</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pb-8 sm:pb-4">
                <button
                  onClick={() => handleWhatsAppContact(selectedShop)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 text-lg hover:shadow-lg hover:scale-105"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>Continue to WhatsApp</span>
                </button>
                
                <button
                  onClick={handleCallSupport}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 text-base hover:shadow-lg"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Support First</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}