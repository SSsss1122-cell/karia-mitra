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

  // Function to get card gradient
  const getCardGradient = (worker) => {
    if (worker.rating >= 4.5) return 'bg-gradient-to-br from-white to-amber-50 border-amber-200';
    if (worker.rating >= 4.0) return 'bg-gradient-to-br from-white to-blue-50 border-blue-200';
    return 'bg-gradient-to-br from-white to-gray-50 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading skilled workers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <button 
            onClick={fetchLabours}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32 sm:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Skilled Workers
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {isBusinessHours ? '📞 Direct contact available' : 'Book via support'}
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {isBusinessHours && (
                <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-full border border-green-200 shadow-sm">
                  <Zap className="w-4 h-4" />
                  <span>Direct Contact Available</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <Users className="w-4 h-4 text-amber-600" />
                <span>{filteredLabours.length} workers available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Hours Banner */}
      {!isBusinessHours && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-center space-x-2 text-sm text-amber-800">
              <Clock className="w-4 h-4" />
              <span>Business Hours: Mon-Sat, 9 AM - 7 PM. Outside hours, bookings go through support.</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile counter for small screens */}
      <div className="md:hidden bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
            <Users className="w-3 h-3 text-amber-600" />
            <span>{filteredLabours.length} workers available</span>
            {isBusinessHours && (
              <>
                <span>•</span>
                <span className="text-green-600 font-medium flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>Direct Contact</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Available Workers
              </h2>
              <p className="text-gray-600">
                {isBusinessHours 
                  ? 'Direct contact available during business hours' 
                  : 'Book through support outside business hours'
                }
              </p>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Filter className="w-5 h-5" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
          </div>

          {/* Filter Buttons - Scrollable on mobile */}
          <div className="relative">
            <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
              {filterTypes.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`flex-shrink-0 px-4 py-3 sm:px-6 sm:py-3 rounded-xl text-sm font-medium transition-all duration-200 border-2 whitespace-nowrap shadow-sm ${
                    activeFilter === filter.key
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-300 hover:shadow-md'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filter Count */}
          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
            <span>Showing</span>
            <span className="font-semibold text-amber-600">{filteredLabours.length}</span>
            <span>of</span>
            <span className="font-semibold text-gray-700">{labours.length}</span>
            <span>workers</span>
            {activeFilter !== 'all' && (
              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium border border-amber-200">
                {filterTypes.find(f => f.key === activeFilter)?.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Worker List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 sm:pb-8">
        {filteredLabours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLabours.map((worker) => {
              const availability = getAvailabilityBadge(worker);
              const expertiseColor = getExpertiseColor(worker.expertise);
              const cardGradient = getCardGradient(worker);
              
              return (
                <div
                  key={worker.id}
                  onClick={() => setSelectedLabour(worker)}
                  className={`group ${cardGradient} rounded-2xl shadow-lg hover:shadow-2xl border-2 p-6 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 relative overflow-hidden`}
                >
                  {/* Premium Crown Badge */}
                  {worker.rating >= 4.5 && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      <span>Premium</span>
                    </div>
                  )}

                  {/* Availability Dot */}
                  <div className={`absolute top-4 left-4 w-3 h-3 rounded-full border-2 border-white ${
                    worker.is_active && isBusinessHours ? 'bg-green-500 animate-pulse' : 
                    worker.is_active ? 'bg-amber-500' : 'bg-red-500'
                  }`} />

                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="relative">
                        <img
                          src={worker.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                          alt={worker.name}
                          className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                        />
                        {worker.email_verified && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white shadow-lg">
                            <BadgeCheck className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-amber-600 transition-colors">
                        {worker.name}
                      </h3>
                      
                      {/* Expertise Gradient Badge */}
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${expertiseColor} shadow-sm mb-3`}>
                        {worker.expertise || 'General Worker'}
                      </div>

                      {/* Rating and Experience */}
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-bold text-gray-700">
                            {worker.rating || 'New'}
                          </span>
                        </div>
                        {worker.experience && (
                          <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm">
                            <Target className="w-3 h-3 text-blue-500" />
                            <span className="text-xs text-gray-600">
                              {worker.experience}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Rate */}
                      {worker.rate && (
                        <div className="flex items-center space-x-1 mb-3">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-bold text-green-600">
                            ₹{worker.rate}/day
                          </span>
                        </div>
                      )}

                      {/* Availability Status */}
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${availability.color} shadow-sm`}>
                        {availability.text}
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{worker.location || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {worker.is_active && isBusinessHours && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <UserCheck className="w-12 h-12 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Workers Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              {activeFilter === 'all' 
                ? 'There are currently no labor workers available in your area.' 
                : `No ${filterTypes.find(f => f.key === activeFilter)?.label.toLowerCase()} workers found.`
              }
            </p>
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
              >
                Show All Workers
              </button>
            )}
          </div>
        )}
      </div>

      {/* Worker Detail Modal */}
      {selectedLabour && !showBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-full sm:max-w-2xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-6 sm:p-8 border-b border-gray-200">
              <button
                onClick={() => setSelectedLabour(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>

              <div className="flex items-start space-x-4 sm:space-x-6">
                <div className="relative">
                  <img
                    src={selectedLabour.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                    alt={selectedLabour.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl object-cover border-4 border-white shadow-lg"
                  />
                  {selectedLabour.email_verified && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 sm:p-1.5 border-2 border-white shadow-lg">
                      <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      {selectedLabour.name}
                    </h2>
                    {selectedLabour.rating >= 4.5 && (
                      <div className="flex items-center space-x-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm mt-1 sm:mt-0 w-fit shadow-lg">
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Premium Worker</span>
                      </div>
                    )}
                  </div>
                  <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getExpertiseColor(selectedLabour.expertise)} shadow-sm mb-3`}>
                    {selectedLabour.expertise || 'General Labor Worker'}
                  </div>
                  
                  <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{selectedLabour.rating || 'New'}</span>
                    </div>
                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getAvailabilityBadge(selectedLabour).color} shadow-sm`}>
                      {getAvailabilityBadge(selectedLabour).text}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Location</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {selectedLabour.location || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Experience</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {selectedLabour.experience || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Daily Rate</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {selectedLabour.rate ? `₹${selectedLabour.rate}/day` : 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Projects Completed</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {selectedLabour.projects_completed || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {selectedLabour.about && (
                <div className="bg-amber-50 rounded-xl p-4 sm:p-6 border border-amber-200">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3 flex items-center">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600 flex-shrink-0" />
                    About
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {selectedLabour.about}
                  </p>
                </div>
              )}

              {/* Action Buttons - Direct contact during business hours */}
              <div className="space-y-3 sm:space-y-4 pt-6 pb-8 sm:pb-4">
                {isBusinessHours && selectedLabour.is_active && selectedLabour.number ? (
                  <>
                    <button
                      onClick={handleDirectWhatsApp}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 text-base sm:text-lg hover:shadow-lg hover:scale-105 shadow-md"
                    >
                      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>WhatsApp {selectedLabour.name}</span>
                    </button>
                    
                    <button
                      onClick={handleDirectCall}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 text-base sm:text-lg hover:shadow-lg hover:scale-105 shadow-md"
                    >
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Call {selectedLabour.name}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleBookWorker(selectedLabour)}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 text-base sm:text-lg hover:shadow-lg hover:scale-105 shadow-md"
                    >
                      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Book via WhatsApp</span>
                    </button>
                    
                    <button
                      onClick={handleCallSupport}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 text-base sm:text-lg hover:shadow-lg hover:scale-105 shadow-md"
                    >
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Call Support</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Confirmation Modal (for non-business hours) */}
      {showBookingModal && selectedLabour && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-full sm:max-w-md max-h-[85vh] overflow-y-auto border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 sm:p-8 border-b border-gray-200">
              <button
                onClick={() => setShowBookingModal(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Book This Worker
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Continue to WhatsApp to complete your booking
                </p>
              </div>
            </div>

            {/* Worker Summary */}
            <div className="p-6 sm:p-8">
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6 border border-gray-200">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedLabour.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                    alt={selectedLabour.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg sm:text-xl">
                      {selectedLabour.name}
                    </h3>
                    <p className="text-amber-600 font-semibold text-sm sm:text-base">
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
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex items-center space-x-3 text-sm sm:text-base text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>No advance payment required</span>
                </div>
                <div className="flex items-center space-x-3 text-sm sm:text-base text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Share your work requirements</span>
                </div>
                <div className="flex items-center space-x-3 text-sm sm:text-base text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Get instant confirmation</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pb-8 sm:pb-4">
                <button
                  onClick={handleWhatsAppBooking}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 text-lg hover:shadow-lg hover:scale-105 shadow-md"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>Continue to WhatsApp</span>
                </button>
                
                <button
                  onClick={handleCallSupport}
                  className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 text-base hover:shadow-lg shadow-md"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Support First</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}