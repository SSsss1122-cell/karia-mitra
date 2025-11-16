import React from "react";
import { supabase } from "@/lib/supabase";


export async function generateStaticParams() {
  const { data } = await supabase.from("items").select("id, shop_id, category_id");
  return (
    data?.map((item) => ({
      categoryId: String(item.category_id),
      shopId: String(item.shop_id),
      itemId: String(item.id),
    })) || []
  );
}

export default async function ItemDetailPage({ params }) {
  const { itemId } = await params;

  const { data: item } = await supabase
    .from("items")
    .select("*")
    .eq("id", itemId)
    .single();

  if (!item)
    return <div className="p-10 text-center">Item not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <img
          src={item.image_url || "https://via.placeholder.com/400x300"}
          alt={item.name}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
        <p className="text-gray-600 mb-4">{item.description}</p>
        <p className="text-blue-600 font-bold text-2xl">₹{item.price}</p>
      </div>
    </div>
  );
}
