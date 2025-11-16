import React from "react";
import { supabase } from "@/lib/supabase";

export async function generateStaticParams() {
  const { data } = await supabase.from("shops").select("id, category_id");
  return (
    data?.map((shop) => ({
      categoryId: String(shop.category_id),
      shopId: String(shop.id),
    })) || []
  );
}

export default async function ShopItemsPage({ params }) {
  const { shopId } = await params;

  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("id", shopId)
    .single();

  const { data: items } = await supabase
    .from("items")
    .select("*")
    .eq("shop_id", shopId);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        {shop?.name || "Shop"} – Items
      </h1>

      {!items || items.length === 0 ? (
        <p className="text-center text-gray-500">No items found.</p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <a
              key={item.id}
              href={`/categories/${shop.category_id}/${shopId}/${item.id}`}
              className="block bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all"
            >
              <img
                src={item.image_url || "https://via.placeholder.com/400x300"}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-blue-600 font-bold mt-1">₹{item.price}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
