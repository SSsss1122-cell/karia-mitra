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
                  <Briefcase className="w-5 h-5 text-[#0e1e55]" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    Professional Engineers
                  </h1>
                  <p className="text-gray-600 text-xs">
                    Certified experts for your projects
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500 bg-[#0e1e55]/5 px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>{filteredEngineers.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="px-3 py-4">
        <div className="mb-4">
          <h2 className="text-base font-bold text-gray-900 mb-1">
            Available Engineers
          </h2>
          <p className="text-gray-600 text-xs">
            Tap to view profile and book
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
          <span className="font-semibold text-[#0e1e55]">{filteredEngineers.length}</span>
          <span>of</span>
          <span className="font-semibold text-gray-700">{engineers.length}</span>
          <span>engineers</span>
          {activeFilter !== 'all' && (
            <span className="bg-[#0e1e55]/10 text-[#0e1e55] px-2 py-0.5 rounded-full text-xs">
              {filterTypes.find(f => f.key === activeFilter)?.label}
            </span>
          )}
        </div>
      </div>

      {/* Engineer List */}
      <div className="px-3 py-4 pb-24">
        {filteredEngineers.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {filteredEngineers.map((eng) => (
              <div
                key={eng.id}
                onClick={() => setSelectedEngineer(eng)}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-300 cursor-pointer active:scale-95"
              >
                {/* Profile Section */}
                <div className="flex items-center space-x-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={eng.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                      alt={eng.Name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white">
                      <Shield className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm truncate">
                      {eng.Name}
                    </h3>
                    <p className="text-gray-500 text-xs truncate">
                      {eng.Specialization || 'Professional Engineer'}
                    </p>
                    
                    {/* Rating and Experience */}
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-semibold text-gray-700">
                          {eng.Rating || 'New'}
                        </span>
                      </div>
                      <span className="text-gray-300 text-xs">•</span>
                      {eng.Experience && (
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Briefcase className="w-3 h-3" />
                          <span className="text-xs">{eng.Experience}</span>
                        </div>
                      )}
                    </div>

                    {/* Location */}
                    {eng.Location && (
                      <div className="flex items-center text-gray-500 text-xs mt-1">
                        <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{eng.Location}</span>
                      </div>
                    )}
                  </div>
                  
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>

                {/* Specialization Badge */}
                {eng.Specialization && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="px-1.5 py-0.5 bg-[#0e1e55]/10 text-[#0e1e55] rounded-full text-xs">
                      {eng.Specialization}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              No Engineers Found
            </h3>
            <p className="text-gray-600 text-sm">
              {activeFilter === 'all' 
                ? 'There are currently no engineers available.' 
                : `No ${filterTypes.find(f => f.key === activeFilter)?.label.toLowerCase()} found.`
              }
            </p>
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="mt-3 px-4 py-2 bg-[#0e1e55] text-white rounded-lg hover:opacity-90 transition-colors text-sm"
              >
                Show All Engineers
              </button>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Engineer Detail Modal */}
      {selectedEngineer && !showBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in duration-300">
          <div 
            className="bg-white rounded-t-2xl sm:rounded-3xl shadow-2xl w-full max-w-full sm:max-w-2xl flex flex-col max-h-[95vh] sm:max-h-[85vh] transform transition-all duration-300 scale-95 sm:scale-100 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Enhanced Header with Gradient */}
            <div className="bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] rounded-t-2xl sm:rounded-t-3xl p-6 relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedEngineer(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 z-10 hover:scale-110"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Profile Header */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="relative">
                    <img
                      src={selectedEngineer.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                      alt={selectedEngineer.Name}
                      className="w-20 h-20 rounded-2xl object-cover border-4 border-white/80 shadow-2xl"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 text-white">
                  <h2 className="text-2xl font-bold mb-1 drop-shadow-lg">
                    {selectedEngineer.Name}
                  </h2>
                  <p className="text-blue-100 text-lg font-medium mb-3 drop-shadow-lg">
                    {selectedEngineer.Specialization || 'Professional Engineer'}
                  </p>
                  
                  {/* Stats Row */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                      <Star className="w-4 h-4 text-yellow-300 fill-current" />
                      <span className="font-bold text-white text-sm">
                        {selectedEngineer.Rating || 'New'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                      <Briefcase className="w-4 h-4 text-white" />
                      <span className="font-bold text-white text-sm">
                        {selectedEngineer.Site_completed || 0} Projects
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
                          {selectedEngineer.Experience || 'Not specified'}
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
                          {selectedEngineer.Location || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Qualification */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100 transform hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-orange-600 font-semibold">Qualification</p>
                        <p className="font-bold text-gray-900 text-sm">
                          {selectedEngineer.Qualification || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100 transform hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Wrench className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-xs text-cyan-600 font-semibold">Projects</p>
                        <p className="font-bold text-gray-900 text-lg">
                          {selectedEngineer.Site_completed || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expertise Section */}
                {selectedEngineer.Specialization && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
                    <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center">
                      <Award className="w-5 h-5 text-blue-600 mr-2" />
                      Area of Expertise
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {selectedEngineer.Specialization}
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
                      <p className="font-semibold text-green-800 text-sm">Verified Engineer</p>
                      <p className="text-green-600 text-xs">Profile verified by Karia Mitra</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Action Buttons - Mobile Optimized */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 pb-8 sm:pb-6 backdrop-blur-sm bg-white/95 safe-area-padding">
              <div className="grid grid-cols-2 gap-4">
                {/* WhatsApp Button */}
                <button
                  onClick={() => handleBookEngineer(selectedEngineer)}
                  className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-base">WhatsApp</span>
                </button>

                {/* Call Button */}
                <button
                  onClick={handleCallSupport}
                  className="group bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#0e1e55] text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <Phone className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-base">Call</span>
                </button>
              </div>
              
              {/* Contact Note */}
              <p className="text-xs text-gray-500 text-center mt-3">
                Contact Karia Mitra to connect with {selectedEngineer.Name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Booking Confirmation Modal */}
      {showBookingModal && selectedEngineer && (
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
                  Book This Engineer
                </h2>
                <p className="text-blue-100 text-sm drop-shadow-lg">
                  Continue to WhatsApp to complete your booking
                </p>
              </div>
            </div>

            {/* Engineer Summary */}
            <div className="flex-1 overflow-y-auto pb-28 sm:pb-4">
              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedEngineer.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                      alt={selectedEngineer.Name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-lg"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {selectedEngineer.Name}
                      </h3>
                      <p className="text-[#0e1e55] font-semibold text-sm">
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
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>No advance payment required</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Share your project details</span>
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