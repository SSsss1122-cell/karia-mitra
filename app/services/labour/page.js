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
  Filter
} from 'lucide-react';

export default function LabourPage() {
  const router = useRouter();
  const [labours, setLabours] = useState([]);
  const [filteredLabours, setFilteredLabours] = useState([]);
  const [selectedLabour, setSelectedLabour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading skilled workers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
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
   <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
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
                <div className="p-3 bg-amber-100 rounded-xl">
                  <UserCheck className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Skilled Workers
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Professional labor for your construction needs
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-2 text-sm text-gray-500 bg-amber-50 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{filteredLabours.length} workers available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile counter for small screens */}
      <div className="md:hidden bg-amber-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>{filteredLabours.length} workers available</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Available Workers
              </h2>
              <p className="text-gray-600">
                Click on a worker to view detailed profile and contact information
              </p>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Filter className="w-5 h-5" />
              <span className="text-sm font-medium">Filter:</span>
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
                      ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-100 transform scale-105'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filter Count */}
          <div className="mt-3 flex items-center space-x-2 text-sm text-gray-500">
            <span>Showing</span>
            <span className="font-semibold text-amber-600">{filteredLabours.length}</span>
            <span>of</span>
            <span className="font-semibold text-gray-700">{labours.length}</span>
            <span>workers</span>
            {activeFilter !== 'all' && (
              <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs">
                {filterTypes.find(f => f.key === activeFilter)?.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Worker List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {filteredLabours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLabours.map((worker) => (
              <div
                key={worker.id}
                onClick={() => setSelectedLabour(worker)}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-xl hover:border-amber-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={
                        worker.image_url ||
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
                      }
                      alt={worker.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md group-hover:border-amber-200 transition-colors"
                    />
                    {worker.email_verified && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-amber-600 transition-colors">
                      {worker.name}
                    </h3>
                    <p className="text-gray-500 text-sm truncate">
                      {worker.expertise || 'General Worker'}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-gray-700">
                        {worker.rating || 'New'}
                      </span>
                      {worker.experience && <span className="text-gray-400">•</span>}
                      {worker.experience && (
                        <span className="text-xs text-gray-500">
                          {worker.experience}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserCheck className="w-12 h-12 text-gray-400" />
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
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Show All Workers
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedLabour && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-8 border-b border-gray-200">
              <button
                onClick={() => setSelectedLabour(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-start space-x-6">
                <img
                  src={
                    selectedLabour.image_url ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
                  }
                  alt={selectedLabour.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-3xl font-bold text-gray-900">
                      {selectedLabour.name}
                    </h2>
                    {selectedLabour.email_verified && (
                      <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        <Shield className="w-4 h-4" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xl text-amber-600 font-semibold mb-4">
                    {selectedLabour.expertise || 'General Labor Worker'}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{selectedLabour.rating || 'New'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <UserCheck className="w-4 h-4" />
                      <span>{selectedLabour.is_active ? 'Available' : 'Not Available'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold text-gray-900">
                      {selectedLabour.location || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-semibold text-gray-900">
                      {selectedLabour.experience || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-500">Daily Rate</p>
                    <p className="font-semibold text-gray-900">
                      {selectedLabour.rate ? `₹${selectedLabour.rate}/day` : 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Briefcase className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-semibold ${selectedLabour.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedLabour.is_active ? 'Available for Work' : 'Currently Unavailable'}
                    </p>
                  </div>
                </div>
              </div>

              {selectedLabour.about && (
                <div className="bg-amber-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-amber-600" />
                    About
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedLabour.about}
                  </p>
                </div>
              )}

              <div className="space-y-4 pt-4">
                {selectedLabour.number && (
                  <a
                    href={`tel:${selectedLabour.number}`}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-3"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call {selectedLabour.name}</span>
                  </a>
                )}
                
                <button className="w-full border-2 border-amber-600 text-amber-600 hover:bg-amber-50 font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-3">
                  <Mail className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}