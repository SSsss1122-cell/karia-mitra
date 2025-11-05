'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Shield,
  TrendingUp,
  Phone,
  UserCheck,
  Mail,
  Briefcase,
  Award,
  CheckCircle,
  X,
  ArrowRight,
  Filter,
  MessageCircle,
  Calendar,
  Zap,
  BadgeCheck,
  Sparkles,
  Heart,
  Users,
  Target
} from 'lucide-react';

export default function LabourPage() {
  const router = useRouter();
  const [labours, setLabours] = useState([]);
  const [filteredLabours, setFilteredLabours] = useState([]);
  const [selectedLabour, setSelectedLabour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isBusinessHours, setIsBusinessHours] = useState(false);

  // Support contact details
  const supportContact = {
    phone: '9480072737',
    name: 'Karia Mitra Support'
  };

  // Filter types with all worker categories
  const filterTypes = [
    { key: 'all', label: 'All Workers' },
    { key: 'masonry', label: 'Masonry' },
    { key: 'carpentry', label: 'Carpentry' },
    { key: 'plumbing', label: 'Plumbing' },
    { key: 'electrical', label: 'Electrical' },
    { key: 'painting', label: 'Painting' },
    { key: 'welding', label: 'Welding' },
    { key: 'carpenter', label: 'Carpenter' }
  ];

  // Check if current time is within business hours (9 AM to 7 PM)
  useEffect(() => {
    const checkBusinessHours = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      
      // Business hours: Monday to Saturday, 9 AM to 7 PM
      const isWeekday = currentDay >= 1 && currentDay <= 6;
      const isBusinessTime = currentHour >= 9 && currentHour < 19;
      
      setIsBusinessHours(isWeekday && isBusinessTime);
    };

    checkBusinessHours();
    // Check every minute to update status
    const interval = setInterval(checkBusinessHours, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchLabours();
  }, []);

  const fetchLabours = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('labours')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      setLabours(data || []);
      setFilteredLabours(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching labours:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Apply filters when activeFilter changes
  useEffect(() => {
    const filterWorkers = () => {
      if (activeFilter === 'all') {
        setFilteredLabours(labours);
      } else {
        const filtered = labours.filter(worker => {
          if (!worker.expertise) return false;
          
          const expertise = worker.expertise.toLowerCase();
          
          switch (activeFilter) {
            case 'masonry':
              return expertise.includes('masonry') || expertise.includes('mason');
            case 'carpentry':
              return expertise.includes('carpentry');
            case 'plumbing':
              return expertise.includes('plumbing') || expertise.includes('plumber');
            case 'electrical':
              return expertise.includes('electrical') || expertise.includes('electrician');
            case 'painting':
              return expertise.includes('painting') || expertise.includes('painter');
            case 'welding':
              return expertise.includes('welding') || expertise.includes('welder');
            case 'carpenter':
              return expertise.includes('carpenter') || expertise.includes('carpentry');
            default:
              return true;
          }
        });
        setFilteredLabours(filtered);
      }
    };

    filterWorkers();
  }, [activeFilter, labours]);

  const handleBookWorker = (worker) => {
    setSelectedLabour(worker);
    setShowBookingModal(true);
  };

  const handleDirectWhatsApp = () => {
    if (!selectedLabour) return;

    const message = `👷 *Direct Booking - ${selectedLabour.name}* 👷

Hello ${selectedLabour.name}! 

I found your profile on Karia Mitra and I'm interested in your ${selectedLabour.expertise} services.

🏗️ *Project Details:*
[Please share your project requirements]

📞 *My Contact:* [Your phone number]
📍 *Location:* [Your location]

Please let me know your availability and rates. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${selectedLabour.number}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setSelectedLabour(null);
  };

  const handleDirectCall = () => {
    if (!selectedLabour?.number) {
      alert('Phone number not available for this worker.');
      return;
    }
    window.location.href = `tel:${selectedLabour.number}`;
  };

  const handleWhatsAppBooking = () => {
    if (!selectedLabour) return;

    const message = `🚀 *Booking Request - Karia Mitra* 🚀

👷 *I want to book a worker:*
• *Worker:* ${selectedLabour.name}
• *Expertise:* ${selectedLabour.expertise || 'Skilled Worker'}
• *Rating:* ${selectedLabour.rating || 'New'} ⭐
• *Daily Rate:* ${selectedLabour.rate ? `₹${selectedLabour.rate}/day` : 'Not specified'}

🏗️ *Work Details:* [Please share your work requirements]

📞 *My Contact:* [Your phone number]

📍 *Work Location:* [Your location]

I found this skilled worker on Karia Mitra and would like to proceed with the booking!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${supportContact.phone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setShowBookingModal(false);
    setSelectedLabour(null);
  };

  const handleCallSupport = () => {
    window.location.href = `tel:${supportContact.phone}`;
  };

  // Function to get availability badge color
  const getAvailabilityBadge = (worker) => {
    if (!worker.is_active) return { color: 'bg-red-100 text-red-800 border-red-200', text: 'Not Available' };
    if (isBusinessHours) return { color: 'bg-green-100 text-green-800 border-green-200', text: 'Available Now' };
    return { color: 'bg-amber-100 text-amber-800 border-amber-200', text: 'Available' };
  };

  // Function to get expertise badge color
  const getExpertiseColor = (expertise) => {
    const colors = {
      masonry: 'from-orange-500 to-red-500',
      carpentry: 'from-amber-500 to-orange-500',
      plumbing: 'from-blue-500 to-cyan-500',
      electrical: 'from-yellow-500 to-amber-500',
      painting: 'from-purple-500 to-pink-500',
      welding: 'from-red-500 to-pink-500',
      carpenter: 'from-amber-500 to-orange-500',
      default: 'from-gray-500 to-gray-700'
    };
    
    const lowerExpertise = expertise?.toLowerCase() || '';
    if (lowerExpertise.includes('mason')) return colors.masonry;
    if (lowerExpertise.includes('carpent')) return colors.carpentry;
    if (lowerExpertise.includes('plumb')) return colors.plumbing;
    if (lowerExpertise.includes('electric')) return colors.electrical;
    if (lowerExpertise.includes('paint')) return colors.painting;
    if (lowerExpertise.includes('weld')) return colors.welding;
    return colors.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]">
        {/* Loading Skeleton */}
        <div className="w-full bg-gray-200 h-1.5">
          <div className="h-full bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] animate-pulse"></div>
        </div>

        {/* Header Skeleton */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="space-y-2">
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Skeleton */}
        <div className="px-4 py-6">
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                    <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                    <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] text-white rounded-lg hover:opacity-90 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]">
      {/* Header - Mobile Optimized */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-[#0e1e55]/10 rounded-lg">
                  <UserCheck className="w-5 h-5 text-[#0e1e55]" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    Skilled Workers
                  </h1>
                  <p className="text-gray-600 text-xs">
                    {isBusinessHours ? 'Direct contact available' : 'Book via support'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500 bg-[#0e1e55]/5 px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>{filteredLabours.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Business Hours Banner */}
      {!isBusinessHours && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="px-3 py-2">
            <div className="flex items-center justify-center space-x-2 text-xs text-amber-800">
              <Clock className="w-3 h-3" />
              <span>Business Hours: Mon-Sat, 9 AM - 7 PM. Outside hours, bookings go through support.</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="px-3 py-4">
        <div className="mb-4">
          <h2 className="text-base font-bold text-gray-900 mb-1">
            Available Workers
          </h2>
          <p className="text-gray-600 text-xs">
            {isBusinessHours 
              ? 'Direct contact available during business hours' 
              : 'Book through support outside business hours'
            }
          </p>
        </div>

        {/* Filter Buttons - Scrollable */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-600">Filter by:</span>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {filterTypes.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border whitespace-nowrap ${
                  activeFilter === filter.key
                    ? 'bg-[#0e1e55] text-white border-[#0e1e55] shadow-md transform scale-105'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filter Count */}
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
          <span>Showing</span>
          <span className="font-semibold text-[#0e1e55]">{filteredLabours.length}</span>
          <span>of</span>
          <span className="font-semibold text-gray-700">{labours.length}</span>
          <span>workers</span>
          {activeFilter !== 'all' && (
            <span className="bg-[#0e1e55]/10 text-[#0e1e55] px-2 py-0.5 rounded-full text-xs">
              {filterTypes.find(f => f.key === activeFilter)?.label}
            </span>
          )}
        </div>
      </div>

      {/* Worker List */}
      <div className="px-3 py-4 pb-24">
        {filteredLabours.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {filteredLabours.map((worker) => {
              const availability = getAvailabilityBadge(worker);
              const expertiseColor = getExpertiseColor(worker.expertise);
              
              return (
                <div
                  key={worker.id}
                  onClick={() => setSelectedLabour(worker)}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-300 cursor-pointer active:scale-95"
                >
                  {/* Profile Section */}
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={worker.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                        alt={worker.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white">
                        <Shield className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm truncate">
                        {worker.name}
                      </h3>
                      
                      {/* Expertise Badge */}
                      <div className="mb-2">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${expertiseColor}`}>
                          {worker.expertise || 'General Worker'}
                        </span>
                      </div>

                      {/* Rating and Experience */}
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-semibold text-gray-700">
                            {worker.rating || 'New'}
                          </span>
                        </div>
                        <span className="text-gray-300 text-xs">•</span>
                        {worker.experience && (
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Briefcase className="w-3 h-3" />
                            <span className="text-xs">{worker.experience}</span>
                          </div>
                        )}
                      </div>

                      {/* Rate */}
                      {worker.rate && (
                        <div className="flex items-center space-x-1 mt-1 text-gray-500">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-xs font-semibold text-green-600">
                            ₹{worker.rate}/day
                          </span>
                        </div>
                      )}

                      {/* Location */}
                      {worker.location && (
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{worker.location}</span>
                        </div>
                      )}

                      {/* Availability Status */}
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${availability.color} mt-1`}>
                        {availability.text}
                      </div>
                    </div>
                    
                    <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              No Workers Found
            </h3>
            <p className="text-gray-600 text-sm">
              {activeFilter === 'all' 
                ? 'There are currently no workers available.' 
                : `No ${filterTypes.find(f => f.key === activeFilter)?.label.toLowerCase()} workers found.`
              }
            </p>
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="mt-3 px-4 py-2 bg-[#0e1e55] text-white rounded-lg hover:opacity-90 transition-colors text-sm"
              >
                Show All Workers
              </button>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Worker Detail Modal */}
      {selectedLabour && !showBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in duration-300">
          <div 
            className="bg-white rounded-t-2xl sm:rounded-3xl shadow-2xl w-full max-w-full sm:max-w-2xl flex flex-col max-h-[95vh] sm:max-h-[85vh] transform transition-all duration-300 scale-95 sm:scale-100 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Enhanced Header with Gradient */}
            <div className="bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] rounded-t-2xl sm:rounded-t-3xl p-6 relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedLabour(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 z-10 hover:scale-110"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Profile Header */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="relative">
                    <img
                      src={selectedLabour.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                      alt={selectedLabour.name}
                      className="w-20 h-20 rounded-2xl object-cover border-4 border-white/80 shadow-2xl"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 text-white">
                  <h2 className="text-2xl font-bold mb-1 drop-shadow-lg">
                    {selectedLabour.name}
                  </h2>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getExpertiseColor(selectedLabour.expertise)} mb-3`}>
                    {selectedLabour.expertise || 'General Labor Worker'}
                  </div>
                  
                  {/* Stats Row */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                      <Star className="w-4 h-4 text-yellow-300 fill-current" />
                      <span className="font-bold text-white text-sm">
                        {selectedLabour.rating || 'New'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                      <Briefcase className="w-4 h-4 text-white" />
                      <span className="font-bold text-white text-sm">
                        {selectedLabour.projects_completed || 0} Projects
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pb-28 sm:pb-4">
              <div className="p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Experience */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 transform hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-green-600 font-semibold">Experience</p>
                        <p className="font-bold text-gray-900 text-sm">
                          {selectedLabour.experience || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 transform hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-purple-600 font-semibold">Location</p>
                        <p className="font-bold text-gray-900 text-sm">
                          {selectedLabour.location || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rate */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100 transform hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-orange-600 font-semibold">Daily Rate</p>
                        <p className="font-bold text-gray-900 text-lg">
                          {selectedLabour.rate ? `₹${selectedLabour.rate}` : 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100 transform hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-xs text-cyan-600 font-semibold">Projects</p>
                        <p className="font-bold text-gray-900 text-lg">
                          {selectedLabour.projects_completed || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                {selectedLabour.about && (
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-200">
                    <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center">
                      <Award className="w-5 h-5 text-gray-600 mr-2" />
                      About {selectedLabour.name.split(' ')[0]}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {selectedLabour.about}
                    </p>
                  </div>
                )}

                {/* Verification Badge */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800 text-sm">Verified Worker</p>
                      <p className="text-green-600 text-xs">Profile verified by Karia Mitra</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Action Buttons - Mobile Optimized */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 pb-8 sm:pb-6 backdrop-blur-sm bg-white/95 safe-area-padding">
              {isBusinessHours && selectedLabour.is_active && selectedLabour.number ? (
                <div className="grid grid-cols-2 gap-4">
                  {/* Direct WhatsApp Button */}
                  <button
                    onClick={handleDirectWhatsApp}
                    className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  >
                    <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-base">WhatsApp</span>
                  </button>

                  {/* Direct Call Button */}
                  <button
                    onClick={handleDirectCall}
                    className="group bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#0e1e55] text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  >
                    <Phone className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-base">Call</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {/* WhatsApp via Support Button */}
                  <button
                    onClick={() => handleBookWorker(selectedLabour)}
                    className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  >
                    <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-base">WhatsApp</span>
                  </button>

                  {/* Call Support Button */}
                  <button
                    onClick={handleCallSupport}
                    className="group bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#0e1e55] text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  >
                    <Phone className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-base">Call</span>
                  </button>
                </div>
              )}
              
              {/* Contact Note */}
              <p className="text-xs text-gray-500 text-center mt-3">
                {isBusinessHours && selectedLabour.is_active && selectedLabour.number 
                  ? `Contact ${selectedLabour.name} directly`
                  : `Contact Karia Mitra to connect with ${selectedLabour.name}`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Booking Confirmation Modal */}
      {showBookingModal && selectedLabour && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in duration-300">
          <div 
            className="bg-white rounded-t-2xl sm:rounded-3xl shadow-2xl w-full max-w-full sm:max-w-md flex flex-col max-h-[95vh] sm:max-h-[85vh] transform transition-all duration-300 scale-95 sm:scale-100 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] rounded-t-2xl sm:rounded-t-3xl p-6 relative">
              <button
                onClick={() => setShowBookingModal(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 z-10 hover:scale-110"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold mb-2 drop-shadow-lg">
                  Book This Worker
                </h2>
                <p className="text-blue-100 text-sm drop-shadow-lg">
                  Continue to WhatsApp to complete your booking
                </p>
              </div>
            </div>

            {/* Worker Summary */}
            <div className="flex-1 overflow-y-auto pb-28 sm:pb-4">
              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedLabour.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                      alt={selectedLabour.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-lg"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {selectedLabour.name}
                      </h3>
                      <p className="text-[#0e1e55] font-semibold text-sm">
                        {selectedLabour.expertise}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold text-gray-700">
                          {selectedLabour.rating || 'New'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>No advance payment required</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Share your work requirements</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Get instant confirmation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Action Buttons - Mobile Optimized */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 pb-8 sm:pb-6 backdrop-blur-sm bg-white/95 safe-area-padding">
              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppBooking}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-base">Continue to WhatsApp</span>
                </button>
                
                <button
                  onClick={handleCallSupport}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <Phone className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-base">Call Support First</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for safe areas */}
      <style jsx>{`
        .safe-area-padding {
          padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
        }
      `}</style>
    </div>
  );
}