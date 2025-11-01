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
    icon: <Wrench className="w-6 h-6 text-white" />
  },
  electrical: {
    title: "Electrical Contractors",
    description: "Specialists in wiring, lighting, and industrial power systems.",
    color: "from-yellow-500 to-amber-500",
    bgColor: "from-yellow-50 to-amber-50",
    icon: <Zap className="w-6 h-6 text-white" />
  },
  painting: {
    title: "Painting Contractors",
    description: "Professional interior and exterior painting with premium finishes.",
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-50 to-pink-50",
    icon: <Paintbrush className="w-6 h-6 text-white" />
  },
  flooring: {
    title: "Flooring Contractors",
    description: "Specialists in tiles, marble, wooden and epoxy flooring.",
    color: "from-amber-500 to-orange-500",
    bgColor: "from-amber-50 to-orange-50",
    icon: <Layout className="w-6 h-6 text-white" />
  },
  roofing: {
    title: "Roofing Contractors",
    description: "Professional roof installation and waterproofing services.",
    color: "from-red-500 to-rose-500",
    bgColor: "from-red-50 to-rose-50",
    icon: <Home className="w-6 h-6 text-white" />
  },
  hvac: {
    title: "HVAC Contractors",
    description: "Heating, ventilation, and air conditioning specialists.",
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50",
    icon: <Thermometer className="w-6 h-6 text-white" />
  },
  masonry: {
    title: "Masonry Contractors",
    description: "Brick, block, and concrete work experts.",
    color: "from-stone-500 to-gray-600",
    bgColor: "from-stone-50 to-gray-50",
    icon: <SquareStack className="w-6 h-6 text-white" />
  },
  interior: {
    title: "Interior Contractors",
    description: "False ceilings, partitions, and finishing works.",
    color: "from-indigo-500 to-purple-500",
    bgColor: "from-indigo-50 to-purple-50",
    icon: <Layout className="w-6 h-6 text-white" />
  },
  firefighting: {
    title: "Firefighting Contractors",
    description: "Fire safety and sprinkler system specialists.",
    color: "from-red-600 to-orange-500",
    bgColor: "from-red-50 to-orange-50",
    icon: <Shield className="w-6 h-6 text-white" />
  },
  cladding: {
    title: "Cladding Contractors",
    description: "Exterior finishing and facade specialists.",
    color: "from-gray-500 to-blue-500",
    bgColor: "from-gray-50 to-blue-50",
    icon: <Home className="w-6 h-6 text-white" />
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

  // ✅ If no valid category
  if (!details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30 px-4">
        <div className="text-center max-w-sm w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Category Not Found</h2>
          <p className="text-gray-600 mb-6">The category "{type}" doesn't exist.</p>
          <button
            onClick={() => router.push("/services/contractors")}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 w-full"
          >
            Back to Contractors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Enhanced Header */}
      <header className="bg-white shadow-lg border-b sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/services/contractors")}
                className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-105 group"
              >
                <ArrowLeft size={24} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>
              <div className="flex items-center space-x-4">
                <div className={`p-4 bg-gradient-to-r ${details.color} rounded-2xl shadow-lg`}>
                  {details.icon}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{details.title}</h1>
                  <p className="text-gray-600 text-sm sm:text-base mt-1">
                    {details.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter Bar */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search contractors by name, location, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="relative px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 font-semibold"
            >
              <Filter size={20} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {!loading && (
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <p className="text-gray-600 text-sm sm:text-base">
                Showing <span className="font-bold text-blue-600">{filteredContractors.length}</span> contractor{filteredContractors.length !== 1 ? 's' : ''}
                {searchTerm && ` for "${searchTerm}"`}
              </p>
              
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-500 hover:text-red-700 transition-colors flex items-center space-x-1 mt-2 sm:mt-0"
                >
                  <X size={16} />
                  <span>Clear all filters</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          categoryDetails={details}
        />
      )}
    </div>
  );
}

// Contractor Card Component
function ContractorCard({ contractor, index, onViewDetails }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTeamSize = (size) => {
    if (!size) return 'Individual';
    if (size <= 5) return 'Small Team';
    if (size <= 15) return 'Medium Team';
    return 'Large Team';
  };

  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => onViewDetails(contractor)}
    >
      {/* Header with Image */}
      <div className="h-48 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {contractor.image_url ? (
          <img
            src={contractor.image_url}
            alt={contractor.name}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl font-bold text-gray-400">
              {getInitials(contractor.name)}
            </div>
          </div>
        )}
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
        
        {/* Badge and Rating */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {contractor.badge && (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg capitalize">
              {contractor.badge}
            </span>
          )}
          
          {contractor.rating && (
            <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="text-white font-bold text-sm">
                {contractor.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-center space-x-2 text-gray-900 font-semibold">
              <Eye size={20} />
              <span>View Details</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contractor Info */}
      <div className="p-6">
        {/* Name and Expertise */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-1">
            {contractor.name}
          </h3>
          <p className="text-blue-600 font-semibold text-sm capitalize">
            {contractor.expertise}
          </p>
        </div>

        {/* Key Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin size={16} className="text-gray-400 flex-shrink-0" />
            <span className="line-clamp-1 text-xs">{contractor.location || 'Location not specified'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Briefcase size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs">{contractor.site_completed || 0} projects</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs">{formatTeamSize(contractor.team_size)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign size={16} className="text-green-500 flex-shrink-0" />
            <span className="text-xs font-semibold text-green-600">
              ${contractor.rate || 'N/A'}/hr
            </span>
          </div>
        </div>

        {/* Experience */}
        {contractor.experience && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
              <Clock size={14} />
              <span className="font-semibold">Experience</span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">{contractor.experience}</p>
          </div>
        )}

        {/* About Preview */}
        {contractor.about && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {contractor.about}
          </p>
        )}

        {/* Action Button */}
        <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform group-hover:scale-105 shadow-lg flex items-center justify-center space-x-2">
          <Eye size={18} />
          <span>View Profile</span>
        </button>
      </div>
    </div>
  );
}

// Contractor Modal Component
function ContractorModal({ contractor, onClose, categoryDetails }) {
  const [activeTab, setActiveTab] = useState('overview');

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTeamSize = (size) => {
    if (!size) return 'Individual Contractor';
    if (size <= 5) return `Small Team (${size} people)`;
    if (size <= 15) return `Medium Team (${size} people)`;
    return `Large Team (${size}+ people)`;
  };

  const renderWorks = () => {
    if (!contractor.works) return null;
    try {
      const works = typeof contractor.works === 'string' ? JSON.parse(contractor.works) : contractor.works;
      return (
        <div className="space-y-2">
          {works.map((work, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              <span>{work}</span>
            </div>
          ))}
        </div>
      );
    } catch {
      return <p className="text-gray-600 text-sm">{contractor.works}</p>;
    }
  };

  const renderReviews = () => {
    if (!contractor.reviews) return <p className="text-gray-600">No reviews yet.</p>;
    try {
      const reviews = typeof contractor.reviews === 'string' ? JSON.parse(contractor.reviews) : contractor.reviews;
      return (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < (review.rating || 5) ? "text-yellow-400 fill-current" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold">{review.author}</span>
              </div>
              <p className="text-gray-700 text-sm">{review.comment}</p>
              {review.date && (
                <p className="text-gray-500 text-xs mt-2">{review.date}</p>
              )}
            </div>
          ))}
        </div>
      );
    } catch {
      return <p className="text-gray-600 text-sm">{contractor.reviews}</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="relative h-48 bg-gradient-to-r from-gray-800 to-gray-900">
          {contractor.image_url ? (
            <img
              src={contractor.image_url}
              alt={contractor.name}
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl font-bold text-white opacity-40">
                {getInitials(contractor.name)}
              </div>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <X size={24} className="text-white" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{contractor.name}</h2>
                <p className="text-white/90 text-lg capitalize">{contractor.expertise}</p>
              </div>
              {contractor.rating && (
                <div className="text-right">
                  <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <Star size={20} className="text-yellow-400 fill-current" />
                    <span className="text-white font-bold text-lg">
                      {contractor.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-white/80 text-sm mt-1">Overall Rating</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-12rem)] overflow-y-auto">
          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-200 mb-6">
            {['overview', 'portfolio', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 font-semibold capitalize transition-all duration-200 border-b-2 ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <Briefcase className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{contractor.site_completed || 0}</div>
                  <div className="text-sm text-gray-600">Projects Done</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{contractor.team_size || 1}</div>
                  <div className="text-sm text-gray-600">Team Size</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">${contractor.rate || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Hourly Rate</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <Award className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 capitalize">{contractor.badge || 'Standard'}</div>
                  <div className="text-sm text-gray-600">Badge</div>
                </div>
              </div>

              {/* Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                      <MapPin size={18} className="text-blue-500" />
                      <span>Location</span>
                    </h4>
                    <p className="text-gray-700">{contractor.location || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                      <Clock size={18} className="text-purple-500" />
                      <span>Experience</span>
                    </h4>
                    <p className="text-gray-700">{contractor.experience || 'Not specified'}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                      <Users size={18} className="text-green-500" />
                      <span>Team</span>
                    </h4>
                    <p className="text-gray-700">{formatTeamSize(contractor.team_size)}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {contractor.about || 'No description provided.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-4">Services & Works</h4>
              {renderWorks()}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-4">Customer Reviews</h4>
              {renderReviews()}
            </div>
          )}

          {/* Contact Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {contractor.phone && (
                <button 
                  onClick={() => window.open(`tel:${contractor.phone}`, '_self')}
                  className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
                >
                  <Phone size={20} className="text-blue-500" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Call Now</div>
                    <div className="text-sm text-gray-600">{contractor.phone}</div>
                  </div>
                </button>
              )}
              
              {contractor.email && (
                <button 
                  onClick={() => window.open(`mailto:${contractor.email}`, '_self')}
                  className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
                >
                  <Mail size={20} className="text-green-500" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Send Email</div>
                    <div className="text-sm text-gray-600 truncate">{contractor.email}</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Filter Sidebar Component
function FilterSidebar({ filters, onFilterChange, onClose, onClearFilters }) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      ></div>
      
      <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-2xl transform transition-transform duration-300 animate-slide-in-right">
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto">
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
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
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
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
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
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">Any Team Size</option>
                <option value="1">Individual</option>
                <option value="5">Small Team (2-5)</option>
                <option value="10">Medium Team (6-10)</option>
                <option value="15">Large Team (11+)</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 space-y-3">
            <button
              onClick={onClearFilters}
              className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
            >
              Clear All Filters
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
          <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
          <div className="space-y-3">
            <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
            <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
            <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
            <div className="w-full h-12 bg-gray-200 rounded-xl mt-4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty State Component
function EmptyState({ searchTerm, onClearFilters, category }) {
  return (
    <div className="text-center py-16 bg-white rounded-2xl shadow-lg max-w-2xl mx-auto">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Users size={40} className="text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {searchTerm ? 'No matching contractors found' : `No ${category} Available`}
      </h3>
      <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
        {searchTerm 
          ? `We couldn't find any contractors matching "${searchTerm}". Try adjusting your search or filters.`
          : `There are no ${category.toLowerCase()} available at the moment. Please check back later or browse other categories.`
        }
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onClearFilters}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Clear Search & Filters
        </button>
      </div>
    </div>
  );
}

// Custom Styles
const styles = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
  }
  
  .animate-scale-in {
    animation: scale-in 0.3s ease-out forwards;
  }
  
  .animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out forwards;
  }
  
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
  
  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}