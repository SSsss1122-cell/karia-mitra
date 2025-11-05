'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Building2, Home, Settings, User, Handshake } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LayoutWithNav({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    // ✅ Fixed Capacitor app URL listener with proper URL parsing
    const setupAppUrlListener = async () => {
      try {
        if (typeof window !== 'undefined' && window.Capacitor) {
          const { App } = await import('@capacitor/app');
          
          App.addListener('appUrlOpen', async (data) => {
            console.log('App opened with URL:', data.url);
            
            if (data.url.includes('auth/callback')) {
              try {
                // Parse the URL properly - handle both # and ? parameters
                let url = data.url;
                
                // Replace # with ? for proper parsing (Supabase uses hash fragments)
                if (url.includes('#')) {
                  url = url.replace('#', '?');
                }
                
                const urlObj = new URL(url);
                const access_token = urlObj.searchParams.get('access_token');
                const refresh_token = urlObj.searchParams.get('refresh_token');
                const error_description = urlObj.searchParams.get('error_description');
                
                console.log('Extracted tokens - access_token:', !!access_token, 'refresh_token:', !!refresh_token);
                
                if (error_description) {
                  alert('Login failed: ' + decodeURIComponent(error_description));
                  return;
                }
                
                if (access_token && refresh_token) {
                  // Set session with the tokens
                  const { data: sessionData, error } = await supabase.auth.setSession({
                    access_token,
                    refresh_token
                  });
                  
                  if (error) {
                    console.error('Session set error:', error);
                    alert('Login failed: ' + error.message);
                    return;
                  }
                  
                  if (sessionData.session) {
                    console.log('Session set successfully:', sessionData.session.user.email);
                    setUser(sessionData.session.user);
                    alert('Login successful! 🎉');
                    
                    // Close browser
                    try {
                      const { Browser } = await import('@capacitor/browser');
                      await Browser.close();
                    } catch (e) {
                      console.log('Browser close failed:', e);
                    }
                  }
                } else {
                  console.log('No tokens found in URL');
                  alert('Login failed: No authentication tokens received');
                }
              } catch (error) {
                console.error('Auth callback error:', error);
                alert('Login failed: ' + error.message);
              }
            }
          });
        }
      } catch (error) {
        console.log('Capacitor App not available');
      }
    };

    setupAppUrlListener();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Get user error:', error);
          return;
        }
        console.log('Current user:', user?.email);
        setUser(user);
      } catch (error) {
        console.error('Get user failed:', error);
      }
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setUser(session?.user || null);
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session.user.email);
        setShowProfileMenu(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchClick = () => {
    router.push('/search');
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      alert(authMode === 'login' ? 'Logged in successfully!' : 'Account created!');
      setShowProfileMenu(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log('Google login clicked');
      
      const isCapacitor = typeof window !== 'undefined' && window.Capacitor;
      console.log('isCapacitor:', isCapacitor);
      
      // ✅ FIX: Use different redirect URLs for web vs mobile
      const redirectTo = isCapacitor 
        ? 'kariamitra://auth/callback' // Mobile app
        : `${window.location.origin}/auth/callback`; // Web

      console.log('Redirect URL:', redirectTo);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          skipBrowserRedirect: isCapacitor
        }
      });
      
      if (error) {
        console.error('Google login error:', error);
        throw error;
      }
      
      // For mobile, open the URL in browser
      if (isCapacitor && data?.url) {
        try {
          const { Browser } = await import('@capacitor/browser');
          console.log('Opening OAuth URL in browser:', data.url);
          await Browser.open({ url: data.url });
        } catch (browserError) {
          console.error('Browser plugin error:', browserError);
          // Fallback - let Supabase handle the redirect
          const { data: fallbackData, error: fallbackError } = await supabase.auth.signInWithOAuth({
            provider: 'google'
          });
          if (fallbackError) throw fallbackError;
        }
      }
      
      console.log('Google login initiated successfully');
      setShowProfileMenu(false);
      
    } catch (err) {
      console.error('Google login failed:', err);
      alert('Google login failed: ' + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setShowProfileMenu(false);
      alert('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed: ' + error.message);
    }
  };

  // ✅ FIX: Get user avatar with proper fallback for mobile
  const getUserAvatar = () => {
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    if (user?.email) {
      // Generate a colorful placeholder based on email
      const name = user.user_metadata?.name || user.email.split('@')[0];
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0e1e55&color=fff&size=128`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#1e3a8a] to-[#3730a3] rounded-full blur-3xl opacity-10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#1e40af] to-[#1d4ed8] rounded-full blur-3xl opacity-10"></div>
      </div>

      <div className="relative z-10">
        {/* Header - Fixed with safe area for mobile */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 pt-safe">
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              {/* Logo */}
              <div
                className="flex items-center space-x-3 flex-shrink-0 cursor-pointer"
                onClick={() => router.push('/')}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] rounded-lg flex items-center justify-center shadow-lg">
                  <Building2 className="text-white" size={18} />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] bg-clip-text text-transparent">
                    Karia Mitra
                  </h1>
                  <p className="text-gray-500 text-xs hidden sm:block">Construction Pro</p>
                </div>
              </div>

              {/* Search & Profile */}
              <div className="flex items-center space-x-3 relative">
                <button
                  onClick={handleSearchClick}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-xl px-3 py-2 transition-all duration-300 hover:scale-105"
                >
                  <Search size={16} className="text-gray-600" />
                  <span className="text-gray-600 font-medium text-sm hidden sm:block">Search</span>
                </button>

                <div
                  className="relative"
                  ref={menuRef}
                >
                  <button
                    onClick={() => setShowProfileMenu((prev) => !prev)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] rounded-xl px-3 py-2 shadow-lg hover:scale-105 transition-transform duration-300"
                  >
                    {/* ✅ FIX: Avatar with proper fallback for mobile */}
                    {user ? (
                      <img
                        src={getUserAvatar()}
                        alt="avatar"
                        className="w-6 h-6 rounded-full border-2 border-white"
                        onError={(e) => {
                          // Fallback if image fails to load (common in mobile)
                          const name = user.user_metadata?.name || user.email?.split('@')[0] || 'U';
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0e1e55&color=fff&size=64`;
                        }}
                      />
                    ) : (
                      <User className="text-white" size={16} />
                    )}
                    <span className="text-white font-medium text-sm hidden sm:block">
                      {user ? user.user_metadata?.name?.split(' ')[0] || user.email?.split('@')[0] || 'Account' : 'Profile'}
                    </span>
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
                      {user ? (
                        <div className="space-y-3 text-center">
                          <div className="flex items-center justify-center space-x-3">
                            {/* ✅ FIX: Avatar in profile menu with fallback */}
                            <img
                              src={getUserAvatar()}
                              alt="avatar"
                              className="w-12 h-12 rounded-full border-2 border-[#0e1e55]"
                              onError={(e) => {
                                const name = user.user_metadata?.name || user.email?.split('@')[0] || 'U';
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0e1e55&color=fff&size=96`;
                              }}
                            />
                            <div className="text-left">
                              <p className="text-sm font-bold text-gray-900 truncate max-w-[120px]">
                                {user.user_metadata?.name || 'User'}
                              </p>
                              <p className="text-xs text-gray-600 truncate max-w-[120px]">{user.email}</p>
                            </div>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-all duration-200 text-sm"
                          >
                            Logout
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* ✅ FIX: Visible text with proper contrast */}
                          <h3 className="text-center text-base font-bold text-gray-900 mb-1">
                            {authMode === 'login' ? 'Welcome Back' : 'Join Us'}
                          </h3>
                          
                          {/* Email Login Form */}
                          <form onSubmit={handleAuth} className="space-y-3">
                            <div>
                              <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#0e1e55] focus:border-transparent"
                                required
                              />
                            </div>
                            
                            <div>
                              <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#0e1e55] focus:border-transparent"
                                required
                              />
                            </div>
                            
                            <button
                              type="submit"
                              disabled={loading}
                              className="w-full bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] text-white font-medium py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 text-sm"
                            >
                              {loading
                                ? 'Please wait...'
                                : authMode === 'login'
                                ? 'Sign In'
                                : 'Create Account'}
                            </button>
                          </form>

                          {/* Divider */}
                          <div className="flex items-center my-2">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="px-2 text-xs text-gray-500">OR</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                          </div>

                          {/* Google Login Button */}
                          <button
                            onClick={handleGoogleLogin}
                            className="w-full border border-gray-300 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all duration-200 text-sm"
                          >
                            <img
                              src="https://www.svgrepo.com/show/475656/google-color.svg"
                              alt="Google"
                              className="w-4 h-4"
                            />
                            <span className="font-medium text-gray-700">
                              Continue with Google
                            </span>
                          </button>

                          {/* Switch between login/signup */}
                          <p className="text-center text-xs text-gray-600 mt-2">
                            {authMode === 'login' 
                              ? "Don't have an account? " 
                              : "Already have an account? "}
                            <span
                              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                              className="text-[#0e1e55] font-semibold cursor-pointer hover:underline"
                            >
                              {authMode === 'login' ? 'Sign up' : 'Sign in'}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Adjusted for header and bottom nav */}
        <main className="pt-16 pb-20 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Bottom Navigation - Reduced gap */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50">
          <div className="flex items-center justify-around p-2">
            {[
              { icon: <Home size={18} />, name: 'Home', path: '/' },
              { icon: <Handshake size={18} />, name: 'Partner', path: '/partner' },
              { icon: <User size={18} />, name: 'Profile', path: '/profile' },
              { icon: <Settings size={18} />, name: 'Settings', path: '/settings' },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center p-1 flex-1 transition-all duration-300 min-w-0 ${
                  pathname === item.path 
                    ? 'text-[#0e1e55] transform scale-105' 
                    : 'text-gray-600 hover:text-[#0e1e55]'
                }`}
              >
                <div className={`p-1 rounded-lg transition-colors ${
                  pathname === item.path ? 'bg-[#0e1e55]/10' : ''
                }`}>
                  {item.icon}
                </div>
                <span className="text-xs font-medium mt-0.5 truncate w-full text-center">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}