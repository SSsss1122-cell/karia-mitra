"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch current user session
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 text-center w-80">
        {user.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt="Profile avatar"
            className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-[#0e1e55]"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        )}
        <h1 className="text-xl font-semibold text-gray-900">
          {user.user_metadata?.full_name || "User"}
        </h1>
        <p className="text-gray-500 text-sm mt-2">{user.email}</p>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/";
          }}
          className="mt-6 bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-300 w-full"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}