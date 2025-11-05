"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Phone, MessageCircle, X, Star, MapPin, Briefcase, Award, Clock, Users, Sparkles, ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContractorsPage() {
  const router = useRouter();
  const contractorTypes = [
    { 
      name: "POP", 
      color: "from-purple-500 to-pink-500",
      image: "/images/pop.jpg"
    },
    { 
      name: "RCC", 
      color: "from-blue-500 to-cyan-500",
      image: "/images/rcc.jpg"
    },
    { 
      name: "Electrician", 
      color: "from-yellow-500 to-orange-500",
      image: "/images/electrical.jpg"
    },
    { 
      name: "Plumbing", 
      color: "from-cyan-500 to-blue-500",
      image: "/images/plumbing.jpg"
    },
    { 
      name: "Painter", 
      color: "from-green-500 to-emerald-500",
      image: "/images/painting.jpg"
    }
  ];
  
  const [selectedType, setSelectedType] = useState(null);
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState(null);

  // ✅ Your (Mediator) WhatsApp number
  const mediatorNumber = "9480072737";

  // ✅ Fetch contractors when type is selected
  useEffect(() => {
    const fetchContractors = async () => {
      if (!selectedType) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("Contractor")
        .select(
          "id, name, expertise, rating, location, about, experience, site_completed, rate, image_url, phone"
        )
        .eq("expertise", selectedType)
        .eq("is_active", true)
        .order("rating", { ascending: false });

      if (error) {
        console.error("❌ Supabase error:", error);
        setContractors([]);
      } else {
        setContractors(data || []);
      }

      setLoading(false);
    };

    fetchContractors();
  }, [selectedType]);

  // ✅ WhatsApp booking function
  const handleWhatsAppBooking = (contractor) => {
    const message = `Hi Karia Mitra, I want to book ${contractor.name} (${contractor.expertise}). Please share their details and help me connect with them.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${mediatorNumber}?text=${encodedMessage}`, '_blank');
  };

  // ✅ Call function - just opens dialer without number
  const handleCall = () => {
    window.location.href = 'tel:';
  };

  // ✅ Handle image error - fallback to SVG placeholder
  const handleImageError = (e) => {
    const svgPlaceholder = `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#f3f4f6"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="#9ca3af">No Image</text>
      </svg>
    `)}`;
    e.target.src = svgPlaceholder;
  };

  // ✅ Handle service image error - fallback to colored background
  const handleServiceImageError = (e, type) => {
    e.target.style.display = 'none';
    const container = e.target.parentElement;
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = `w-full h-full flex items-center justify-center bg-gradient-to-r ${type.color} text-white font-bold text-2xl`;
    fallbackDiv.textContent = type.name;
    container.appendChild(fallbackDiv);
  };

  // ✅ Get image source - returns null if no image to avoid empty string
  const getImageSrc = (imageUrl) => {
    const trimmedUrl = imageUrl?.trim();
    return trimmedUrl && trimmedUrl.length > 0 ? trimmedUrl : null;
  };

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
                    Professional Contractors
                  </h1>
                  <p className="text-gray-600 text-xs">
                    Trusted home service experts
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500 bg-[#0e1e55]/5 px-2 py-1 rounded-full">
              <Check className="w-3 h-3 text-green-500" />
              <span>{contractorTypes.length} services</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service List - Mobile First Design */}
      <div className="px-3 py-4 pb-32">
        <div className="mb-4">
          <h2 className="text-base font-bold text-gray-900 mb-1">
            Available Services
          </h2>
          <p className="text-gray-600 text-xs">
            Tap to view contractors and contact
          </p>
        </div>

        {!selectedType ? (
          <div className="grid grid-cols-2 gap-3">
            {contractorTypes.map((type) => (
              <button
                key={type.name}
                onClick={() => {
                  setSelectedType(type.name);
                  setSelectedContractor(null);
                }}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-300 cursor-pointer active:scale-95"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-xl overflow-hidden border-2 border-gray-100">
                    <img 
                      src={type.image} 
                      alt={type.name}
                      className="w-full h-full object-cover"
                      onError={(e) => handleServiceImageError(e, type)}
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {type.name}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <>
            {/* Back Button */}
            <div className="mb-4">
              <button
                onClick={() => {
                  setSelectedType(null);
                  setContractors([]);
                  setSelectedContractor(null);
                }}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Services
              </button>
            </div>

            {/* Contractor List */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-gray-500 mt-2 text-sm">Finding {selectedType.toLowerCase()} contractors...</p>
              </div>
            )}

            {!loading && contractors.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  No {selectedType} Contractors
                </h3>
                <p className="text-gray-600 text-xs">
                  Check back later for available contractors
                </p>
              </div>
            )}

            {!loading && contractors.length > 0 && (
              <div className="grid grid-cols-1 gap-3">
                {contractors.map((contractor) => (
                  <div
                    key={contractor.id}
                    onClick={() => setSelectedContractor(contractor)}
                    className="group bg-white rounded-xl shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-300 cursor-pointer active:scale-95"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative flex-shrink-0">
                        {getImageSrc(contractor.image_url) ? (
                          <img
                            src={getImageSrc(contractor.image_url)}
                            alt={contractor.name}
                            className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-sm"
                            onError={handleImageError}
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-white shadow-sm flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-500" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm truncate">
                          {contractor.name}
                        </h3>
                        <p className="text-gray-500 text-xs truncate">
                          {contractor.expertise}
                        </p>
                        
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs font-semibold text-gray-700">
                              {contractor.rating || 'New'}
                            </span>
                          </div>
                          <span className="text-gray-300 text-xs">•</span>
                          <div className="flex items-center space-x-1 text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span className="text-xs truncate">{contractor.location || 'Location N/A'}</span>
                          </div>
                        </div>

                        {contractor.rate && (
                          <div className="flex items-center text-green-600 text-xs mt-1">
                            <span className="font-bold">₹{contractor.rate}/hr</span>
                          </div>
                        )}
                      </div>
                      
                      <ArrowLeft className="w-4 h-4 text-gray-400 flex-shrink-0 transform rotate-180" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Enhanced Contractor Detail Modal */}
      {selectedContractor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in duration-300">
          <div 
            className="bg-white rounded-t-2xl sm:rounded-3xl shadow-2xl w-full max-w-full sm:max-w-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] transform transition-all duration-300 scale-95 sm:scale-100 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Enhanced Header with Gradient */}
            <div className="bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] rounded-t-2xl sm:rounded-t-3xl p-6 relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedContractor(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 z-10 hover:scale-110"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Profile Header */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="relative">
                    <img
                      src={getImageSrc(selectedContractor.image_url) || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                      alt={selectedContractor.name}
                      className="w-20 h-20 rounded-2xl object-cover border-4 border-white/80 shadow-2xl"
                      onError={handleImageError}
                    />
                  </div>
                </div>
                
                <div className="flex-1 text-white">
                  <h2 className="text-2xl font-bold mb-1 drop-shadow-lg">
                    {selectedContractor.name}
                  </h2>
                  <p className="text-blue-100 text-lg font-medium mb-3 drop-shadow-lg">
                    {selectedContractor.expertise} Specialist
                  </p>
                  
                  {/* Stats Row */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                      <Star className="w-4 h-4 text-yellow-300 fill-current" />
                      <span className="font-bold text-white text-sm">
                        {selectedContractor.rating || 'New'}
                      </span>
                    </div>
                    {selectedContractor.site_completed && (
                      <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        <Award className="w-4 h-4 text-white" />
                        <span className="font-bold text-white text-sm">
                          {selectedContractor.site_completed} Projects
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Experience */}
                  {selectedContractor.experience && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 transform hover:scale-105 transition-transform duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-green-600 font-semibold">Experience</p>
                          <p className="font-bold text-gray-900 text-sm">
                            {selectedContractor.experience}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 transform hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-purple-600 font-semibold">Location</p>
                        <p className="font-bold text-gray-900 text-sm">
                          {selectedContractor.location || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rate */}
                  {selectedContractor.rate && (
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100 transform hover:scale-105 transition-transform duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-orange-600 font-semibold">Hourly Rate</p>
                          <p className="font-bold text-green-600 text-lg">
                            ₹{selectedContractor.rate}/hr
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {selectedContractor.site_completed && (
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100 transform hover:scale-105 transition-transform duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                          <Award className="w-6 h-6 text-cyan-600" />
                        </div>
                        <div>
                          <p className="text-xs text-cyan-600 font-semibold">Projects Done</p>
                          <p className="font-bold text-gray-900 text-lg">
                            {selectedContractor.site_completed}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* About Section */}
                {selectedContractor.about && (
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-200">
                    <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center">
                      <Users className="w-5 h-5 text-gray-600 mr-2" />
                      About {selectedContractor.name.split(' ')[0]}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {selectedContractor.about}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Action Buttons - Fixed positioning to avoid bottom nav overlap */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 backdrop-blur-sm bg-white/95 pb-24 sm:pb-6">
              <div className="grid grid-cols-2 gap-4">
                {/* WhatsApp Button */}
                <button
                  onClick={() => handleWhatsAppBooking(selectedContractor)}
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
                Contact Karia Mitra to connect with {selectedContractor.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}