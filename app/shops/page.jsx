'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { 
  ShoppingCart, 
  Store, 
  Package, 
  IndianRupee, 
  Phone, 
  MessageCircle, 
  Search, 
  Filter,
  Plus,
  Minus,
  X,
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Check,
  Menu
} from 'lucide-react';

export default function ShopsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [addedItemName, setAddedItemName] = useState('');

  const mediatorNumber = "9480072737";

  // Get category from URL query parameter
  const urlCategory = searchParams.get('category');

  // Categories based on your data
  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'sanitation', name: 'Sanitation' },
    { id: 'hardware', name: 'Hardware' },
    { id: 'aggregates', name: 'Aggregates' },
    { id: 'cladding', name: 'Cladding' }
  ];

  // Fetch shops from Supabase
  useEffect(() => {
    fetchShops();
  }, []);

  // Set initial category from URL parameter
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory.toLowerCase());
    }
  }, [urlCategory]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      console.log('Fetching shops from database...');
      
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .order('rating', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched shops:', data);
      setShops(data || []);
    } catch (error) {
      console.error('Error fetching shops:', error);
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchShopItems = async (shopId) => {
    try {
      setLoading(true);
      console.log(`Fetching items for shop ${shopId}...`);
      
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('shop_id', shopId)
        .order('item_name');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log(`Fetched items for shop ${shopId}:`, data);
      
      const transformedItems = data.map(item => ({
        id: item.id,
        shop_id: item.shop_id,
        item_name: item.item_name,
        item_description: item.item_description,
        item_price: item.item_price,
        item_image_url: item.item_image_url
      }));
      
      setItems(transformedItems || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShopClick = async (shop) => {
    console.log('Shop clicked:', shop);
    setSelectedShop(shop);
    await fetchShopItems(shop.id);
  };

  const handleBackToShops = () => {
    setSelectedShop(null);
    setItems([]);
    setCart([]);
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { 
          ...item, 
          quantity: 1,
          item_name: item.item_name,
          item_price: item.item_price,
          item_image_url: item.item_image_url
        }];
      }
    });

    // Show "Added to Cart" confirmation
    setAddedItemName(item.item_name);
    setShowAddedToCart(true);
    
    // Auto hide after 2 seconds
    setTimeout(() => {
      setShowAddedToCart(false);
    }, 2000);
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.item_price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;

    const shopName = selectedShop.shop_name;
    const itemsList = cart.map(item => 
      `• ${item.item_name} - ${item.quantity} x ₹${item.item_price} = ₹${item.item_price * item.quantity}`
    ).join('\n');

    const totalAmount = getTotalPrice();

    const message = `🛒 *ORDER REQUEST - ${shopName}*

📋 *Order Items:*
${itemsList}

💰 *Total Amount:* ₹${totalAmount}

🏪 *Shop:* ${shopName}
📍 *Location:* ${selectedShop.location}

Please confirm the order and provide delivery details.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${mediatorNumber}?text=${encodedMessage}`, '_blank');
  };

  // Filter shops based on selected category
  const filteredShops = shops.filter(shop => {
    if (selectedCategory === 'all') return true;
    return shop.category?.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  // Handle image error
  const handleImageError = (e, itemName) => {
    console.log(`Image failed to load for ${itemName}`);
    e.target.src = `https://via.placeholder.com/300x200.png?text=${encodeURIComponent(itemName)}`;
  };

  // Handle shop image error
  const handleShopImageError = (e, shopName) => {
    console.log(`Shop image failed to load for ${shopName}`);
    e.target.src = `https://via.placeholder.com/64x64.png?text=${encodeURIComponent(shopName?.charAt(0) || 'S')}`;
  };

  if (loading && shops.length === 0 && !selectedShop) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">🏪 Construction Shops</h2>
            <p className="text-gray-600 text-sm sm:text-base">Loading shops...</p>
          </div>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                    <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                    <div className="w-1/4 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-0">
      {/* Added to Cart Confirmation */}
      {showAddedToCart && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5" />
          <span className="font-semibold">Added to Cart: {addedItemName}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              {selectedShop ? (
                <button
                  onClick={handleBackToShops}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              ) : null}
              <div className="max-w-[200px] sm:max-w-none">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
                  {selectedShop ? selectedShop.shop_name : 'Construction Shops'}
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm truncate">
                  {selectedShop 
                    ? 'Browse products' 
                    : urlCategory 
                      ? `Showing ${urlCategory} shops` 
                      : 'Find quality construction materials'
                  }
                </p>
              </div>
            </div>

            {/* Cart Button */}
            {selectedShop && (
              <button
                onClick={() => setShowCart(true)}
                className={`relative p-2 rounded-lg transition-colors ${
                  cart.length > 0 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                }`}
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-3 sm:p-4">
        {!selectedShop ? (
          /* Shops List */
          <div className="space-y-4">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {urlCategory ? `${urlCategory} Shops` : '🏪 Construction Shops'}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                {urlCategory 
                  ? `Browse ${urlCategory.toLowerCase()} products` 
                  : 'Choose a shop to browse products'
                }
              </p>
            </div>

            {/* Category Filter for Shops - Mobile & Desktop */}
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm mb-4 sm:mb-6">
              {/* Mobile Filter Header */}
              <div className="sm:hidden flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Filter by Category</h3>
                <button
                  onClick={() => setShowMobileFilter(!showMobileFilter)}
                  className="p-2 bg-gray-100 rounded-lg"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>

              {/* Categories - Hidden on mobile unless expanded */}
              <div className={`${showMobileFilter ? 'block' : 'hidden'} sm:block`}>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowMobileFilter(false);
                      }}
                      className={`px-3 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Shops Grid */}
            {filteredShops.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredShops.map(shop => (
                  <div
                    key={shop.id}
                    onClick={() => handleShopClick(shop)}
                    className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <img
                        src={shop.logo_url || `https://via.placeholder.com/64x64.png?text=${encodeURIComponent(shop.shop_name?.charAt(0) || 'S')}`}
                        alt={shop.shop_name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border flex-shrink-0"
                        onError={(e) => handleShopImageError(e, shop.shop_name)}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-lg mb-1 truncate">{shop.shop_name}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">{shop.about}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="truncate">{shop.location || 'Location not specified'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                            <span>{shop.rating || 'No rating'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="capitalize truncate">{shop.category || 'Uncategorized'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <Store className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No shops found</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
                  {selectedCategory !== 'all' 
                    ? `No ${selectedCategory} shops available at the moment`
                    : 'No shops available in the database'
                  }
                </p>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                  >
                    View All Shops
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Items List for Selected Shop */
          <div className="space-y-4 sm:space-y-6">
            {/* Shop Info */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-start gap-3 sm:gap-4">
                <img
                  src={selectedShop.logo_url || `https://via.placeholder.com/80x80.png?text=${encodeURIComponent(selectedShop.shop_name?.charAt(0) || 'S')}`}
                  alt={selectedShop.shop_name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border flex-shrink-0"
                  onError={(e) => handleShopImageError(e, selectedShop.shop_name)}
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 truncate">{selectedShop.shop_name}</h2>
                  <p className="text-gray-600 text-sm sm:text-base mb-3 line-clamp-2 sm:line-clamp-3">{selectedShop.about}</p>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{selectedShop.location || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                      <span>{selectedShop.rating || 'No rating'} Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="capitalize truncate">{selectedShop.category || 'Uncategorized'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Grid */}
            {loading ? (
              <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                    <div className="w-full h-32 sm:h-48 bg-gray-200 rounded-lg mb-3 sm:mb-4"></div>
                    <div className="space-y-2">
                      <div className="w-3/4 h-3 sm:h-4 bg-gray-200 rounded"></div>
                      <div className="w-1/2 h-2 sm:h-3 bg-gray-200 rounded"></div>
                      <div className="w-1/4 h-4 sm:h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {items.map(item => (
                  <div key={item.id} className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border hover:shadow-md transition-all duration-200">
                    <img
                      src={item.item_image_url}
                      alt={item.item_name}
                      className="w-full h-32 sm:h-48 object-cover rounded-lg mb-3 sm:mb-4"
                      onError={(e) => handleImageError(e, item.item_name)}
                    />
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-1">{item.item_name}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{item.item_description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                        <span className="text-base sm:text-lg font-bold text-gray-900">₹{item.item_price}</span>
                        <span className="text-gray-500 text-xs sm:text-sm hidden sm:inline">/unit</span>
                      </div>
                   <button
                     onClick={() => addToCart(item)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm shadow-md"
                           >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                         <span className="hidden sm:inline">Add to Cart</span>
                       <span className="sm:hidden">Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 text-sm sm:text-base">This shop doesn't have any products listed yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Cart Button for Mobile when items are in cart */}
      {selectedShop && cart.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 sm:hidden">
          <button
            onClick={() => setShowCart(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-semibold"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>View Cart ({getTotalItems()})</span>
          </button>
        </div>
      )}

      {/* Shopping Cart Modal */}
    {/* Shopping Cart Modal */}
{/* Shopping Cart Modal */}
{showCart && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="max-w-[70%]">
            <h2 className="text-lg sm:text-xl font-bold truncate">Your Order</h2>
            <p className="text-blue-100 text-sm sm:text-base truncate">{selectedShop?.shop_name}</p>
          </div>
          <button
            onClick={() => setShowCart(false)}
            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Cart Items - Centered when empty */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col">
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 sm:py-12">
            <ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 text-sm sm:text-base max-w-md">
              Add some products from {selectedShop?.shop_name} to get started
            </p>
            <button
              onClick={() => setShowCart(false)}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setCart([])}
                className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors shadow-sm"
              >
                <X className="w-4 h-4" />
                Clear Cart
              </button>
            </div>
            
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <img
                  src={item.item_image_url}
                  alt={item.item_name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => handleImageError(e, item.item_name)}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.item_name}</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">₹{item.item_price} each</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                    >
                      <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <span className="font-semibold w-6 sm:w-8 text-center text-sm sm:text-base text-gray-900 bg-white border border-gray-300 rounded-md py-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-sm"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  <div className="text-right min-w-16 sm:min-w-20">
                    <p className="font-bold text-gray-900 text-sm sm:text-base">₹{item.item_price * item.quantity}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
    {/* Footer - Alternative Layout */}
{cart.length > 0 && (
  <div className="border-t p-4 sm:p-6 space-y-3 sm:space-y-4">
    <div className="flex justify-between items-center text-base sm:text-lg font-bold">
      <span>Total Amount:</span>
      <span className="flex items-center gap-1">
        <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
        {getTotalPrice()}
      </span>
    </div>
    
    <div className="grid grid-cols-3 gap-3">
      <button
        onClick={() => setCart([])}
        className="bg-gray-500 text-white py-3 px-2 rounded-xl font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center gap-1 text-xs sm:text-sm shadow-md"
      >
        <X className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="truncate">Clear</span>
      </button>
      <button
        onClick={() => window.open(`tel:${mediatorNumber}`, '_self')}
        className="bg-blue-500 text-white py-3 px-2 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 text-xs sm:text-sm shadow-lg"
      >
        <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="truncate">Call</span>
      </button>
      <button
        onClick={handleWhatsAppOrder}
        className="bg-green-500 text-white py-3 px-2 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-1 text-xs sm:text-sm shadow-lg"
      >
        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="truncate">WhatsApp</span>
      </button>
    </div>
    
    <p className="text-center text-xs sm:text-sm text-gray-500">
      Contact us via call or WhatsApp to complete your order
    </p>
  </div>
)}
    
    </div>
  </div>
)}
    
    </div>
  );
}