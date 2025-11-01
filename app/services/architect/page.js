'use client';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, MapPin, Building, Award, Calendar, DollarSign, User, Shield, CheckCircle, X } from 'lucide-react';

// Hardcoded credentials for testing
const SUPABASE_URL = 'https://tkdegywzonhbzdjfxosq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZGVneXd6b25oYnpkamZ4b3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzc0OTQsImV4cCI6MjA3Njk1MzQ5NH0.8M93KhrKWyxSacDwpebVElk6v3syDJCJElSs6O3NBoI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ArchitectServicePage() {
  const [architectures, setArchitectures] = useState([]);
  const [selectedArchitecture, setSelectedArchitecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArchitectures();
  }, []);

  const fetchArchitectures = async () => {
    try {
      console.log('Fetching data from Supabase...');
      
      const { data, error } = await supabase
        .from('architecture')
        .select('*')
        .order('name');

      if (error) throw error;
      
      console.log('Data fetched:', data);
      setArchitectures(data || []);
      
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]">
        {/* Loading Progress Bar */}
        <div className="w-full bg-gray-200 h-1.5">
          <div className="h-full bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] animate-pulse"></div>
        </div>

        {/* Header Skeleton */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="space-y-2">
                <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <div className="w-64 h-8 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
            <div className="w-96 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="space-y-3">
                  <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                  <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4 max-w-md">{error}</p>
          <button 
            onClick={fetchArchitectures}
            className="px-6 py-2 bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] text-white rounded-lg hover:opacity-90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show detailed view when an architecture is selected
  if (selectedArchitecture) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedArchitecture(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#0e1e55]/10 rounded-xl">
                  <Building className="w-8 h-8 text-[#0e1e55]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Architecture Details</h1>
                  <p className="text-gray-600">Explore architectural masterpiece</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
            <div className="relative h-64 sm:h-80 lg:h-96">
              <img 
                src={selectedArchitecture.image_url} 
                alt={selectedArchitecture.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                  {selectedArchitecture.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  {selectedArchitecture.verified && (
                    <div className="flex items-center space-x-1 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm">
                      <Shield className="w-4 h-4" />
                      <span>Verified</span>
                    </div>
                  )}
                  {selectedArchitecture.featured && (
                    <div className="flex items-center space-x-1 bg-yellow-500/90 text-white px-3 py-1 rounded-full text-sm">
                      <Award className="w-4 h-4" />
                      <span>Featured</span>
                    </div>
                  )}
                  {selectedArchitecture.rating && (
                    <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{selectedArchitecture.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Building className="w-6 h-6 mr-3 text-[#0e1e55]" />
                  Project Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-[#0e1e55]/5 rounded-xl">
                    <Award className="w-5 h-5 text-[#0e1e55]" />
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-semibold text-gray-900">{selectedArchitecture.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-[#1e3a8a]/5 rounded-xl">
                    <MapPin className="w-5 h-5 text-[#1e3a8a]" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold text-gray-900">{selectedArchitecture.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-[#1e40af]/5 rounded-xl">
                    <User className="w-5 h-5 text-[#1e40af]" />
                    <div>
                      <p className="text-sm text-gray-500">Architect</p>
                      <p className="font-semibold text-gray-900">{selectedArchitecture.architect_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-[#1d4ed8]/5 rounded-xl">
                    <Calendar className="w-5 h-5 text-[#1d4ed8]" />
                    <div>
                      <p className="text-sm text-gray-500">Year Built</p>
                      <p className="font-semibold text-gray-900">{selectedArchitecture.year_built}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-[#2563eb]/5 rounded-xl">
                    <DollarSign className="w-5 h-5 text-[#2563eb]" />
                    <div>
                      <p className="text-sm text-gray-500">Project Cost</p>
                      <p className="font-semibold text-gray-900">{selectedArchitecture.project_cost}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Architectural Style */}
              {selectedArchitecture.style_description && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Award className="w-6 h-6 mr-3 text-[#0e1e55]" />
                    Architectural Style
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {selectedArchitecture.style_description}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200">
                    Contact Architect
                  </button>
                  <button className="w-full border-2 border-[#0e1e55] text-[#0e1e55] hover:bg-[#0e1e55]/5 font-semibold py-3 px-4 rounded-xl transition-all duration-200">
                    View Portfolio
                  </button>
                  <button className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-4 rounded-xl transition-all duration-200">
                    Share Project
                  </button>
                </div>
              </div>

              {/* Project Highlights */}
              <div className="bg-gradient-to-br from-[#0e1e55] to-[#1e3a8a] rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Project Highlights</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>Professional Design</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>Structural Integrity</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>Modern Architecture</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>Sustainable Design</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#0e1e55]/10 rounded-xl">
                <Building className="w-8 h-8 text-[#0e1e55]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Famous Architectures</h1>
                <p className="text-gray-600">Explore iconic architectural masterpieces</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2 text-sm text-gray-500 bg-[#0e1e55]/5 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{architectures.length} architectures</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile counter */}
      <div className="sm:hidden bg-[#0e1e55]/5 border-b border-[#0e1e55]/10">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>{architectures.length} architectures</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Architectural Masterpieces
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Click on any architecture to explore detailed information about these iconic structures
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {architectures.map((architecture) => (
            <div 
              key={architecture.id} 
              className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              onClick={() => setSelectedArchitecture(architecture)}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={architecture.image_url} 
                  alt={architecture.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {architecture.featured && (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Featured
                    </span>
                  )}
                  {architecture.verified && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Verified
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 left-3">
                  {architecture.rating && (
                    <span className="bg-white/90 backdrop-blur-sm text-yellow-800 px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{architecture.rating}</span>
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0e1e55] transition-colors line-clamp-1">
                  {architecture.name}
                </h3>
                <p className="text-[#0e1e55] font-semibold mb-1 flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  {architecture.category}
                </p>
                <p className="text-gray-500 text-sm mb-4 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {architecture.location}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {architecture.architect_name}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {architecture.year_built}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {architectures.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Architectures Found</h3>
            <p className="text-gray-600">No architectural data available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}