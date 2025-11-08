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

export default function ArchitecturePage() {
  const [architects, setArchitects] = useState([]);
  const [selectedArchitect, setSelectedArchitect] = useState(null);
  const [architectWorkImages, setArchitectWorkImages] = useState([]);
  const [loadingWorkImages, setLoadingWorkImages] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const mediatorNumber = "9480072737";

  useEffect(() => {
    const fetchArchitects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('architecture')
          .select('*')
          .order('rating', { ascending: false });

        if (error) throw error;

        console.log('Fetched architects from database:', data);
        setArchitects(data || []);
      } catch (err) {
        console.error('Error fetching architects:', err);
        setArchitects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArchitects();
  }, []);

  const fetchArchitectWorkImages = async (architectId) => {
    setLoadingWorkImages(true);
    setArchitectWorkImages([]);
    
    try {
      console.log("=== FETCHING WORK IMAGES FOR ARCHITECT:", architectId, "===");
      
      // First, check if architect has work images in database works field
      const { data: architectData, error: dbError } = await supabase
        .from('architecture')
        .select('works')
        .eq('id', architectId)
        .single();

      if (!dbError && architectData.works) {
        // Since works is a single text field, we need to parse it
        let workImages = [];
        
        // Try to parse as JSON array first
        try {
          const parsedWorks = JSON.parse(architectData.works);
          if (Array.isArray(parsedWorks)) {
            workImages = parsedWorks.filter(url => 
              url && typeof url === 'string' && url.trim() !== '' && url.startsWith('http')
            );
          }
        } catch (parseError) {
          console.log("Works field is not JSON, trying as comma-separated string");
          // If not JSON, try comma-separated string
          if (typeof architectData.works === 'string') {
            workImages = architectData.works
              .split(',')
              .map(url => url.trim())
              .filter(url => url && url.startsWith('http'));
          }
        }
        
        if (workImages.length > 0) {
          console.log("Found work images in database:", workImages);
          setArchitectWorkImages(workImages);
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
        setArchitectWorkImages([]);
        setLoadingWorkImages(false);
        return;
      }

      console.log("All files in work-images folder:", files);

      if (!files || files.length === 0) {
        console.log("No files found in work-images folder");
        setArchitectWorkImages([]);
        setLoadingWorkImages(false);
        return;
      }

      // Filter files for this specific architect
      const architectFiles = files.filter(file => {
        const fileName = file.name.toLowerCase();
        
        // Pattern for architect work images
        const architectPatterns = [
          `work_architect_${architectId}_`,
          `architect_${architectId}_`,
          `work_architect${architectId}_`,
          `architect${architectId}_`
        ];

        return architectPatterns.some(pattern => 
          fileName.includes(pattern.toLowerCase())
        );
      });

      console.log(`Found ${architectFiles.length} work images for architect ${architectId}:`, architectFiles);

      // Get public URLs for matching files
      const workImageUrls = [];
      for (const file of architectFiles) {
        const { data: { publicUrl } } = supabase.storage
          .from('partner-profile')
          .getPublicUrl(`work-images/${file.name}`);

        console.log(`Work image URL: ${publicUrl}`);
        workImageUrls.push(publicUrl);
      }

      console.log("Final work image URLs:", workImageUrls);
      setArchitectWorkImages(workImageUrls);

    } catch (error) {
      console.error("Error in fetchArchitectWorkImages:", error);
      setArchitectWorkImages([]);
    } finally {
      setLoadingWorkImages(false);
    }
  };

  const handleArchitectClick = async (architect) => {
    setSelectedArchitect(architect);
    await fetchArchitectWorkImages(architect.id);
  };

  const handleWhatsAppBooking = (architect) => {
    const message = `Hi Karia Mitra, I want to book ${architect.name} (Architect). Please share their details.`;
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
      prev === architectWorkImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? architectWorkImages.length - 1 : prev - 1
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
        <div className="bg-white p-4 border-b">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-lg md:text-xl font-bold text-gray-900 text-center">Architecture Experts</h1>
          </div>
        </div>
        <div className="max-w-6xl mx-auto p-4">
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
      <div className="bg-white p-4 border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-gray-900">Architecture Experts</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        {/* Architects List - Mobile Responsive */}
        <div className="space-y-3 md:space-y-4">
          {architects.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No architects found</p>
            </div>
          ) : (
            architects.map((architect) => (
              <div
                key={architect.id}
                onClick={() => handleArchitectClick(architect)}
                className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <img
                    src={architect.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"}
                    alt={architect.name}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h3 className="font-semibold text-gray-900 text-base md:text-lg truncate">{architect.name}</h3>
                      <span className="text-green-600 font-semibold text-sm md:text-base whitespace-nowrap capitalize">
                        {architect.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base">Professional Architect</p>
                    <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                        <span className="text-xs md:text-sm text-gray-600">{architect.rating || 'New'}</span>
                      </div>
                      <span className="text-gray-300 mx-1">•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                        <span className="text-xs md:text-sm text-gray-600 truncate">{architect.location}</span>
                      </div>
                    </div>
                    {architect.specialization && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                          {architect.specialization}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Architect Detail Modal - Mobile Responsive */}
     {/* Architect Detail Modal - Mobile Responsive */}
{selectedArchitect && (
  <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
    <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full h-[90vh] sm:h-auto sm:max-h-[90vh] max-w-4xl flex flex-col">
      {/* Header - Sticky */}
      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 flex-shrink-0">
        <div className="flex items-start gap-3 sm:gap-4">
          <img
            src={selectedArchitect.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"}
            alt={selectedArchitect.name}
            className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
          />
          <div className="text-white flex-1 min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold truncate">{selectedArchitect.name}</h2>
            <p className="text-blue-100 text-sm sm:text-base">Professional Architect</p>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 fill-current" />
              <span className="text-sm sm:text-base">{selectedArchitect.rating || 'New'}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedArchitect(null);
            setArchitectWorkImages([]);
          }}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Scrollable Content - Increased bottom padding */}
      <div className="flex-1 overflow-y-auto py-6 sm:py-8 px-4 sm:px-6 pb-32">
        {/* Stats Grid - Mobile Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
          {selectedArchitect.experience && (
            <div className="flex items-center gap-2 sm:gap-3 bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
              <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-blue-600 font-medium truncate">Experience</p>
                <p className="font-bold text-gray-900 text-sm truncate">{selectedArchitect.experience}</p>
              </div>
            </div>
          )}
          {selectedArchitect.rate && (
            <div className="flex items-center gap-2 sm:gap-3 bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3">
              <Award className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-green-600 font-medium truncate">Rate</p>
                <p className="font-bold text-gray-900 text-sm truncate">₹{selectedArchitect.rate}/sq.ft</p>
              </div>
            </div>
          )}
          {selectedArchitect.category && (
            <div className="flex items-center gap-2 sm:gap-3 bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-orange-600 font-medium truncate">Category</p>
                <p className="font-bold text-green-600 text-sm truncate capitalize">{selectedArchitect.category}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 sm:gap-3 bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-3">
            <Star className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-purple-600 font-medium truncate">Rating</p>
              <p className="font-bold text-gray-900 text-sm truncate">{selectedArchitect.rating || 'New'}</p>
            </div>
          </div>
        </div>

        {/* Specialization Section */}
        {selectedArchitect.specialization && (
          <div className="mb-6 sm:mb-8">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-3">Specialization</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                {selectedArchitect.specialization}
              </span>
            </div>
          </div>
        )}

        {/* Work Images Section - Mobile Responsive */}
        {loadingWorkImages ? (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Loading Work Photos...</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="w-full aspect-video bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : architectWorkImages.length > 0 ? (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                Previous Work Photos ({architectWorkImages.length})
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              {architectWorkImages.map((imageUrl, index) => (
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
          <div className="mb-6 sm:mb-8 text-center py-6 text-gray-500 text-sm sm:text-base">
            No work photos available
          </div>
        )}

        {/* About Section - Mobile Responsive */}
        {selectedArchitect.about && (
          <div className="mb-6 sm:mb-8">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-3">About</h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{selectedArchitect.about}</p>
          </div>
        )}

        {/* Action Buttons - With significant spacing */}
        <div className="mt-16 mb-16">
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <button
              onClick={() => handleWhatsAppBooking(selectedArchitect)}
              className="bg-green-500 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-green-600 transition-colors text-base shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => window.location.href = `tel:${selectedArchitect.Phone || mediatorNumber}`}
              className="bg-blue-500 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-blue-600 transition-colors text-base shadow-lg"
            >
              <Phone className="w-5 h-5" />
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
          {architectWorkImages.length > 1 && (
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
            {selectedImageIndex + 1} / {architectWorkImages.length}
          </div>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={architectWorkImages[selectedImageIndex]}
              alt={`Work ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={closeImageGallery}
            />
          </div>

          {/* Thumbnail Strip (Desktop) */}
          {architectWorkImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 hidden md:flex gap-2 max-w-full overflow-x-auto px-4">
              {architectWorkImages.map((image, index) => (
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