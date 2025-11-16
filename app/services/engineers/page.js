'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle, 
  X, 
  Briefcase, 
  Award, 
  Clock,
  GraduationCap,
  Wrench,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

export default function EngineersPage() {
  const [engineers, setEngineers] = useState([]);
  const [filteredEngineers, setFilteredEngineers] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [engineerWorkImages, setEngineerWorkImages] = useState([]);
  const [loadingWorkImages, setLoadingWorkImages] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const mediatorNumber = "9480072737";

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
        
        // Only set data from Supabase, no dummy data
        console.log('Fetched engineers from database:', data);
        setEngineers(data || []);
        setFilteredEngineers(data || []);
      } catch (err) {
        console.error('Error fetching engineers:', err);
        setEngineers([]);
        setFilteredEngineers([]);
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

  const fetchEngineerWorkImages = async (engineerId) => {
    setLoadingWorkImages(true);
    setEngineerWorkImages([]);
    
    try {
      console.log("=== FETCHING WORK IMAGES FOR ENGINEER:", engineerId, "===");
      
      // First, check if engineer has work images in database works field
      const { data: engineerData, error: dbError } = await supabase
        .from('Engineer')
        .select('works')
        .eq('id', engineerId)
        .single();

      if (!dbError && engineerData.works && Array.isArray(engineerData.works)) {
        const validDbImages = engineerData.works.filter(url => 
          url && typeof url === 'string' && url.trim() !== '' && url.startsWith('http')
        );
        
        if (validDbImages.length > 0) {
          console.log("Found work images in database:", validDbImages);
          setEngineerWorkImages(validDbImages);
          setLoadingWorkImages(false);
          return;
        }
      }

      // If no images in database, check storage bucket
      console.log("No images in database, checking storage bucket...");
      
      // List all files in the work-images folder
      const { data: files, error: listError } = await supabase
        .storage
        .from('partner-profile')
        .list('work-images', {
          limit: 1000,
          offset: 0,
          sortBy: { column: 'name', order: 'desc' }
        });

      if (listError) {
        console.error("Error listing work-images folder:", listError);
        setEngineerWorkImages([]);
        setLoadingWorkImages(false);
        return;
      }

      console.log("All files in work-images folder:", files);

      if (!files || files.length === 0) {
        console.log("No files found in work-images folder");
        setEngineerWorkImages([]);
        setLoadingWorkImages(false);
        return;
      }

      // Filter files for this specific engineer
      const engineerFiles = files.filter(file => {
        const fileName = file.name.toLowerCase();
        
        // Pattern for engineer work images
        const engineerPatterns = [
          `work_engineer_${engineerId}_`,
          `engineer_${engineerId}_`,
          `work_engineer${engineerId}_`,
          `engineer${engineerId}_`
        ];

        return engineerPatterns.some(pattern => 
          fileName.includes(pattern.toLowerCase())
        );
      });

      console.log(`Found ${engineerFiles.length} work images for engineer ${engineerId}:`, engineerFiles);

      // Get public URLs for matching files
      const workImageUrls = [];
      for (const file of engineerFiles) {
        const { data: { publicUrl } } = supabase.storage
          .from('partner-profile')
          .getPublicUrl(`work-images/${file.name}`);

        console.log(`Work image URL: ${publicUrl}`);
        workImageUrls.push(publicUrl);
      }

      console.log("Final work image URLs:", workImageUrls);
      setEngineerWorkImages(workImageUrls);

    } catch (error) {
      console.error("Error in fetchEngineerWorkImages:", error);
      setEngineerWorkImages([]);
    } finally {
      setLoadingWorkImages(false);
    }
  };

  const handleEngineerClick = async (engineer) => {
    setSelectedEngineer(engineer);
    await fetchEngineerWorkImages(engineer.id);
  };

  const handleWhatsAppBooking = (engineer) => {
    const message = `Hi Karia Mitra, I want to book ${engineer.Name} (${engineer.Specialization}). Please share their details.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${mediatorNumber}?text=${encodedMessage}`, '_blank');
  };

  const openImageGallery = (index) => {
    setSelectedImageIndex(index);
    setIsGalleryOpen(true);
  };

  const closeImageGallery = () => {
    setIsGalleryOpen(false);
    setSelectedImageIndex(null);
  };

  const goToNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === engineerWorkImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevImage = () => {
  setSelectedImageIndex((prev) =>
    prev === 0 ? engineerWorkImages.length - 1 : prev - 1
  );
};


  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isGalleryOpen) return;
      
      if (e.key === 'Escape') {
        closeImageGallery();
      } else if (e.key === 'ArrowRight') {
        goToNextImage();
      } else if (e.key === 'ArrowLeft') {
        goToPrevImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white p-4 border-b sticky top-0 z-10 safe-top">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">Professional Engineers</h1>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto p-4 pt-6 pb-8">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-sm border p-4 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header - Fixed with proper z-index and safe area */}
      <div className="bg-white p-4 border-b sticky top-0 z-10 pt-17">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-gray-900">Professional Engineers</h1>
          </div>
        </div>
      </div>

      {/* Content with proper top and bottom spacing */}
      <div className="max-w-6xl mx-auto p-4 pt-6 pb-8 safe-area-top">
        
        {/* Filter Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter by specialization:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filterTypes.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border whitespace-nowrap ${
                  activeFilter === filter.key
                    ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filter Info */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Showing</span>
          <span className="font-semibold text-blue-600">{filteredEngineers.length}</span>
          <span>of</span>
          <span className="font-semibold text-gray-700">{engineers.length}</span>
          <span>engineers</span>
          {activeFilter !== 'all' && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
              {filterTypes.find(f => f.key === activeFilter)?.label}
            </span>
          )}
        </div>

        {/* Engineers List - Mobile Responsive */}
        <div className="space-y-3 md:space-y-4">
          {filteredEngineers.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {engineers.length === 0 ? 'No engineers available' : 'No engineers found for this filter'}
              </p>
              {activeFilter !== 'all' && engineers.length > 0 && (
                <button
                  onClick={() => setActiveFilter('all')}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Show All Engineers
                </button>
              )}
            </div>
          ) : (
            filteredEngineers.map((engineer) => (
              <div
                key={engineer.id}
                onClick={() => handleEngineerClick(engineer)}
                className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <img
                    src={engineer.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"}
                    alt={engineer.Name}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h3 className="font-semibold text-gray-900 text-base md:text-lg truncate">{engineer.Name}</h3>
                      {engineer.Rate && (
                        <p className="text-green-600 font-semibold text-sm md:text-base whitespace-nowrap">₹{engineer.Rate}/hr</p>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm md:text-base">{engineer.Specialization || 'Professional Engineer'}</p>
                    <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                        <span className="text-xs md:text-sm text-gray-600">{engineer.Rating || 'New'}</span>
                      </div>
                      <span className="text-gray-300 mx-1">•</span>
                      {engineer.Experience && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                          <span className="text-xs md:text-sm text-gray-600">{engineer.Experience}</span>
                        </div>
                      )}
                      <span className="text-gray-300 mx-1">•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                        <span className="text-xs md:text-sm text-gray-600 truncate">{engineer.Location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Engineer Detail Modal - Mobile Responsive */}
      {selectedEngineer && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full h-[90vh] sm:h-auto sm:max-h-[90vh] max-w-4xl flex flex-col">
            {/* Header - Sticky */}
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 flex-shrink-0">
              <div className="flex items-start gap-3 sm:gap-4">
                <img
                  src={selectedEngineer.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"}
                  alt={selectedEngineer.Name}
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
                />
                <div className="text-white flex-1 min-w-0">
                  <h2 className="text-lg sm:text-2xl font-bold truncate">{selectedEngineer.Name}</h2>
                  <p className="text-blue-100 text-sm sm:text-base">{selectedEngineer.Specialization || 'Professional Engineer'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 fill-current" />
                    <span className="text-sm sm:text-base">{selectedEngineer.Rating || 'New'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedEngineer(null);
                  setEngineerWorkImages([]);
                }}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 sm:pb-8">
              {/* Stats Grid - Mobile Responsive */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                {selectedEngineer.Experience && (
                  <div className="flex items-center gap-2 sm:gap-3 bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
                    <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-blue-600 font-medium truncate">Experience</p>
                      <p className="font-bold text-gray-900 text-sm truncate">{selectedEngineer.Experience}</p>
                    </div>
                  </div>
                )}
                {selectedEngineer.Site_completed && (
                  <div className="flex items-center gap-2 sm:gap-3 bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3">
                    <Award className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-green-600 font-medium truncate">Projects</p>
                      <p className="font-bold text-gray-900 text-sm truncate">{selectedEngineer.Site_completed}</p>
                    </div>
                  </div>
                )}
                {selectedEngineer.Rate && (
                  <div className="flex items-center gap-2 sm:gap-3 bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3">
                    <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-orange-600 font-medium truncate">Rate</p>
                      <p className="font-bold text-green-600 text-sm truncate">₹{selectedEngineer.Rate}/hr</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 sm:gap-3 bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-3">
                  <Star className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-purple-600 font-medium truncate">Rating</p>
                    <p className="font-bold text-gray-900 text-sm truncate">{selectedEngineer.Rating || 'New'}</p>
                  </div>
                </div>
              </div>

              {/* Qualification Section */}
              {selectedEngineer.Qualification && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">Qualification</h3>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                    <p className="text-gray-600 text-xs sm:text-sm">{selectedEngineer.Qualification}</p>
                  </div>
                </div>
              )}

              {/* Work Images Section - Mobile Responsive */}
              {loadingWorkImages ? (
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Loading Work Photos...</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="w-full aspect-video bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ) : engineerWorkImages.length > 0 ? (
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      Previous Work Photos ({engineerWorkImages.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                    {engineerWorkImages.map((imageUrl, index) => (
                      <div 
                        key={index} 
                        className="relative cursor-pointer group"
                        onClick={() => openImageGallery(index)}
                      >
                        <img
                          src={imageUrl}
                          alt={`Work ${index + 1}`}
                          className="w-full aspect-video object-cover rounded-lg border group-hover:opacity-80 transition-opacity duration-200"
                          onError={(e) => {
                            console.error("Failed to load image:", imageUrl);
                            e.target.style.display = 'none';
                          }}
                          onLoad={() => console.log("Successfully loaded image:", imageUrl)}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-lg flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 rounded-full p-2">
                            <ImageIcon className="w-4 h-4 text-gray-700" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-4 sm:mb-6 text-center py-4 text-gray-500 text-sm sm:text-base">
                  No work photos available
                </div>
              )}

              {/* About Section - Mobile Responsive */}
              {selectedEngineer.About && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">About</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{selectedEngineer.About}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 mb-10">
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  <button
                    onClick={() => handleWhatsAppBooking(selectedEngineer)}
                    className="bg-green-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors text-sm sm:text-base"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => window.location.href = `tel:${selectedEngineer.Phone || mediatorNumber}`}
                    className="bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors text-sm sm:text-base"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Call</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {isGalleryOpen && selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeImageGallery}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Navigation Buttons */}
          {engineerWorkImages.length > 1 && (
            <>
              <button
                onClick={goToPrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={goToNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {selectedImageIndex + 1} / {engineerWorkImages.length}
          </div>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={engineerWorkImages[selectedImageIndex]}
              alt={`Work ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={closeImageGallery}
            />
          </div>

          {/* Thumbnail Strip (Desktop) */}
          {engineerWorkImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 hidden md:flex gap-2 max-w-full overflow-x-auto px-4">
              {engineerWorkImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-all ${
                    index === selectedImageIndex ? 'border-white scale-110' : 'border-white/30'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add CSS for safe areas */}
      <style jsx>{`
        .safe-top {
          padding-top: env(safe-area-inset-top);
        }
        .safe-area-top {
          padding-top: calc(env(safe-area-inset-top) + 1.5rem);
        }
      `}</style>
    </div>
  );
}