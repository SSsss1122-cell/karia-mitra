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
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Building
} from 'lucide-react';

export default function BuildersPage() {
  const [builders, setBuilders] = useState([]);
  const [selectedBuilder, setSelectedBuilder] = useState(null);
  const [builderWorkImages, setBuilderWorkImages] = useState([]);
  const [loadingWorkImages, setLoadingWorkImages] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const mediatorNumber = "9480072737";

  useEffect(() => {
    const fetchBuilders = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('Builder')
          .select('*')
          .order('Rating', { ascending: false });

        if (error) throw error;

        setBuilders(data || []);
      } catch (err) {
        console.error('Error fetching builders:', err);
        setBuilders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBuilders();
  }, []);

  const fetchBuilderWorkImages = async (builderId) => {
    setLoadingWorkImages(true);
    setBuilderWorkImages([]);
    
    try {
      console.log("=== FETCHING WORK IMAGES FOR BUILDER:", builderId, "===");
      
      // First, check if builder has work images in database works field
      const { data: builderData, error: dbError } = await supabase
        .from('Builder')
        .select('works')
        .eq('id', builderId)
        .single();

      if (!dbError && builderData.works && Array.isArray(builderData.works)) {
        const validDbImages = builderData.works.filter(url => 
          url && typeof url === 'string' && url.trim() !== '' && url.startsWith('http')
        );
        
        if (validDbImages.length > 0) {
          console.log("Found work images in database:", validDbImages);
          setBuilderWorkImages(validDbImages);
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
        setBuilderWorkImages([]);
        setLoadingWorkImages(false);
        return;
      }

      console.log("All files in work-images folder:", files);

      if (!files || files.length === 0) {
        console.log("No files found in work-images folder");
        setBuilderWorkImages([]);
        setLoadingWorkImages(false);
        return;
      }

      // Filter files for this specific builder
      const builderFiles = files.filter(file => {
        const fileName = file.name.toLowerCase();
        
        // Pattern for builder work images
        const builderPatterns = [
          `work_builder_${builderId}_`,
          `builder_${builderId}_`,
          `work_builder${builderId}_`,
          `builder${builderId}_`
        ];

        return builderPatterns.some(pattern => 
          fileName.includes(pattern.toLowerCase())
        );
      });

      console.log(`Found ${builderFiles.length} work images for builder ${builderId}:`, builderFiles);

      // Get public URLs for matching files
      const workImageUrls = [];
      for (const file of builderFiles) {
        const { data: { publicUrl } } = supabase.storage
          .from('partner-profile')
          .getPublicUrl(`work-images/${file.name}`);

        console.log(`Work image URL: ${publicUrl}`);
        workImageUrls.push(publicUrl);
      }

      console.log("Final work image URLs:", workImageUrls);
      setBuilderWorkImages(workImageUrls);

    } catch (error) {
      console.error("Error in fetchBuilderWorkImages:", error);
      setBuilderWorkImages([]);
    } finally {
      setLoadingWorkImages(false);
    }
  };

  const handleBuilderClick = async (builder) => {
    setSelectedBuilder(builder);
    await fetchBuilderWorkImages(builder.id);
  };

  const handleWhatsAppBooking = (builder) => {
    const message = `Hi Karia Mitra, I want to book ${builder.Name} (Builder). Please share their details.`;
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
      prev === builderWorkImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? builderWorkImages.length - 1 : prev - 1
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
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 border-b sticky top-0 z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">Professional Builders</h1>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto p-4 pb-20">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 border-b sticky top-0 z-10 pt-14">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-gray-900">Professional Builders</h1>
          </div>
        </div>
      </div>

      {/* Content - FIXED: Added pb-20 for bottom padding */}
      <div className="max-w-6xl mx-auto p-4 pb-20">
        {/* Builders List - Mobile Responsive */}
        <div className="space-y-3 md:space-y-4">
          {builders.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No builders found</p>
              <p className="text-gray-400 text-sm mt-2">Check back later for available builders</p>
            </div>
          ) : (
            builders.map((builder) => (
              <div
                key={builder.id}
                onClick={() => handleBuilderClick(builder)}
                className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <img
                    src={builder.Image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"}
                    alt={builder.Name}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h3 className="font-semibold text-gray-900 text-base md:text-lg truncate">{builder.Name}</h3>
                      {builder.Rate && (
                        <p className="text-green-600 font-semibold text-sm md:text-base whitespace-nowrap">₹{builder.Rate}/sq.ft</p>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm md:text-base">Professional Builder</p>
                    <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                        <span className="text-xs md:text-sm text-gray-600">{builder.Rating || 'New'}</span>
                      </div>
                      <span className="text-gray-300 mx-1">•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                        <span className="text-xs md:text-sm text-gray-600 truncate">{builder.Location}</span>
                      </div>
                    </div>
                    {builder.Specialties && builder.Specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {builder.Specialties.slice(0, 2).map((specialty, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs"
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
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Builder Detail Modal - Mobile Responsive */}
      {selectedBuilder && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full h-[90vh] sm:h-auto sm:max-h-[90vh] max-w-4xl flex flex-col">
            {/* Header - Sticky */}
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 flex-shrink-0">
              <div className="flex items-start gap-3 sm:gap-4">
                <img
                  src={selectedBuilder.Image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"}
                  alt={selectedBuilder.Name}
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
                />
                <div className="text-white flex-1 min-w-0">
                  <h2 className="text-lg sm:text-2xl font-bold truncate">{selectedBuilder.Name}</h2>
                  <p className="text-blue-100 text-sm sm:text-base">Professional Builder</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 fill-current" />
                    <span className="text-sm sm:text-base">{selectedBuilder.Rating || 'New'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedBuilder(null);
                  setBuilderWorkImages([]);
                }}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pt-6 pb-28 sm:pt-8 sm:pb-12 px-4 sm:px-6">
              {/* Stats Grid - Mobile Responsive */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                {selectedBuilder.Experience && (
                  <div className="flex items-center gap-2 sm:gap-3 bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
                    <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-blue-600 font-medium truncate">Experience</p>
                      <p className="font-bold text-gray-900 text-sm truncate">{selectedBuilder.Experience}</p>
                    </div>
                  </div>
                )}
                {selectedBuilder.Projects_completed && (
                  <div className="flex items-center gap-2 sm:gap-3 bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3">
                    <Award className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-green-600 font-medium truncate">Projects</p>
                      <p className="font-bold text-gray-900 text-sm truncate">{selectedBuilder.Projects_completed}</p>
                    </div>
                  </div>
                )}
                {selectedBuilder.Rate && (
                  <div className="flex items-center gap-2 sm:gap-3 bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3">
                    <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-orange-600 font-medium truncate">Rate</p>
                      <p className="font-bold text-green-600 text-sm truncate">₹{selectedBuilder.Rate}/sq.ft</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 sm:gap-3 bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-3">
                  <Star className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-purple-600 font-medium truncate">Rating</p>
                    <p className="font-bold text-gray-900 text-sm truncate">{selectedBuilder.Rating || 'New'}</p>
                  </div>
                </div>
              </div>

              {/* Specialties Section */}
              {selectedBuilder.Specialties && selectedBuilder.Specialties.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedBuilder.Specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
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
              ) : builderWorkImages.length > 0 ? (
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      Previous Work Photos ({builderWorkImages.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                    {builderWorkImages.map((imageUrl, index) => (
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
              {selectedBuilder.About && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">About</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{selectedBuilder.About}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 mb-10">
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  <button
                    onClick={() => handleWhatsAppBooking(selectedBuilder)}
                    className="bg-green-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors text-sm sm:text-base"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => window.location.href = `tel:${selectedBuilder.Phone || mediatorNumber}`}
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
          {builderWorkImages.length > 1 && (
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
            {selectedImageIndex + 1} / {builderWorkImages.length}
          </div>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={builderWorkImages[selectedImageIndex]}
              alt={`Work ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={closeImageGallery}
            />
          </div>

          {/* Thumbnail Strip (Desktop) */}
          {builderWorkImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 hidden md:flex gap-2 max-w-full overflow-x-auto px-4">
              {builderWorkImages.map((image, index) => (
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