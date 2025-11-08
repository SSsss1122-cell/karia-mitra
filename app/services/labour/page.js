'use client';

import { useState, useEffect } from 'react';
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
  TrendingUp,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  UserCheck
} from 'lucide-react';

export default function LabourPage() {
  const [labours, setLabours] = useState([]);
  const [filteredLabours, setFilteredLabours] = useState([]);
  const [selectedLabour, setSelectedLabour] = useState(null);
  const [labourWorkImages, setLabourWorkImages] = useState([]);
  const [loadingWorkImages, setLoadingWorkImages] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const mediatorNumber = "9480072737";

  const filterTypes = [
    { key: 'all', label: 'All Workers' },
    { key: 'masonry', label: 'Masonry' },
  
    { key: 'plumbing', label: 'Plumbing' },
    { key: 'electrical', label: 'Electrical' },
    { key: 'painting', label: 'Painting' },
    { key: 'welding', label: 'Welding' },
    { key: 'carpenter', label: 'Carpenter' }
  ];

  // ✅ Fetch Labours from Supabase ONLY
  useEffect(() => {
    const fetchLabours = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('labours')
          .select('*')
          .order('rating', { ascending: false });

        if (error) throw error;
        
        // Only set data from Supabase, no dummy data
        console.log('Fetched labours from database:', data);
        setLabours(data || []);
        setFilteredLabours(data || []);
      } catch (err) {
        console.error('Error fetching labours:', err);
        setLabours([]);
        setFilteredLabours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLabours();
  }, []);

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

  const fetchLabourWorkImages = async (labourId) => {
    setLoadingWorkImages(true);
    setLabourWorkImages([]);
    
    try {
      console.log("=== FETCHING WORK IMAGES FOR LABOUR:", labourId, "===");
      
      // First, check if labour has work images in database works field
      const { data: labourData, error: dbError } = await supabase
        .from('labours')
        .select('works')
        .eq('id', labourId)
        .single();

      if (!dbError && labourData.works && Array.isArray(labourData.works)) {
        const validDbImages = labourData.works.filter(url => 
          url && typeof url === 'string' && url.trim() !== '' && url.startsWith('http')
        );
        
        if (validDbImages.length > 0) {
          console.log("Found work images in database:", validDbImages);
          setLabourWorkImages(validDbImages);
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
        setLabourWorkImages([]);
        setLoadingWorkImages(false);
        return;
      }

      console.log("All files in work-images folder:", files);

      if (!files || files.length === 0) {
        console.log("No files found in work-images folder");
        setLabourWorkImages([]);
        setLoadingWorkImages(false);
        return;
      }

      // Filter files for this specific labour
      const labourFiles = files.filter(file => {
        const fileName = file.name.toLowerCase();
        
        // Pattern for labour work images
        const labourPatterns = [
          `work_labour_${labourId}_`,
          `labour_${labourId}_`,
          `work_labour${labourId}_`,
          `labour${labourId}_`
        ];

        return labourPatterns.some(pattern => 
          fileName.includes(pattern.toLowerCase())
        );
      });

      console.log(`Found ${labourFiles.length} work images for labour ${labourId}:`, labourFiles);

      // Get public URLs for matching files
      const workImageUrls = [];
      for (const file of labourFiles) {
        const { data: { publicUrl } } = supabase.storage
          .from('partner-profile')
          .getPublicUrl(`work-images/${file.name}`);

        console.log(`Work image URL: ${publicUrl}`);
        workImageUrls.push(publicUrl);
      }

      console.log("Final work image URLs:", workImageUrls);
      setLabourWorkImages(workImageUrls);

    } catch (error) {
      console.error("Error in fetchLabourWorkImages:", error);
      setLabourWorkImages([]);
    } finally {
      setLoadingWorkImages(false);
    }
  };

  const handleLabourClick = async (labour) => {
    setSelectedLabour(labour);
    await fetchLabourWorkImages(labour.id);
  };

  const handleWhatsAppBooking = (labour) => {
    const message = `Hi Karia Mitra, I want to book ${labour.name} (${labour.expertise}). Please share their details.`;
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
      prev === labourWorkImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? labourWorkImages.length - 1 : prev - 1
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
        <div className="bg-white p-4 border-b sticky top-0 z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">Skilled Workers</h1>
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
      {/* Header - Fixed with proper z-index */}
      <div className="bg-white p-4 border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-gray-900">Skilled Workers</h1>
          </div>
        </div>
      </div>

      {/* Content with top and bottom spacing */}
      <div className="max-w-6xl mx-auto p-4 pt-6 pb-8">
        
        {/* Filter Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter by expertise:</span>
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
          <span className="font-semibold text-blue-600">{filteredLabours.length}</span>
          <span>of</span>
          <span className="font-semibold text-gray-700">{labours.length}</span>
          <span>workers</span>
          {activeFilter !== 'all' && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
              {filterTypes.find(f => f.key === activeFilter)?.label}
            </span>
          )}
        </div>

        {/* Workers List - Mobile Responsive */}
        <div className="space-y-3 md:space-y-4">
          {filteredLabours.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {labours.length === 0 ? 'No workers available' : 'No workers found for this filter'}
              </p>
              {activeFilter !== 'all' && labours.length > 0 && (
                <button
                  onClick={() => setActiveFilter('all')}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Show All Workers
                </button>
              )}
            </div>
          ) : (
            filteredLabours.map((labour) => (
              <div
                key={labour.id}
                onClick={() => handleLabourClick(labour)}
                className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <img
                    src={labour.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"}
                    alt={labour.name}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h3 className="font-semibold text-gray-900 text-base md:text-lg truncate">{labour.name}</h3>
                      {labour.rate && (
                        <p className="text-green-600 font-semibold text-sm md:text-base whitespace-nowrap">₹{labour.rate}/day</p>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm md:text-base">{labour.expertise || 'Skilled Worker'}</p>
                    <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                        <span className="text-xs md:text-sm text-gray-600">{labour.rating || 'New'}</span>
                      </div>
                      <span className="text-gray-300 mx-1">•</span>
                      {labour.experience && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                          <span className="text-xs md:text-sm text-gray-600">{labour.experience}</span>
                        </div>
                      )}
                      <span className="text-gray-300 mx-1">•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                        <span className="text-xs md:text-sm text-gray-600 truncate">{labour.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Labour Detail Modal - Mobile Responsive */}
      {selectedLabour && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full h-[90vh] sm:h-auto sm:max-h-[90vh] max-w-4xl flex flex-col">
            {/* Header - Sticky */}
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 flex-shrink-0">
              <div className="flex items-start gap-3 sm:gap-4">
                <img
                  src={selectedLabour.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"}
                  alt={selectedLabour.name}
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
                />
                <div className="text-white flex-1 min-w-0">
                  <h2 className="text-lg sm:text-2xl font-bold truncate">{selectedLabour.name}</h2>
                  <p className="text-blue-100 text-sm sm:text-base">{selectedLabour.expertise || 'Skilled Worker'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 fill-current" />
                    <span className="text-sm sm:text-base">{selectedLabour.rating || 'New'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedLabour(null);
                  setLabourWorkImages([]);
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
                {selectedLabour.experience && (
                  <div className="flex items-center gap-2 sm:gap-3 bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
                    <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-blue-600 font-medium truncate">Experience</p>
                      <p className="font-bold text-gray-900 text-sm truncate">{selectedLabour.experience}</p>
                    </div>
                  </div>
                )}
                {selectedLabour.projects_completed && (
                  <div className="flex items-center gap-2 sm:gap-3 bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3">
                    <Award className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-green-600 font-medium truncate">Projects</p>
                      <p className="font-bold text-gray-900 text-sm truncate">{selectedLabour.projects_completed}</p>
                    </div>
                  </div>
                )}
                {selectedLabour.rate && (
                  <div className="flex items-center gap-2 sm:gap-3 bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3">
                    <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-orange-600 font-medium truncate">Daily Rate</p>
                      <p className="font-bold text-green-600 text-sm truncate">₹{selectedLabour.rate}/day</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 sm:gap-3 bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-3">
                  <Star className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-purple-600 font-medium truncate">Rating</p>
                    <p className="font-bold text-gray-900 text-sm truncate">{selectedLabour.rating || 'New'}</p>
                  </div>
                </div>
              </div>

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
              ) : labourWorkImages.length > 0 ? (
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      Previous Work Photos ({labourWorkImages.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                    {labourWorkImages.map((imageUrl, index) => (
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
              {selectedLabour.about && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">About</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{selectedLabour.about}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 mb-10">
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  <button
                    onClick={() => handleWhatsAppBooking(selectedLabour)}
                    className="bg-green-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors text-sm sm:text-base"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => window.location.href = `tel:${selectedLabour.phone || mediatorNumber}`}
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
          {labourWorkImages.length > 1 && (
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
            {selectedImageIndex + 1} / {labourWorkImages.length}
          </div>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={labourWorkImages[selectedImageIndex]}
              alt={`Work ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={closeImageGallery}
            />
          </div>

          {/* Thumbnail Strip (Desktop) */}
          {labourWorkImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 hidden md:flex gap-2 max-w-full overflow-x-auto px-4">
              {labourWorkImages.map((image, index) => (
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
    </div>
  );
}