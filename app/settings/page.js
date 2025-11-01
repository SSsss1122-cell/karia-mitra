"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Moon, Sun, Bell, Lock, Trash2, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <p>Please log in to access settings.</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-b from-gray-50 to-white text-gray-800"
      }`}
    >
      <div className="max-w-md mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="text-blue-500" size={24} />
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>

        {/* Theme Section */}
        <div
          className={`rounded-2xl p-4 mb-5 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow`}
        >
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Moon size={18} /> Appearance
          </h2>
          <div className="flex justify-between items-center">
            <p className="text-sm">Dark Mode</p>
            <button
              onClick={handleThemeToggle}
              className={`relative w-12 h-6 rounded-full transition ${
                darkMode ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition ${
                  darkMode ? "right-0.5" : "left-0.5"
                }`}
              ></span>
            </button>
          </div>
        </div>

        {/* Notifications Section */}
        <div
          className={`rounded-2xl p-4 mb-5 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow`}
        >
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Bell size={18} /> Notifications
          </h2>
          <div className="flex justify-between items-center">
            <p className="text-sm">Allow Notifications</p>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-12 h-6 rounded-full transition ${
                notifications ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition ${
                  notifications ? "right-0.5" : "left-0.5"
                }`}
              ></span>
            </button>
          </div>
        </div>

        {/* Account Section */}
        <div
          className={`rounded-2xl p-4 mb-5 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow`}
        >
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Lock size={18} /> Account
          </h2>
          <button
            onClick={() => alert("Password change feature coming soon!")}
            className="w-full text-left text-sm bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition mb-3"
          >
            Change Password
          </button>
          <button
            onClick={() => alert("Delete account feature coming soon!")}
            className="w-full text-left text-sm bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition flex items-center gap-2 justify-center"
          >
            <Trash2 size={16} /> Delete Account
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={handleSignOut}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-xl transition"
        >
          <LogOut size={18} /> Sign Out
        </button>

        <p className="text-center mt-6 text-sm text-gray-400">
          Signed in as <span className="font-medium">{user.email}</span>
        </p>
      </div>
    </div>
  );
}
