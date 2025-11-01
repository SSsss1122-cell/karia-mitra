'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  CheckCircle, 
  Mail, 
  Phone, 
  ClipboardList,
  Award,
  Briefcase,
  Clock,
  Shield,
  X,
  ArrowRight,
  Building
} from 'lucide-react';

export default function BuildersPage() {
  const router = useRouter();
  const [builders, setBuilders] = useState([]);
  const [selectedBuilder, setSelectedBuilder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch Builders from Supabase
  useEffect(() => {
    const fetchBuilders = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('Builder')
          .select('*')
          .order('Rating', { ascending: false });

        if (error) throw error;

        // If table is empty, use dummy data
        if (!data || data.length === 0) {
          setBuilders([
            {
              id: 1,
              Name: 'Ravi Construction Co.',
              Experience: '10 years',
              Location: 'Bengaluru, Karnataka',
              Projects_completed: 42,
              Rating: 4.7,
              Reviews: 85,
              License: 'LIC-2025-09',
              Verified: true,
              Specialties: ['Residential', 'Commercial'],
              Image: 'https://images.unsplash.com/photo-1581093588401-22c4f2a0229e?w=400&h=400&fit=crop&crop=face',
              Phone: '9876543210',
              Email: 'ravi@buildco.com',
              About: 'We specialize in modern residential and commercial construction with 10+ years of experience. Quality and customer satisfaction are our top priorities.'
            },
            {
              id: 2,
              Name: 'Skyline Builders',
              Experience: '8 years',
              Location: 'Hyderabad, Telangana',
              Projects_completed: 31,
              Rating: 4.6,
              Reviews: 60,
              License: 'LIC-2023-12',
              Verified: true,
              Specialties: ['Apartments', 'Villas'],
              Image: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92d?w=400&h=400&fit=crop&crop=face',
              Phone: '9988776655',
              Email: 'contact@skyline.com',
              About: 'Premium real estate developer focusing on luxury apartment projects with modern amenities and innovative designs.'
            },
            {
              id: 3,
              Name: 'GreenBuild Engineers',
              Experience: '12 years',
              Location: 'Pune, Maharashtra',
              Projects_completed: 58,
              Rating: 4.9,
              Reviews: 102,
              License: 'LIC-2022-07',
              Verified: true,
              Specialties: ['Eco-friendly homes', 'Smart buildings'],
              Image: 'https://images.unsplash.com/photo-1529429617124-95b109e86bb8?w=400&h=400&fit=crop&crop=face',
              Phone: '9123456780',
              Email: 'info@greenbuild.com',
              About: 'Leading builder in eco-friendly and sustainable construction projects. We believe in building a better future through green construction practices.'
            }
          ]);
        } else {
          setBuilders(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuilders();
  }, []);

  const handleCall = (phone) => {
    if (!phone) return alert('Phone number not available.');
    window.location.href = `tel:${phone}`;
  };

  if (loading) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]">
      {/* Simple Karia Mitra Progress Bar */}
      <div className="w-full bg-gray-200 h-1.5">
        <div className="h-full bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] animate-pulse"></div>
      </div>

      {/* Header Skeleton */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="space-y-2">
              <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Skeleton */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="space-y-3">
                  <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                  <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
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
            className="px-6 py-2 bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] text-white rounded-lg hover:opacity-90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]">
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
                <div className="p-2 sm:p-3 bg-[#0e1e55]/10 rounded-xl">
                  <Building className="w-6 h-6 sm:w-8 sm:h-8 text-[#0e1e55]" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Professional Builders
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5">
                    Trusted construction experts for your dream projects
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 bg-[#0e1e55]/5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                <span>{builders.length} builders available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile counter for small screens */}
      <div className="sm:hidden bg-[#0e1e55]/5 border-b border-[#0e1e55]/10">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>{builders.length} builders available</span>
          </div>
        </div>
      </div>

      {/* Builder List - Minimal View with Round Images */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6 lg:mb-8 px-2 sm:px-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
            Available Builders
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm">
            Tap on a builder to view detailed profile and contact information
          </p>
        </div>

        {builders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {builders.map((builder) => (
              <div
                key={builder.id}
                onClick={() => setSelectedBuilder(builder)}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-4 sm:p-6 hover:shadow-lg sm:hover:shadow-xl hover:border-[#0e1e55]/30 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                {/* Profile Section with Round Image */}
                <div className="flex items-center space-x-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={builder.Image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                      alt={builder.Name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-md group-hover:border-[#0e1e55]/20 transition-colors"
                    />
                    {builder.Verified && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate group-hover:text-[#0e1e55] transition-colors">
                      {builder.Name}
                    </h3>
                    <p className="text-gray-500 text-sm truncate">
                      {builder.Specialties?.[0] || 'Construction Builder'}
                    </p>
                    
                    {/* Rating and Projects */}
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                        <span className="text-xs sm:text-sm font-semibold text-gray-700">
                          {builder.Rating || 'New'}
                        </span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <ClipboardList className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">{builder.Projects_completed || 0}</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-gray-500 text-xs sm:text-sm mt-1">
                      <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{builder.Location || 'Location N/A'}</span>
                    </div>
                  </div>
                  
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-[#0e1e55] transition-colors transform group-hover:translate-x-0.5 flex-shrink-0" />
                </div>

                {/* Specialties */}
                {builder.Specialties && builder.Specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {builder.Specialties.slice(0, 2).map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#0e1e55]/10 text-[#0e1e55] rounded-full text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                    {builder.Specialties.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{builder.Specialties.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Building className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No Builders Available
            </h3>
            <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
              There are currently no builders available in your area. 
              Please check back later.
            </p>
          </div>
        )}
      </div>

      {/* Builder Detail Modal with Fixed Call Button */}
      {selectedBuilder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-full sm:max-w-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Header with Round Image */}
              <div className="relative p-6 sm:p-8 border-b border-gray-200">
                <button
                  onClick={() => setSelectedBuilder(null)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>

                <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6 text-center sm:text-left">
                  {/* Round Profile Image */}
                  <div className="relative mx-auto sm:mx-0 mb-4 sm:mb-0">
                    <img
                      src={selectedBuilder.Image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                      alt={selectedBuilder.Name}
                      className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    {selectedBuilder.Verified && (
                      <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1.5 border-4 border-white">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {selectedBuilder.Name}
                    </h2>
                    <p className="text-lg text-[#0e1e55] font-semibold mb-3">
                      {selectedBuilder.Specialties?.join(', ') || 'Professional Builder'}
                    </p>
                    
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{selectedBuilder.Rating || 'New'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClipboardList className="w-4 h-4" />
                        <span>{selectedBuilder.Projects_completed || 0} projects</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{selectedBuilder.Experience || 'Experience not specified'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                {/* Specialties */}
                {selectedBuilder.Specialties && selectedBuilder.Specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {selectedBuilder.Specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-[#0e1e55]/10 text-[#0e1e55] rounded-full text-sm font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-[#0e1e55] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold text-gray-900">
                        {selectedBuilder.Location || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <Briefcase className="w-5 h-5 text-[#0e1e55] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Projects Completed</p>
                      <p className="font-semibold text-gray-900">
                        {selectedBuilder.Projects_completed || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <Award className="w-5 h-5 text-[#0e1e55] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">License</p>
                      <p className="font-semibold text-gray-900">
                        {selectedBuilder.License || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <Mail className="w-5 h-5 text-[#0e1e55] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold text-gray-900 truncate">
                        {selectedBuilder.Email || 'Not available'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                {selectedBuilder.About && (
                  <div className="bg-[#0e1e55]/5 rounded-xl p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 text-lg mb-3 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-[#0e1e55] flex-shrink-0" />
                      About
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedBuilder.About}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Call Button - Always Visible */}
            {selectedBuilder.Phone && (
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-6">
                <button
                  onClick={() => handleCall(selectedBuilder.Phone)}
                  className="w-full bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] hover:opacity-90 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 text-lg shadow-lg"
                >
                  <Phone className="w-6 h-6" />
                  <span>Call {selectedBuilder.Name.split(' ')[0]}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}