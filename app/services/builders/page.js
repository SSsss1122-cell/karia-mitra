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
  Building,
  MessageCircle,
  Users,
  Home,
  Check
} from 'lucide-react';

export default function BuildersPage() {
  const router = useRouter();
  const [builders, setBuilders] = useState([]);
  const [selectedBuilder, setSelectedBuilder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Mediator contact information
  const mediatorNumber = "9480072737";

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

  // ✅ WhatsApp booking function
  const handleWhatsAppBooking = (builder) => {
    const message = `Hi Karia Mitra, I want to book ${builder.Name} (Builder). Please share their details and help me connect with them.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${mediatorNumber}?text=${encodedMessage}`, '_blank');
  };

  // ✅ Call function - just opens dialer without number
  const handleCall = () => {
    window.location.href = 'tel:';
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
                  <Building className="w-5 h-5 text-[#0e1e55]" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    Professional Builders
                  </h1>
                  <p className="text-gray-600 text-xs">
                    Trusted construction experts
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500 bg-[#0e1e55]/5 px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>{builders.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Builder List - Mobile First Design */}
      <div className="px-3 py-4 pb-32">
        <div className="mb-4">
          <h2 className="text-base font-bold text-gray-900 mb-1">
            Available Builders
          </h2>
          <p className="text-gray-600 text-xs">
            Tap to view profile and contact
          </p>
        </div>

        {builders.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {builders.map((builder) => (
              <div
                key={builder.id}
                onClick={() => setSelectedBuilder(builder)}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-300 cursor-pointer active:scale-95"
              >
                {/* Profile Section */}
                <div className="flex items-center space-x-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={builder.Image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                      alt={builder.Name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    {builder.Verified && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white">
                        <Shield className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm truncate">
                      {builder.Name}
                    </h3>
                    <p className="text-gray-500 text-xs truncate">
                      {builder.Specialties?.[0] || 'Construction Builder'}
                    </p>
                    
                    {/* Rating and Projects */}
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-semibold text-gray-700">
                          {builder.Rating || 'New'}
                        </span>
                      </div>
                      <span className="text-gray-300 text-xs">•</span>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <ClipboardList className="w-3 h-3" />
                        <span className="text-xs">{builder.Projects_completed || 0}</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-gray-500 text-xs mt-1">
                      <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{builder.Location || 'Location N/A'}</span>
                    </div>
                  </div>
                  
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>

                {/* Specialties */}
                {builder.Specialties && builder.Specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {builder.Specialties.slice(0, 2).map((specialty, index) => (
                      <span
                        key={index}
                        className="px-1.5 py-0.5 bg-[#0e1e55]/10 text-[#0e1e55] rounded-full text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                    {builder.Specialties.length > 2 && (
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{builder.Specialties.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              No Builders Available
            </h3>
            <p className="text-gray-600 text-sm">
              Check back later for available builders
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Builder Detail Modal */}
      {selectedBuilder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in duration-300">
          <div 
            className="bg-white rounded-t-2xl sm:rounded-3xl shadow-2xl w-full max-w-full sm:max-w-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] transform transition-all duration-300 scale-95 sm:scale-100 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Enhanced Header with Gradient */}
            <div className="bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] rounded-t-2xl sm:rounded-t-3xl p-6 relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedBuilder(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 z-10 hover:scale-110"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Profile Header */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="relative">
                    <img
                      src={selectedBuilder.Image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                      alt={selectedBuilder.Name}
                      className="w-20 h-20 rounded-2xl object-cover border-4 border-white/80 shadow-2xl"
                    />
                    {selectedBuilder.Verified && (
                      <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 text-white">
                  <h2 className="text-2xl font-bold mb-1 drop-shadow-lg">
                    {selectedBuilder.Name}
                  </h2>
                  <p className="text-blue-100 text-lg font-medium mb-3 drop-shadow-lg">
                    Professional Builder
                  </p>
                  
                  {/* Stats Row */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                      <Star className="w-4 h-4 text-yellow-300 fill-current" />
                      <span className="font-bold text-white text-sm">
                        {selectedBuilder.Rating || 'New'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                      <ClipboardList className="w-4 h-4 text-white" />
                      <span className="font-bold text-white text-sm">
                        {selectedBuilder.Projects_completed || 0} Projects
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pb-24 sm:pb-4">
              <div className="p-6 space-y-6">
                {/* Specialties Section */}
                {selectedBuilder.Specialties && selectedBuilder.Specialties.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
                    <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center">
                      <Award className="w-5 h-5 text-blue-600 mr-2" />
                      Specializations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedBuilder.Specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Experience */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 transform hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-green-600 font-semibold">Experience</p>
                        <p className="font-bold text-gray-900 text-lg">
                          {selectedBuilder.Experience || 'Not specified'}
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
                          {selectedBuilder.Location || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* License */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100 transform hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-orange-600 font-semibold">License</p>
                        <p className="font-bold text-gray-900 text-sm">
                          {selectedBuilder.License || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100 transform hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Home className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-xs text-cyan-600 font-semibold">Projects</p>
                        <p className="font-bold text-gray-900 text-lg">
                          {selectedBuilder.Projects_completed || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                {selectedBuilder.About && (
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-200">
                    <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center">
                      <Users className="w-5 h-5 text-gray-600 mr-2" />
                      About {selectedBuilder.Name.split(' ')[0]}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {selectedBuilder.About}
                    </p>
                  </div>
                )}

                {/* Verification Badge */}
                {selectedBuilder.Verified && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-800 text-sm">Verified Builder</p>
                        <p className="text-green-600 text-xs">Profile verified by Karia Mitra</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 pb-8 sm:pb-6 backdrop-blur-sm bg-white/95">
              <div className="grid grid-cols-2 gap-4">
                {/* WhatsApp Button */}
                <button
                  onClick={() => handleWhatsAppBooking(selectedBuilder)}
                  className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-base">WhatsApp</span>
                </button>

                {/* Call Button */}
                <button
                  onClick={handleCall}
                  className="group bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#0e1e55] text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <Phone className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-base">Call</span>
                </button>
              </div>
              
              {/* Contact Note */}
              <p className="text-xs text-gray-500 text-center mt-3">
                Contact Karia Mitra to connect with {selectedBuilder.Name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}