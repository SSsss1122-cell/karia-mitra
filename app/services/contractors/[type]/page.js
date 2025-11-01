"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, MapPin, Clock, Phone, Shield, DollarSign, Mail, User, X, Zap } from "lucide-react";
import { supabase } from "../../../lib/supabase";

// ✅ Category configuration
const contractorDetails = {
  painting: {
    title: "Painting Contractors",
    description: "Professional interior and exterior painting with premium finishes.",
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-50 to-pink-50",
    icon: "🎨"
  },
  plumbing: {
    title: "Plumbing Contractors",
    description: "Experts in water supply, sanitary fittings, and bathroom installations.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50",
    icon: "🚰"
  },
  electrical: {
    title: "Electrical Contractors",
    description: "Specialists in wiring, lighting, and industrial power systems.",
    color: "from-yellow-500 to-amber-500",
    bgColor: "from-yellow-50 to-amber-50",
    icon: "⚡"
  },
  flooring: {
    title: "Flooring Contractors",
    description: "Specialists in tiles, marble, wooden and epoxy flooring.",
    color: "from-amber-500 to-orange-500",
    bgColor: "from-amber-50 to-orange-50",
    icon: "🔨"
  },
  roofing: {
    title: "Roofing Contractors",
    description: "Professional roof installation and waterproofing services.",
    color: "from-red-500 to-rose-500",
    bgColor: "from-red-50 to-rose-50",
    icon: "🏠"
  }
};

export default function ContractorDetailPage() {
  const { type } = useParams();
  const router = useRouter();
  const details = contractorDetails[type];
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContractor, setSelectedContractor] = useState(null);

  // ✅ Fetch contractors based on category
  useEffect(() => {
    async function fetchContractors() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const categoryVariations = [
          type.charAt(0).toUpperCase() + type.slice(1),
          type.toLowerCase(),
          type,
        ];

        let contractorsData = [];

        for (const category of categoryVariations) {
          const { data, error } = await supabase
            .from("contractors")
            .select("*")
            .eq("category", category)
            .order("name", { ascending: true });

          if (!error && data && data.length > 0) {
            contractorsData = data;
            break;
          }
        }

        setContractors(contractorsData);

      } catch (err) {
        console.error("Error loading contractors:", err);
      } finally {
        setLoading(false);
      }
    }

    if (type) {
      fetchContractors();
    }
  }, [type]);

  // ✅ If no valid category
  if (!details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Category Not Found</h2>
          <p className="text-gray-600 mb-6">The category "{type}" doesn't exist.</p>
          <button
            onClick={() => router.push("/services/contractors")}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors w-full"
          >
            Back to Contractors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile Optimized */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push("/services/contractors")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className={`p-3 bg-gradient-to-r ${details.color} rounded-xl shadow-lg flex-shrink-0`}>
                <span className="text-xl text-white">{details.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {details.title}
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm truncate">
                  {details.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-3 sm:px-4 lg:px-6 py-6">
        {/* Results Count */}
        {!loading && contractors.length > 0 && (
          <div className="mb-4 text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              {contractors.length} professional{contractors.length !== 1 ? 's' : ''} available
            </p>
          </div>
        )}

        {/* Contractor List - Mobile Optimized */}
        {loading ? (
         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Simple Karia Mitra Progress Bar */}
      <div className="w-full bg-gray-200 h-1.5">
        <div className="h-full bg-orange-500 animate-pulse"></div>
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
        ) : contractors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm mx-auto max-w-sm">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">👷</span>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">No Contractors Available</h3>
            <p className="text-gray-600 text-sm mb-4 px-4">
              No {details.title.toLowerCase()} found at the moment.
            </p>
            <button
              onClick={() => router.push("/services/contractors")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm mx-4"
            >
              Browse Other Categories
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-2xl mx-auto">
            {contractors.map((contractor, index) => (
              <div
                key={contractor.id}
                className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 ${
                  index !== contractors.length - 1 ? 'border-b border-gray-100' : ''
                }`}
                onClick={() => setSelectedContractor(contractor)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {contractor.name}
                      </h3>
                      <p className="text-gray-500 text-xs truncate">Tap to view details</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {contractor.verified && (
                      <Shield className="w-4 h-4 text-green-500" title="Verified" />
                    )}
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Contractor Detail Modal - Mobile Optimized */}
      {selectedContractor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Contractor Details</h2>
                <button
                  onClick={() => setSelectedContractor(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Contractor Info */}
              <div className="space-y-4">
                {/* Name and Verification */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl flex items-center justify-center flex-shrink-0">
                    {type === 'electrical' ? (
                      <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500" />
                    ) : (
                      <User className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                      {selectedContractor.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-gray-600 text-sm capitalize">{selectedContractor.category}</p>
                      {selectedContractor.verified && (
                        <span className="flex items-center space-x-1 text-green-600 text-xs">
                          <Shield className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 gap-3">
                  {/* Location */}
                  {selectedContractor.location && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-sm">Service Area</p>
                        <p className="text-gray-600 text-sm truncate">{selectedContractor.location}</p>
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {selectedContractor.experience && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-sm">Experience</p>
                        <p className="text-gray-600 text-sm">{selectedContractor.experience}</p>
                      </div>
                    </div>
                  )}

                  {/* Rating */}
                  {selectedContractor.rating && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-sm">Rating</p>
                        <p className="text-gray-600 text-sm">{selectedContractor.rating.toFixed(1)}/5</p>
                      </div>
                    </div>
                  )}

                  {/* Pricing */}
                  {selectedContractor.charges && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <DollarSign className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-sm">Service Charges</p>
                        <p className="text-gray-600 text-sm">{selectedContractor.charges}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {selectedContractor.bio && (
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">About</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{selectedContractor.bio}</p>
                  </div>
                )}

                {/* Availability */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-900 text-sm">Availability</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedContractor.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedContractor.available ? 'Available' : 'Not Available'}
                  </span>
                </div>

                {/* Contact Actions */}
                <div className="flex flex-col gap-2 pt-2">
                  {selectedContractor.phone && (
                    <button 
                      onClick={() => window.open(`tel:${selectedContractor.phone}`, '_self')}
                      className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 font-semibold text-sm"
                    >
                      <Phone size={18} />
                      <span>Call {selectedContractor.name.split(' ')[0]}</span>
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      const message = `Hi ${selectedContractor.name}, I'm interested in your ${selectedContractor.category} services.`;
                      alert(`Message: ${message}\nPhone: ${selectedContractor.phone || 'Not available'}`);
                    }}
                    className="border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 font-semibold text-sm"
                  >
                    <Mail size={18} />
                    <span>Send Message</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for slide-up animation */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}