'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  GraduationCap, 
  Wrench, 
  Briefcase,
  Award,
  CheckCircle,
  X,
  ArrowRight,
  Shield,
  Filter,
  MessageCircle,
  Calendar,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EngineersPage() {
  const router = useRouter();
  const [engineers, setEngineers] = useState([]);
  const [filteredEngineers, setFilteredEngineers] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Support contact details
  const supportContact = {
    phone: '9480072737',
    name: 'Karia Mitra Support'
  };

  const filterTypes = [
    { key: 'all', label: 'All Engineers' },
    { key: 'site', label: 'Site Engineer' },
    { key: 'structural', label: 'Structural Engineer' },
    { key: 'project', label: 'Project Engineer' },
    { key: 'assistant', label: 'Assistant Engineer' },
    { key: 'electrical', label: 'Electrical Engineer' },
    { key: 'chief', label: 'Chief Engineer' },
    { key: 'civil', label: 'Civil Engineer' }
  ];

  // ✅ Fetch Engineers from Supabase
  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('Engineer')
          .select('*')
          .order('Rating', { ascending: false });

        if (error) throw error;
        setEngineers(data || []);
        setFilteredEngineers(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEngineers();
  }, []);

  // ✅ Apply filters when activeFilter changes
  useEffect(() => {
    const filterEngineers = () => {
      if (activeFilter === 'all') {
        setFilteredEngineers(engineers);
      } else {
        const filtered = engineers.filter(eng => {
          if (!eng.Specialization) return false;
          
          const specialization = eng.Specialization.toLowerCase();
          
          switch (activeFilter) {
            case 'site':
              return specialization.includes('site');
            case 'structural':
              return specialization.includes('structural');
            case 'project':
              return specialization.includes('project');
            case 'assistant':
              return specialization.includes('assistant');
            case 'electrical':
              return specialization.includes('electrical');
            case 'chief':
              return specialization.includes('chief');
            case 'civil':
              return specialization.includes('civil');
            default:
              return true;
          }
        });
        setFilteredEngineers(filtered);
      }
    };

    filterEngineers();
  }, [activeFilter, engineers]);

  const handleBookEngineer = (engineer) => {
    setSelectedEngineer(engineer);
    setShowBookingModal(true);
  };

  const handleWhatsAppBooking = () => {
    if (!selectedEngineer) return;

    const message = `🚀 *Booking Request - Karia Mitra* 🚀

👤 *I want to book an engineer:*
• *Engineer:* ${selectedEngineer.Name}
• *Specialization:* ${selectedEngineer.Specialization || 'Professional Engineer'}
• *Rating:* ${selectedEngineer.Rating || 'New'} ⭐

🏗️ *Project Details:* [Please share your project requirements]

📞 *My Contact:* [Your phone number]

📍 *Project Location:* [Your location]

I found this expert on Karia Mitra and would like to proceed with the booking!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${supportContact.phone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setShowBookingModal(false);
    setSelectedEngineer(null);
  };

  const handleCallSupport = () => {
    window.location.href = `tel:${supportContact.phone}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading professional engineers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-32 sm:pb-0"> {/* Increased bottom padding for mobile */}
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 sm:p-3 bg-indigo-100 rounded-xl">
                  <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Professional Engineers
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5">
                    Book certified experts for your projects
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 bg-indigo-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                <span>{filteredEngineers.length} available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile counter for small screens */}
      <div className="sm:hidden bg-indigo-50 border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>{filteredEngineers.length} engineers available</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-4 sm:pt-6">
        <div className="mb-4 sm:mb-6 px-2 sm:px-0">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                Available Engineers
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">
                Tap to view details and book via WhatsApp
              </p>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">Filter:</span>
            </div>
          </div>

          {/* Filter Buttons - Scrollable on mobile */}
          <div className="relative">
            <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-3 -mx-2 px-2 scrollbar-hide">
              {filterTypes.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`flex-shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border whitespace-nowrap ${
                    activeFilter === filter.key
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100 transform scale-105'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filter Count */}
          <div className="mt-3 flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
            <span>Showing</span>
            <span className="font-semibold text-indigo-600">{filteredEngineers.length}</span>
            <span>of</span>
            <span className="font-semibold text-gray-700">{engineers.length}</span>
            <span>engineers</span>
            {activeFilter !== 'all' && (
              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">
                {filterTypes.find(f => f.key === activeFilter)?.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Engineer List */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pb-32 sm:pb-6 lg:pb-8"> {/* Increased bottom padding for mobile */}
        {filteredEngineers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {filteredEngineers.map((eng) => (
              <div
                key={eng.id}
                onClick={() => setSelectedEngineer(eng)}
                className="group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/50 p-4 sm:p-6 hover:shadow-lg sm:hover:shadow-xl hover:border-indigo-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                {/* Profile Section */}
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={eng.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                      alt={eng.Name}
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl object-cover border-2 border-white shadow-md group-hover:border-indigo-200 transition-colors"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 sm:p-1 border-2 border-white">
                      <Shield className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg truncate group-hover:text-indigo-600 transition-colors">
                      {eng.Name}
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm truncate">
                      {eng.Specialization || 'General Engineer'}
                    </p>
                    
                    {/* Rating and Experience */}
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                      <span className="text-xs sm:text-sm font-semibold text-gray-700">
                        {eng.Rating || 'New'}
                      </span>
                      {eng.Experience && (
                        <span className="text-gray-400 text-xs">•</span>
                      )}
                      {eng.Experience && (
                        <span className="text-xs text-gray-500 truncate">
                          {eng.Experience}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-indigo-500 transition-colors transform group-hover:translate-x-0.5 sm:group-hover:translate-x-1 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No Engineers Found
            </h3>
            <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto mb-4">
              {activeFilter === 'all' 
                ? 'There are currently no engineers available.' 
                : `No ${filterTypes.find(f => f.key === activeFilter)?.label.toLowerCase()} found.`
              }
            </p>
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
              >
                Show All Engineers
              </button>
            )}
          </div>
        )}
      </div>

      {/* Engineer Detail Modal */}
      {selectedEngineer && !showBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-full sm:max-w-2xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto" // Further reduced max-height
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-4 sm:p-6 lg:p-8 border-b border-gray-200">
              <button
                onClick={() => setSelectedEngineer(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>

              <div className="flex items-start space-x-4 sm:space-x-6">
                <img
                  src={selectedEngineer.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                  alt={selectedEngineer.Name}
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl object-cover border-4 border-white shadow-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                      {selectedEngineer.Name}
                    </h2>
                    <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm mt-1 sm:mt-0 w-fit">
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Verified</span>
                    </div>
                  </div>
                  <p className="text-lg sm:text-xl text-indigo-600 font-semibold mb-3 sm:mb-4 truncate">
                    {selectedEngineer.Specialization || 'Professional Engineer'}
                  </p>
                  
                  <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{selectedEngineer.Rating || 'New'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{selectedEngineer.Site_completed || 0} projects</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Location</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {selectedEngineer.Location || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Experience</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {selectedEngineer.Experience || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Qualification</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {selectedEngineer.Qualification || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                  <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Projects</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {selectedEngineer.Site_completed || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Expertise Section */}
              {selectedEngineer.Specialization && (
                <div className="bg-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3 flex items-center">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600 flex-shrink-0" />
                    Area of Expertise
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {selectedEngineer.Specialization}
                  </p>
                </div>
              )}

              {/* Action Buttons with More Bottom Spacing */}
              <div className="space-y-3 sm:space-y-4 pt-6 pb-8 sm:pb-4"> {/* Increased top and bottom padding */}
                <button
                  onClick={() => handleBookEngineer(selectedEngineer)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 sm:py-4 px-6 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 text-base sm:text-lg hover:shadow-lg hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Book via WhatsApp</span>
                </button>
                
                <button
                  onClick={handleCallSupport}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 sm:py-4 px-6 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 text-base sm:text-lg hover:shadow-lg hover:scale-105"
                >
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Call Support</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Confirmation Modal */}
      {showBookingModal && selectedEngineer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-full sm:max-w-md max-h-[85vh] overflow-y-auto" // Further reduced max-height
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 sm:p-8 border-b border-gray-200">
              <button
                onClick={() => setShowBookingModal(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Book This Engineer
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Continue to WhatsApp to complete your booking
                </p>
              </div>
            </div>

            {/* Engineer Summary */}
            <div className="p-6 sm:p-8">
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedEngineer.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                    alt={selectedEngineer.Name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg sm:text-xl">
                      {selectedEngineer.Name}
                    </h3>
                    <p className="text-indigo-600 font-semibold text-sm sm:text-base">
                      {selectedEngineer.Specialization}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-gray-700">
                        {selectedEngineer.Rating || 'New'}
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
                  <span>Share your project details</span>
                </div>
                <div className="flex items-center space-x-3 text-sm sm:text-base text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Get instant confirmation</span>
                </div>
              </div>

              {/* Action Buttons with More Bottom Spacing */}
              <div className="space-y-3 pb-8 sm:pb-4"> {/* Increased bottom padding */}
                <button
                  onClick={handleWhatsAppBooking}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 text-lg hover:shadow-lg hover:scale-105"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>Continue to WhatsApp</span>
                </button>
                
                <button
                  onClick={handleCallSupport}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 text-base hover:shadow-lg"
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