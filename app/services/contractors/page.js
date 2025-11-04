"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Phone, MessageCircle, X, Star, MapPin, Briefcase, Award, Clock, Users, Sparkles } from "lucide-react";

export default function ContractorsPage() {
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

  // ✅ WhatsApp link to your number with contractor info
  const getWhatsappLink = (contractor) => {
    const message = `Hi, I want to book ${contractor.name} (${contractor.expertise}). Please share their details.`;
    return `https://wa.me/${mediatorNumber}?text=${encodeURIComponent(message)}`;
  };

  // ✅ Handle WhatsApp click (closes modal)
  const handleWhatsappClick = (contractor) => {
    window.open(getWhatsappLink(contractor), "_blank");
    setSelectedContractor(null); // Close modal after clicking
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Enhanced Header */}
      <div className="bg-white shadow-2xl border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Professional Contractors
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover trusted experts for your construction and home improvement projects
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Type Selector Cards - Only show when no category is selected */}
        {!selectedType && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Choose Your Service
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Select from our premium contractor categories to find the perfect expert
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              {contractorTypes.map((type) => (
                <button
                  key={type.name}
                  onClick={() => {
                    setSelectedType(type.name);
                    setSelectedContractor(null);
                  }}
                  className="group relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-3xl"
                >
                  {/* Full-size Image Container with Overlay */}
                  <div className="relative w-full h-48 overflow-hidden">
                    <img 
                      src={type.image} 
                      alt={type.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => handleServiceImageError(e, type)}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Service Name Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold drop-shadow-lg">
                          {type.name}
                        </h3>
                        <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200" />
                      </div>
                      <div className="w-12 h-1 bg-white/80 rounded-full mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 delay-100" />
                    </div>
                  </div>
                  
                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-3xl transition-all duration-300" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Back Button - Show when a category is selected */}
        {selectedType && (
          <div className="mb-8">
            <button
              onClick={() => {
                setSelectedType(null);
                setContractors([]);
                setSelectedContractor(null);
              }}
              className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-semibold text-lg transition-all duration-200 hover:gap-4 group"
            >
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
              Back to All Services
            </button>
          </div>
        )}

        {/* Contractor List Section - Only show when category is selected */}
        {selectedType && (
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {selectedType} Specialists
                </h3>
                <p className="text-gray-600 mt-2 text-lg">
                  Top-rated {selectedType.toLowerCase()} professionals in your area
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg">
                {contractors.length} Experts Available
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                </div>
                <p className="text-gray-500 mt-6 text-lg">Finding the best {selectedType.toLowerCase()} contractors...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && contractors.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-12 h-12 text-blue-500" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">
                  No {selectedType} Experts Available
                </h4>
                <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
                  We're working on adding more {selectedType.toLowerCase()} professionals. Please check back soon.
                </p>
                <button
                  onClick={() => setSelectedType(null)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Explore Other Services
                </button>
              </div>
            )}

            {/* Contractor Grid */}
            {!loading && contractors.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {contractors.map((contractor) => (
                  <div
                    key={contractor.id}
                    onClick={() => setSelectedContractor(contractor)}
                    className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer"
                  >
                    {/* Contractor Header with Enhanced Design */}
                    <div className="p-6 bg-white border-b border-gray-200">
                      <div className="flex items-center space-x-5">
                        <div className="relative">
                          {getImageSrc(contractor.image_url) ? (
                            <img
                              src={getImageSrc(contractor.image_url)}
                              alt={contractor.name}
                              className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                              onError={handleImageError}
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 border-4 border-white shadow-lg flex items-center justify-center">
                              <Users className="w-10 h-10 text-blue-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-xl truncate">
                            {contractor.name}
                          </h4>
                          <p className="text-blue-600 font-semibold text-base">
                            {contractor.expertise}
                          </p>
                          <div className="flex items-center space-x-3 mt-2">
                            <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
                              <Star className="w-5 h-5 text-yellow-500 fill-current" />
                              <span className="text-sm font-bold text-gray-800">
                                {contractor.rating || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contractor Details */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center space-x-3 text-base text-gray-600">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">{contractor.location || "Location not specified"}</span>
                      </div>
                      
                      {contractor.experience && (
                        <div className="flex items-center space-x-3 text-base text-gray-600">
                          <Briefcase className="w-5 h-5 text-green-500" />
                          <span className="font-medium">{contractor.experience}</span>
                        </div>
                      )}

                      {contractor.site_completed && (
                        <div className="flex items-center space-x-3 text-base text-gray-600">
                          <Award className="w-5 h-5 text-purple-500" />
                          <span className="font-medium">{contractor.site_completed} projects completed</span>
                        </div>
                      )}

                      {contractor.rate && (
                        <div className="flex items-center space-x-3 text-base text-gray-600">
                          <Clock className="w-5 h-5 text-orange-500" />
                          <span className="font-bold text-green-600 text-lg">₹{contractor.rate}/hr</span>
                        </div>
                      )}
                    </div>

                    {/* View Details Button */}
                    <div className="px-6 pb-6">
                      <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 group-hover:scale-105 shadow-lg hover:shadow-xl transform">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No Type Selected State */}
        {!selectedType && (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Users className="w-16 h-16 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Select Your Service Type
            </h3>
            <p className="text-gray-600 text-xl max-w-md mx-auto leading-relaxed">
              Browse our premium contractor categories to find the perfect expert for your project needs
            </p>
          </div>
        )}
      </main>

      {/* Enhanced Contractor Details Modal */}
      {selectedContractor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-3xl relative animate-in zoom-in duration-300">
            {/* Close button */}
            <button
              onClick={() => setSelectedContractor(null)}
              className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-gray-100 transition-all duration-200 z-10 shadow-2xl hover:scale-110"
            >
              <X size={24} className="text-gray-600" />
            </button>

            {/* Profile Header with Enhanced Gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 rounded-t-3xl">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {getImageSrc(selectedContractor.image_url) ? (
                    <img
                      src={getImageSrc(selectedContractor.image_url)}
                      alt={selectedContractor.name}
                      className="w-24 h-24 rounded-3xl object-cover border-4 border-white/80 shadow-2xl"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-3xl bg-white/20 border-4 border-white/80 shadow-2xl flex items-center justify-center">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-white">
                  <h2 className="text-3xl font-bold drop-shadow-lg mb-2">
                    {selectedContractor.name}
                  </h2>
                  <p className="text-blue-100 text-xl font-medium drop-shadow-lg mb-3">
                    {selectedContractor.expertise} Specialist
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                      <Star className="w-6 h-6 text-yellow-300 fill-current drop-shadow-lg" />
                      <span className="font-bold text-white drop-shadow-lg text-lg">
                        {selectedContractor.rating || "N/A"} Rating
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-8 space-y-6 max-h-96 overflow-y-auto">
              {selectedContractor.about && (
                <div>
                  <h3 className="font-bold text-gray-900 text-xl mb-4 flex items-center space-x-3">
                    <Briefcase className="w-6 h-6 text-blue-500" />
                    <span>About</span>
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-xl text-lg border border-blue-100">
                    {selectedContractor.about}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                {selectedContractor.experience && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-sm text-gray-600 font-medium mb-2">Experience</p>
                    <p className="font-bold text-gray-900 text-lg">{selectedContractor.experience}</p>
                  </div>
                )}

                {selectedContractor.site_completed && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                    <p className="text-sm text-gray-600 font-medium mb-2">Projects Completed</p>
                    <p className="font-bold text-gray-900 text-lg">{selectedContractor.site_completed}</p>
                  </div>
                )}

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                  <p className="text-sm text-gray-600 font-medium mb-2">Location</p>
                  <p className="font-bold text-gray-900 text-lg">{selectedContractor.location || "Not specified"}</p>
                </div>

                {selectedContractor.rate && (
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100">
                    <p className="text-sm text-gray-600 font-medium mb-2">Hourly Rate</p>
                    <p className="font-bold text-green-600 text-xl">₹{selectedContractor.rate}/hr</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-8 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
              <div className="flex flex-col sm:flex-row gap-4">
                {selectedContractor.phone && (
                  <>
                    <a
                      href={`tel:${selectedContractor.phone}`}
                      className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <Phone size={24} />
                      <span>Call Now</span>
                    </a>

                    <button
                      onClick={() => handleWhatsappClick(selectedContractor)}
                      className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <MessageCircle size={24} />
                      <span>Book on WhatsApp</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}