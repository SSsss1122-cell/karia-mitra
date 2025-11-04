'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Star, User, Wrench, Building, HardHat, Users, Zap, Shield, Bell, Download, X } from 'lucide-react';
import { supabase } from './lib/supabase';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState(null);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [currentAppVersion, setCurrentAppVersion] = useState('1.1.0'); // ✅ Current app version
  const router = useRouter();

  // Professional categories with beautiful gradient colors
  const professionalServices = [
    { 
      icon: <User className="text-white" size={20} />, 
      name: 'Contractors', 
      gradient: 'from-[#0e1e55] to-[#1e3a8a]',
      path: '/services/contractors'
    },
    { 
      icon: <Wrench className="text-white" size={20} />, 
      name: 'Engineers', 
      gradient: 'from-[#0e1e55] to-[#3730a3]',
      path: '/services/engineers'
    },
    { 
      icon: <Building className="text-white" size={20} />, 
      name: 'Architects', 
      gradient: 'from-[#0e1e55] to-[#1e40af]',
      path: '/services/architect'
    },
    { 
      icon: <HardHat className="text-white" size={20} />, 
      name: 'Builders', 
      gradient: 'from-[#0e1e55] to-[#1d4ed8]',
      path: '/services/builders'
    },
    { 
      icon: <Users className="text-white" size={20} />, 
      name: 'Labor', 
      gradient: 'from-[#0e1e55] to-[#2563eb]',
      path: '/services/labour'
    }
  ];

  const leaseCategories = [
    {
      id: 1,
      name: "Sanitation",
      subtitle: "Premium sanitation equipment & tools for all your needs",
      image: "/images/sanitation.jpg",
      gradient: "from-[#0e1e55] to-[#1e3a8a]",
      path: "./shops"
    },
    {
      id: 2,
      name: "Hardware", 
      subtitle: "Professional tools & equipment for construction",
      image:  "/images/hardware.jpg",
      gradient: "from-[#0e1e55] to-[#3730a3]",
      path: "/shops"
    },
    {
      id: 3,
      name: "Aggregates",
      subtitle: "Quality construction materials and aggregates",
      image: "/images/aggregates.jpg",
      gradient: "from-[#0e1e55] to-[#1e40af]",
      path: "/shops"
    },
    {
      id: 4,
      name: "Cladding",
      subtitle: "Premium building and cladding materials",
      image:  "/images/claddding.jpg",
      gradient: "from-[#0e1e55] to-[#1d4ed8]",
      path: "/shops"
    }
  ];

  const slides = [
    { 
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=400&fit=crop", 
      title: "Professional Construction", 
      description: "Quality workmanship guaranteed for all projects",
      gradient: "from-[#0e1e55]/80 to-[#1e3a8a]/80"
    },
    { 
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop", 
      title: "Expert Engineering", 
      description: "Precision and innovation in every project",
      gradient: "from-[#0e1e55]/80 to-[#3730a3]/80"
    },
    { 
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHvHTBgyYs44qkZOBestYRswZ8qf3JKT2scA&s",
      title: "Modern Architecture", 
      description: "Innovative design solutions for modern living",
      gradient: "from-[#0e1e55]/80 to-[#1d4ed8]/80"
    }
  ];

  const bestDeals = [
    { 
      id: 1, 
      name: "Cement", 
      image: "/images/cement.jpg",
      rating: 4.8,
      badge: "HOT"
    },
    { 
      id: 2, 
      name: "Paint", 
      image: "/images/paint.jpg",
      rating: 4.9,
      badge: "NEW"
    },
    { 
      id: 3, 
      name: "Faviocl", 
      image: "/images/faviocl.jpg",
      rating: 4.7,
      badge: "SALE"
    },
    { 
      id: 4, 
      name: "Concrete Mixer", 
      image: "/images/concrete-mixer.jpg",
      rating: 4.6,
      badge: "DEAL"
    }
  ];

  // ✅ Enhanced App update checker with proper version comparison
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        console.log('🔍 Checking for updates... Current version:', currentAppVersion);
        
        const { data, error } = await supabase
          .from('app_updates')
          .select('*')
          .eq('is_active', true) // ✅ Only check active updates
          .order('version_code', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Supabase error:', error);
          return;
        }

        if (data) {
          console.log('📱 Latest version from Supabase:', data.version_name);
          console.log('🔄 Comparing versions:', currentAppVersion, 'vs', data.version_name);
          
          // ✅ Compare versions - show update only if different
          if (data.version_name !== currentAppVersion) {
            console.log('🚨 Update available!');
            setUpdateInfo(data);
            setShowUpdatePrompt(true);
          } else {
            console.log('✅ App is up to date');
            setUpdateInfo(null);
            setShowUpdatePrompt(false);
          }
        } else {
          console.log('📭 No active updates found in database');
          setUpdateInfo(null);
          setShowUpdatePrompt(false);
        }
      } catch (err) {
        console.error('Update check error:', err.message);
        setUpdateInfo(null);
        setShowUpdatePrompt(false);
      }
    };

    checkForUpdates();
  }, [currentAppVersion]);

  // Check user session on component mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleImageError = (e, fallbackText) => {
    console.error(`Image failed to load: ${fallbackText}`);
    e.target.style.display = 'none';
  };

  const handleUpdateClick = () => {
    if (updateInfo?.apk_url) {
      // ✅ Increment download count in database
      const incrementDownloadCount = async () => {
        try {
          await supabase
            .from('app_updates')
            .update({ download_count: (updateInfo.download_count || 0) + 1 })
            .eq('id', updateInfo.id);
        } catch (error) {
          console.error('Error updating download count:', error);
        }
      };
      
      incrementDownloadCount();
      window.open(updateInfo.apk_url, '_blank');
    }
  };

  const handleClosePrompt = () => {
    setShowUpdatePrompt(false);
  };

  return (
    <div className="pb-8">
      {/* 🆕 Enhanced Update Prompt - Only shows when versions don't match */}
      {showUpdatePrompt && updateInfo && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 z-50 animate-in slide-in-from-bottom-full duration-500">
          <div className="bg-gradient-to-br from-white to-gray-50/95 backdrop-blur-lg shadow-2xl border border-gray-200/80 rounded-2xl p-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/5 to-cyan-500/5 rounded-full -translate-y-8 translate-x-8"></div>
            
            {/* Close Button */}
            <button
              onClick={handleClosePrompt}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
            >
              <X className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
            </button>

            {/* Header */}
            <div className="flex items-start space-x-4 mb-4 relative z-10">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Download className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    v{updateInfo.version_name}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    New
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  Update Available! 🚀
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Current: v{currentAppVersion} → Latest: v{updateInfo.version_name}
                </p>
              </div>
            </div>

            {/* Release Notes */}
            <div className="mb-5 relative z-10">
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                {updateInfo.release_notes || 'Experience improved performance, new features, and bug fixes for better app experience.'}
              </p>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Enhanced performance</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>New features added</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Bug fixes & improvements</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 relative z-10">
              <button
                onClick={handleUpdateClick}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Update Now</span>
              </button>
              
              <button
                onClick={handleClosePrompt}
                className="px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-all duration-200"
              >
                Later
              </button>
            </div>

            {/* Progress Bar Animation */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse"></div>
            </div>
          </div>

          {/* Floating notification badge */}
          <div className="absolute -top-2 -right-2">
            <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-bounce">
              !
            </div>
          </div>
        </div>
      )}

      {/* Hero Slider Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 pt-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-48 sm:h-64 lg:h-80 xl:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl group">
            <div 
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div key={index} className="w-full flex-shrink-0 h-full relative">
                  <img 
                    src={slide.image} 
                    alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    onError={(e) => handleImageError(e, slide.title)}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} mix-blend-multiply`}></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-3 drop-shadow-2xl">{slide.title}</h2>
                    <p className="text-sm sm:text-base lg:text-lg xl:text-xl opacity-90 drop-shadow-lg">{slide.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg sm:shadow-2xl transition-all hover:bg-white/30 hover:scale-110 border border-white/30"
            >
              <ChevronLeft size={16} className="text-white" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg sm:shadow-2xl transition-all hover:bg-white/30 hover:scale-110 border border-white/30"
            >
              <ChevronRight size={16} className="text-white" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white scale-125 shadow-lg' : 'bg-white/50 hover:bg-white/80'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Professional Services Section - Below Hero */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">👷 Professional Services</h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Connect with trusted professionals</p>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {professionalServices.map((service, index) => (
              <button
                key={index}
                onClick={() => router.push(service.path)}
                className="group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 overflow-hidden flex flex-col items-center"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <div className={`relative z-10 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${service.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  {service.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm group-hover:text-gray-800 transition-colors text-center leading-tight">
                  {service.name}
                </h3>
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${service.gradient} group-hover:w-3/4 transition-all duration-300 rounded-full`}></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Best Deals Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">🔥 Hot Deals</h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Premium equipment available now</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#0e1e55] via-[#1e3a8a] to-[#3730a3] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl sm:shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -right-10 sm:-top-20 sm:-right-20 w-20 h-20 sm:w-40 sm:h-40 bg-white rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 sm:-bottom-20 sm:-left-20 w-20 h-20 sm:w-40 sm:h-40 bg-white rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {bestDeals.map((deal) => (
                  <div 
                    key={deal.id}
                    className="group bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer border border-white/30"
                  >
                    <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-20">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${
                        deal.badge === 'HOT' ? 'bg-red-500' :
                        deal.badge === 'NEW' ? 'bg-blue-500' :
                        deal.badge === 'SALE' ? 'bg-green-500' : 'bg-purple-500'
                      }`}>
                        {deal.badge}
                      </span>
                    </div>
                    
                    <div className="relative h-32 sm:h-36 lg:h-40 rounded-lg sm:rounded-xl overflow-hidden mb-4 sm:mb-5 bg-gray-50">
                      <img 
                        src={deal.image} 
                        alt={deal.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 p-2"
                        onError={(e) => handleImageError(e, deal.name)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2 text-center">{deal.name}</h3>
                    <div className="flex items-center justify-center space-x-1">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className="text-sm sm:text-base text-gray-600 font-medium">{deal.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Categories Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              📦 Equipment Categories
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
              Rent or buy quality construction equipment
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {leaseCategories.map((category) => {
              let categoryId;
              if (category.name.toLowerCase().includes("sanitation")) categoryId = 1;
              else if (category.name.toLowerCase().includes("aggregate")) categoryId = 2;
              else if (category.name.toLowerCase().includes("cladding")) categoryId = 3;
              else if (category.name.toLowerCase().includes("hardware")) categoryId = 6;

              return (
                <div
                  key={category.name}
                  onClick={() => router.push(`/shops/${categoryId}`)}
                  className="group relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer border border-gray-100 overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  ></div>

                  <div className="flex items-center space-x-4 sm:space-x-6">
                    <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 relative">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover rounded-xl sm:rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => handleImageError(e, category.name)}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-gray-800 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
                        {category.subtitle}
                      </p>
                      <div className="flex">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/shops/${categoryId}`);
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base w-full text-center"
                        >
                          Explore Shops
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer showing current app version */}
      <footer className="mt-10 mb-4 text-gray-500 text-sm text-center">
        <p>
          App Version:&nbsp;
          <span className="font-medium text-gray-700">
            v{currentAppVersion}
          </span>
          {updateInfo && (
            <span className="text-xs text-gray-400 ml-2">
              (Latest: v{updateInfo.version_name})
            </span>
          )}
        </p>
      </footer>
    </div>
  );
}