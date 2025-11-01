"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Star, MapPin, Clock, Phone, Shield, DollarSign, Mail, 
  User, X, Zap, Wrench, Paintbrush, Home, Thermometer, SquareStack, 
  Layout, Users, Briefcase, Award, CheckCircle, Calendar,
  Filter, Search, Eye
} from "lucide-react";
import { supabase } from "../../../lib/supabase";

// ✅ Enhanced Category configuration matching your database expertise
const contractorDetails = {
  plumbing: {
    title: "Plumbing Contractors",
    description: "Experts in water supply, sanitary fittings, and bathroom installations.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50",
    icon: <Wrench className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
  },
  electrical: {
    title: "Electrical Contractors",
    description: "Specialists in wiring, lighting, and industrial power systems.",
    color: "from-yellow-500 to-amber-500",
    bgColor: "from-yellow-50 to-amber-50",
    icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
  },
  painting: {
    title: "Painting Contractors",
    description: "Professional interior and exterior painting with premium finishes.",
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-50 to-pink-50",
    icon: <Paintbrush className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
  },
  flooring: {
    title: "Flooring Contractors",
    description: "Specialists in tiles, marble, wooden and epoxy flooring.",
    color: "from-amber-500 to-orange-500",
    bgColor: "from-amber-50 to-orange-50",
    icon: <Layout className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
  },
  roofing: {
    title: "Roofing Contractors",
    description: "Professional roof installation and waterproofing services.",
    color: "from-red-500 to-rose-500",
    bgColor: "from-red-50 to-rose-50",
    icon: <Home className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
  },
  hvac: {
    title: "HVAC Contractors",
    description: "Heating, ventilation, and air conditioning specialists.",
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50",
    icon: <Thermometer className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
  },
  masonry: {
    title: "Masonry Contractors",
    description: "Brick, block, and concrete work experts.",
    color: "from-stone-500 to-gray-600",
    bgColor: "from-stone-50 to-gray-50",
    icon: <SquareStack className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
  },
  interior: {
    title: "Interior Contractors",
    description: "False ceilings, partitions, and finishing works.",
    color: "from-indigo-500 to-purple-500",
    bgColor: "from-indigo-50 to-purple-50",
    icon: <Layout className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
  },
  firefighting: {
    title: "Firefighting Contractors",
    description: "Fire safety and sprinkler system specialists.",
    color: "from-red-600 to-orange-500",
    bgColor: "from-red-50 to-orange-50",
    icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
  },
  cladding: {
    title: "Cladding Contractors",
    description: "Exterior finishing and facade specialists.",
    color: "from-gray-500 to-blue-500",
    bgColor: "from-gray-50 to-blue-50",
    icon: <Home className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
  }
};

export default function ContractorDetailPage() {
  const { type } = useParams();
  const router = useRouter();
  const details = contractorDetails[type];
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [filters, setFilters] = useState({
    location: "",
    minRating: 0,
    maxRate: 1000,
    teamSize: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // ✅ Fetch contractors based on expertise from your Supabase table
  useEffect(() => {
    async function fetchContractors() {
      if (!supabase) {
        console.error("Supabase client not initialized");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Convert type to match possible expertise values in database
        const expertiseVariations = [
          type.charAt(0).toUpperCase() + type.slice(1),
          type.toLowerCase(),
          type.toUpperCase(),
        ];

        let query = supabase
          .from("Contractor")
          .select("*")
          .eq("is_active", true);

        // Try different variations of expertise
        const expertiseConditions = expertiseVariations.map(exp => 
          `expertise.ilike.%${exp}%`
        ).join(',');

        query = query.or(expertiseConditions);

        // Apply additional filters
        if (filters.location) {
          query = query.ilike('location', `%${filters.location}%`);
        }
        if (filters.minRating > 0) {
          query = query.gte('rating', filters.minRating);
        }
        if (filters.maxRate < 1000) {
          query = query.lte('rate', filters.maxRate);
        }
        if (filters.teamSize) {
          query = query.eq('team_size', parseInt(filters.teamSize));
        }

        const { data, error } = await query;

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        console.log("Fetched contractors:", data);
        setContractors(data || []);

      } catch (err) {
        console.error("Error loading contractors:", err);
        setContractors([]);
      } finally {
        setLoading(false);
      }
    }

    if (type) {
      fetchContractors();
    }
  }, [type, filters]);

  // Filter contractors by search term
  const filteredContractors = contractors.filter(contractor =>
    contractor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.expertise?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      minRating: 0,
      maxRate: 1000,
      teamSize: ""
    });
    setSearchTerm("");
  };

  const activeFiltersCount = Object.values(filters).filter(val => 
    val !== "" && val !== 0 && val !== 1000
  ).length;

  // Handle phone call
  const handleCall = (phoneNumber) => {
    if (!phoneNumber) {
      alert('Phone number not available.');
      return;
    }
    window.location.href = `tel:${phoneNumber}`;
  };

  // ✅ If no valid category
  if (!details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-sm w-full bg-white rounded-2xl shadow-lg p-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl sm:text-2xl">❌</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Category Not Found</h2>
          <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">The category "{type}" doesn't exist.</p>
          <button
            onClick={() => router.push("/services/contractors")}
            className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-blue-600 transition-all duration-300 w-full text-sm sm:text-base"
          >
            Back to Contractors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-6 sm:pb-8">
      {/* Enhanced Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => router.push("/services/contractors")}
                className="p-2 sm:p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className={`p-2 sm:p-3 md:p-4 bg-gradient-to-r ${details.color} rounded-xl sm:rounded-2xl shadow-lg`}>
                  {details.icon}
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    {details.title}
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-none">
                    {details.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter Bar */}
      <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search contractors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm sm:text-base"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="relative px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-500 text-white rounded-lg sm:rounded-xl hover:bg-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold text-sm sm:text-base mt-2 sm:mt-0"
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {!loading && (
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <p className="text-gray-600 text-xs sm:text-sm">
                Showing <span className="font-bold text-blue-600">{filteredContractors.length}</span> contractor{filteredContractors.length !== 1 ? 's' : ''}
                {searchTerm && ` for "${searchTerm}"`}
              </p>
              
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs sm:text-sm text-red-500 hover:text-red-700 transition-colors flex items-center space-x-1"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Clear all filters</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <LoadingSkeleton />
          ) : filteredContractors.length === 0 ? (
            <EmptyState 
              searchTerm={searchTerm}
              onClearFilters={clearFilters}
              category={details.title}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {filteredContractors.map((contractor, index) => (
                <ContractorCard 
                  key={contractor.id} 
                  contractor={contractor} 
                  index={index}
                  onViewDetails={setSelectedContractor}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Filter Sidebar */}
      {showFilters && (
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClose={() => setShowFilters(false)}
          onClearFilters={clearFilters}
        />
      )}

      {/* Contractor Detail Modal */}
      {selectedContractor && (
        <ContractorModal
          contractor={selectedContractor}
          onClose={() => setSelectedContractor(null)}
          onCall={handleCall}
        />
      )}
    </div>
  );
}

// Contractor Card Component - Mobile Responsive
function ContractorCard({ contractor, index, onViewDetails }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'C';
  };

  return (
    <div 
      className="group bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-100 overflow-hidden hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => onViewDetails(contractor)}
    >
      {/* Profile Section with Round Photo */}
      <div className="p-4 sm:p-5 md:p-6">
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Round Profile Photo */}
          <div className="relative flex-shrink-0">
            {contractor.image_url ? (
              <div className="relative">
                <img
                  src={contractor.image_url}
                  alt={contractor.name}
                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-white shadow-md ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
                {/* Rating Badge */}
                {contractor.rating && (
                  <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1 border-2 border-white shadow-sm">
                    <div className="flex items-center space-x-0.5">
                      <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white fill-current" />
                      <span className="text-white text-[10px] sm:text-xs font-bold">
                        {contractor.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <div className="text-white font-bold text-sm sm:text-base md:text-lg">
                    {getInitials(contractor.name)}
                  </div>
                </div>
                {/* Rating Badge for default avatar */}
                {contractor.rating && (
                  <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1 border-2 border-white shadow-sm">
                    <div className="flex items-center space-x-0.5">
                      <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white fill-current" />
                      <span className="text-white text-[10px] sm:text-xs font-bold">
                        {contractor.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Contractor Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1 mb-1">
              {contractor.name || 'Unknown Contractor'}
            </h3>
            
            <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 flex-shrink-0" />
              <span className="line-clamp-1">{contractor.location || 'Location not specified'}</span>
            </div>

            {contractor.expertise && (
              <p className="text-blue-600 font-semibold text-xs sm:text-sm capitalize line-clamp-1">
                {contractor.expertise}
              </p>
            )}

            {/* Additional Info */}
            <div className="flex items-center space-x-2 sm:space-x-3 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-gray-500">
              {contractor.experience && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="line-clamp-1">{contractor.experience}</span>
                </div>
              )}
              {contractor.site_completed > 0 && (
                <div className="flex items-center space-x-1">
                  <Briefcase className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>{contractor.site_completed} projects</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <button className="w-full mt-3 sm:mt-4 bg-blue-500 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 flex items-center justify-center space-x-2 text-xs sm:text-sm">
          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
}

// Contractor Modal Component - Mobile Responsive
function ContractorModal({ contractor, onClose, onCall }) {
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'C';
  };

  const formatTeamSize = (size) => {
    if (!size) return 'Individual Contractor';
    if (size <= 5) return `Small Team (${size} people)`;
    if (size <= 15) return `Medium Team (${size} people)`;
    return `Large Team (${size}+ people)`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header with Round Photo */}
        <div className="relative p-4 sm:p-5 md:p-6 bg-gradient-to-r from-gray-800 to-gray-900">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Round Profile Photo */}
            <div className="relative flex-shrink-0">
              {contractor.image_url ? (
                <img
                  src={contractor.image_url}
                  alt={contractor.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover border-3 sm:border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center border-3 sm:border-4 border-white shadow-lg">
                  <div className="text-white font-bold text-base sm:text-lg md:text-xl">
                    {getInitials(contractor.name)}
                  </div>
                </div>
              )}
              
              {/* Rating Badge */}
              {contractor.rating && (
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-yellow-500 rounded-full p-1 sm:p-1.5 border-2 border-white shadow-lg">
                  <div className="flex items-center space-x-0.5">
                    <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-white fill-current" />
                    <span className="text-white text-[10px] sm:text-xs font-bold">
                      {contractor.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 leading-tight">
                {contractor.name || 'Unknown Contractor'}
              </h2>
              <p className="text-white/90 text-xs sm:text-sm capitalize line-clamp-1">
                {contractor.expertise || 'Contractor'}
              </p>
              
              <div className="flex items-center space-x-1.5 sm:space-x-2 mt-1.5 sm:mt-2">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/80" />
                <span className="text-white/80 text-xs sm:text-sm line-clamp-1">
                  {contractor.location || 'Location not specified'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 md:p-6 max-h-[calc(85vh-8rem)] sm:max-h-[calc(90vh-12rem)] overflow-y-auto">
          {/* Key Details */}
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            {contractor.experience && (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Experience</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{contractor.experience}</p>
                </div>
              </div>
            )}

            {contractor.team_size && (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Team Size</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{formatTeamSize(contractor.team_size)}</p>
                </div>
              </div>
            )}

            {contractor.rate && (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Hourly Rate</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">${contractor.rate}/hr</p>
                </div>
              </div>
            )}

            {contractor.site_completed > 0 && (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Projects Completed</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{contractor.site_completed}</p>
                </div>
              </div>
            )}
          </div>

          {/* About Section */}
          {contractor.about && (
            <div className="mb-4 sm:mb-6">
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">About</h4>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                {contractor.about}
              </p>
            </div>
          )}

          {/* Contact Actions */}
          <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-gray-200">
            {contractor.phone && (
              <button 
                onClick={() => onCall(contractor.phone)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Call {contractor.name?.split(' ')[0] || 'Contractor'}</span>
              </button>
            )}
            
            {contractor.email && (
              <button 
                onClick={() => window.open(`mailto:${contractor.email}`, '_self')}
                className="w-full border border-blue-500 sm:border-2 text-blue-500 hover:bg-blue-50 font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Send Email</span>
              </button>
            )}

            {!contractor.phone && !contractor.email && (
              <p className="text-gray-500 text-xs sm:text-sm text-center py-3 sm:py-4">
                No contact information available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Filter Sidebar Component - Mobile Responsive
function FilterSidebar({ filters, onFilterChange, onClose, onClearFilters }) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      ></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl">
        <div className="p-4 sm:p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6 flex-1 overflow-y-auto">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter location..."
                value={filters.location}
                onChange={(e) => onFilterChange('location', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
              />
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating: {filters.minRating}+
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.minRating}
                onChange={(e) => onFilterChange('minRating', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>5</span>
              </div>
            </div>

            {/* Rate Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Rate: ${filters.maxRate}/hr
              </label>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={filters.maxRate}
                onChange={(e) => onFilterChange('maxRate', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$50</span>
                <span>$1000</span>
              </div>
            </div>

            {/* Team Size Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Size
              </label>
              <select
                value={filters.teamSize}
                onChange={(e) => onFilterChange('teamSize', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
              >
                <option value="">Any Team Size</option>
                <option value="1">Individual</option>
                <option value="5">Small Team (2-5)</option>
                <option value="10">Medium Team (6-10)</option>
                <option value="15">Large Team (11+)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 sm:pt-6 border-t border-gray-200 space-y-2 sm:space-y-3">
            <button
              onClick={onClearFilters}
              className="w-full py-2.5 sm:py-3 px-4 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base"
            >
              Clear All Filters
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 sm:py-3 px-4 bg-blue-500 text-white rounded-lg sm:rounded-xl hover:bg-blue-600 transition-all duration-200 text-sm sm:text-base"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading Skeleton Component - Mobile Responsive
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-4 sm:p-5 md:p-6 animate-pulse">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2 sm:space-y-3">
              <div className="w-3/4 h-3 sm:h-4 bg-gray-200 rounded"></div>
              <div className="w-1/2 h-2.5 sm:h-3 bg-gray-200 rounded"></div>
              <div className="w-2/3 h-2.5 sm:h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="w-full h-8 sm:h-10 bg-gray-200 rounded-lg mt-3 sm:mt-4"></div>
        </div>
      ))}
    </div>
  );
}

// Empty State Component - Mobile Responsive
function EmptyState({ searchTerm, onClearFilters, category }) {
  return (
    <div className="text-center py-8 sm:py-12 md:py-16 bg-white rounded-xl sm:rounded-2xl shadow-lg max-w-sm sm:max-w-md md:max-w-2xl mx-auto px-4 sm:px-6">
      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
        <Users className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-gray-400" />
      </div>
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
        {searchTerm ? 'No matching contractors found' : `No ${category} Available`}
      </h3>
      <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 max-w-md mx-auto">
        {searchTerm 
          ? `We couldn't find any contractors matching "${searchTerm}". Try adjusting your search or filters.`
          : `There are no ${category.toLowerCase()} available at the moment. Please check back later or browse other categories.`
        }
      </p>
      <button
        onClick={onClearFilters}
        className="bg-blue-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 text-sm sm:text-base"
      >
        Clear Search & Filters
      </button>
    </div>
  );
}