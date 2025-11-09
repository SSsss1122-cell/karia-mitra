'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Star, User, Wrench, Building, HardHat, Users, Zap, Shield, Bell, Download, X, Gift, Share2, Rocket, Hammer, Home, TrendingUp, Award } from 'lucide-react';
import { supabase } from './lib/supabase';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState(null);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [currentAppVersion, setCurrentAppVersion] = useState('1.1.0');
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
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

  const buildingSteps = [
    {
      icon: <Home className="w-8 h-8 text-white" />,
      title: "Plan Your Project",
      description: "Define your construction requirements and budget",
      gradient: "from-blue-500 to-cyan-500",
      step: "01",
      path: '/services/architect', // Goes to architecture page
      buttonText: "Find Architects"
    },
    {
      icon: <Hammer className="w-8 h-8 text-white" />,
      title: "Find Professionals",
      description: "Connect with verified contractors and engineers",
      gradient: "from-purple-500 to-pink-500",
      step: "02",
      path: '/services/builders', // Goes to builders page
      buttonText: "Find Builders"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      title: "Start Building",
      description: "Begin your construction journey with experts",
      gradient: "from-orange-500 to-red-500",
      step: "03",
      path: '/services/contractors', // Goes to contractors page
      buttonText: "Find Contractors"
    },
    {
      icon: <Award className="w-8 h-8 text-white" />,
      title: "Complete & Celebrate",
      description: "Finish your dream project successfully",
      gradient: "from-green-500 to-emerald-500",
      step: "04",
      path: '/services/labour', // Goes to labour page
      buttonText: "Find Labor"
    }
  ];

  const referBenefits = [
    {
      icon: "💰",
      title: "Earn ₹500",
      description: "For every friend who signs up"
    },
    {
      icon: "🎁",
      title: "Bonus ₹1000",
      description: "When your friend completes first project"
    },
    {
      icon: "🏆",
      title: "Exclusive Rewards",
      description: "Special gifts for top referrers"
    }
  ];

  // ✅ Function to get current app version from localStorage or use default
  const getCurrentAppVersion = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('currentAppVersion') || '1.1.0';
    }
    return '1.1.0';
  };

  // ✅ Function to save current app version
  const saveCurrentAppVersion = (version) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentAppVersion', version);
      setCurrentAppVersion(version);
    }
  };

  // ✅ Enhanced App update checker with proper version comparison
  const checkForUpdates = async () => {
    try {
      setIsCheckingUpdate(true);
      const currentVersion = getCurrentAppVersion();
      console.log('🔍 Checking for updates... Current version:', currentVersion);
      
      const { data, error } = await supabase
        .from('app_updates')
        .select('*')
        .eq('is_active', true)
        .order('version_code', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Supabase error:', error);
        return;
      }

      if (data) {
        console.log('📱 Latest version from Supabase:', data.version_name);
        console.log('🔄 Comparing versions:', currentVersion, 'vs', data.version_name);
        
        // ✅ Compare versions - show update only if different
        if (data.version_name !== currentVersion) {
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
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  // Check for updates on component mount
  useEffect(() => {
    // Initialize current version from localStorage
    const savedVersion = getCurrentAppVersion();
    setCurrentAppVersion(savedVersion);
    
    // Check for updates
    checkForUpdates();

    // Set up periodic update checks (every 5 minutes)
    const updateInterval = setInterval(checkForUpdates, 5 * 60 * 1000);
    
    return () => clearInterval(updateInterval);
  }, []);

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
      // ✅ Update the current version in localStorage and state
      saveCurrentAppVersion(updateInfo.version_name);
      
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
      setShowUpdatePrompt(false);
      window.open(updateInfo.apk_url, '_blank');
      
      // ✅ Re-check updates after a delay to confirm version update
      setTimeout(() => {
        checkForUpdates();
      }, 2000);
    }
  };

  const handleClosePrompt = () => {
    setShowUpdatePrompt(false);
  };

  const handleManualUpdateCheck = () => {
    checkForUpdates();
  };

  const handleReferAndEarn = () => {
    // Implement refer and earn logic
    alert('Refer & Earn feature coming soon! Share with your friends and earn rewards.');
  };

  const handleStartBuilding = () => {
    router.push('/services');
  };

  const handleBuildingStepClick = (path) => {
    router.push(path);
  };

  return (
    <div className="pb-8 pt-8">
      {/* 🆕 Centered Update Prompt - Shows when versions don't match */}
      {showUpdatePrompt && updateInfo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-white to-gray-50/95 backdrop-blur-lg shadow-2xl border border-gray-200/80 rounded-2xl w-full max-w-md mx-auto transform transition-all duration-500 scale-95 animate-in slide-in-from-bottom-8">
            {/* Header */}
            <div className="relative p-6 border-b border-gray-200/60">
              {/* Close Button */}
              <button
                onClick={handleClosePrompt}
                className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
              >
                <X className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
              </button>

              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Download className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      v{updateInfo.version_name}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      New Version
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
            </div>

            {/* Release Notes */}
            <div className="p-6 border-b border-gray-200/60">
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                {updateInfo.release_notes || 'Experience improved performance, new features, and bug fixes for better app experience.'}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Enhanced performance & stability</span>
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
            </div>

            {/* Action Buttons */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-3">
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

              {/* Manual update check button */}
              <button
                onClick={handleManualUpdateCheck}
                disabled={isCheckingUpdate}
                className="w-full mt-3 text-xs text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
              >
                {isCheckingUpdate ? 'Checking for updates...' : 'Check for updates manually'}
              </button>
            </div>

            {/* Progress Bar Animation */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 rounded-b-2xl">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Slider Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
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

      {/* Start Building Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              🚀 Start Building Your Dream
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Follow these simple steps to turn your vision into reality with expert guidance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {buildingSteps.map((step, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100 overflow-hidden cursor-pointer"
                onClick={() => handleBuildingStepClick(step.path)}
              >
                {/* Step Number */}
                <div className="absolute top-4 right-4">
                  <span className="text-4xl font-bold text-gray-100 group-hover:text-gray-200 transition-colors">
                    {step.step}
                  </span>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{step.description}</p>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuildingStepClick(step.path);
                  }}
                  className={`w-full bg-gradient-to-r ${step.gradient} text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 transform text-sm`}
                >
                  {step.buttonText}
                </button>

                {/* Hover Effect Line */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${step.gradient} w-0 group-hover:w-full transition-all duration-500`}></div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={handleStartBuilding}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg py-4 px-12 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 transform"
            >
              🏗️ Start Your Project Now
            </button>
          </div>
        </div>
      </section>

      {/* Refer & Earn Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white rounded-full"></div>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  🎁 Refer & Earn
                </h2>
                <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                  Share BuildZone with your friends and earn amazing rewards!
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {referBenefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-3xl mb-3">{benefit.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-purple-100">{benefit.description}</p>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleReferAndEarn}
                  className="bg-white text-purple-600 font-bold py-4 px-8 rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center space-x-3"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Invite Friends Now</span>
                </button>
                
                <button
                  onClick={() => router.push('/rewards')}
                  className="border-2 border-white text-white font-bold py-4 px-8 rounded-2xl hover:bg-white hover:text-purple-600 transition-all duration-300"
                >
                  View Rewards
                </button>
              </div>

              {/* Additional Info */}
              <div className="text-center mt-6">
                <p className="text-purple-200 text-sm">
                  ✨ No limit on earnings • Instant payouts • Exclusive bonuses
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer showing current app version */}
      <footer className="mt-10 mb-4 text-gray-500 text-sm text-center">
        <div className="flex flex-col items-center space-y-2">
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
          <button
            onClick={handleManualUpdateCheck}
            disabled={isCheckingUpdate}
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
          >
            {isCheckingUpdate ? 'Checking for updates...' : 'Check for updates'}
          </button>
        </div>
      </footer>
    </div>
  );
}