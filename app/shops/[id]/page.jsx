import React from 'react';
import { supabase } from '../../lib/supabase';

// ✅ Required for "output: export"
export async function generateStaticParams() {
  try {
    const { data } = await supabase.from('shops').select('id').limit(10);
    return data?.map((shop) => ({ id: String(shop.id) })) || [{ id: '1' }];
  } catch (err) {
    console.error('Error fetching shop IDs:', err);
    return [{ id: '1' }];
  }
}

// ✅ Server Component for Static Generation
export default async function ShopDetailsPage({ params }) {
  const { id } = params;

  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('id', id)
    .single();

  if (!shop) {
    return <div className="p-10 text-center">Shop not found</div>;
  }

  const { data: items } = await supabase
    .from('items')
    .select('*')
    .eq('shop_id', id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
        <img
          src={
            shop.banner_url ||
            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=400&fit=crop'
          }
          alt="Shop Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <img
            src={
              shop.logo_url ||
              'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
            }
            alt="Shop Logo"
            className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-full border-4 border-white shadow-lg"
          />
        </div>
      </div>

      {/* Shop Info */}
      <div className="max-w-4xl mx-auto px-6 mt-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{shop.name}</h1>
        <p className="text-gray-600 mt-2">{shop.description}</p>
        <p className="text-gray-500 mt-1">
          📍 {shop.city}, {shop.state}
        </p>
      </div>

      {/* Equipments Section */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Equipments Available
        </h2>

        {!items || items.length === 0 ? (
          <p className="text-center text-gray-500">
            No equipments listed for this shop.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <img
                  src={
                    item.image_url ||
                    'https://via.placeholder.com/400x300?text=No+Image'
                  }
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-blue-600 font-bold">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
