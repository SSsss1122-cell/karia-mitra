"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Phone, MessageCircle, X, Star, MapPin, ArrowLeft, Briefcase, Award, Clock, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";

export default function ContractorsPage() {
  const contractorTypes = [
    { 
      name: "POP", 
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop" 
    },
    { 
      name: "RCC", 
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=200&fit=crop" 
    },
    { 
      name: "Electrician", 
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop" 
    },
    { 
      name: "Plumbing", 
      image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300&h=200&fit=crop" 
    },
    { 
      name: "Painter", 
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&h=200&fit=crop" 
    },
    { 
      name: "Carpenter", 
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop" 
    },
    { 
      name: "Flooring", 
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=200&fit=crop" 
    },
    { 
      name: "Masonry", 
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop" 
    },
    { 
      name: "False Ceiling", 
      image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300&h=200&fit=crop" 
    },
    { 
      name: "Cladding", 
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&h=200&fit=crop" 
    },
    { 
      name: "EPC", 
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop" 
    },
    { 
      name: "Centring", 
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=200&fit=crop" 
    }
  ];
  
  const [selectedType, setSelectedType] = useState(null);
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [contractorWorkImages, setContractorWorkImages] = useState([]);
  const [loadingWorkImages, setLoadingWorkImages] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const mediatorNumber = "9480072737";

  useEffect(() => {
    const fetchContractors = async () => {
      if (!selectedType) return;

      const { data, error } = await supabase
        .from("Contractor")
        .select("id, name, expertise, rating, location, about, experience, site_completed, rate, image_url, phone")
        .eq("expertise", selectedType)
        .eq("is_active", true)
        .order("rating", { ascending: false });

      if (!error) {
        setContractors(data || []);
      }
    };

    fetchContractors();
  }, [selectedType]);

  const fetchContractorWorkImages = async (contractorId) => {
    setLoadingWorkImages(true);
    setContractorWorkImages([]);
    
    try {
      console.log("=== FETCHING WORK IMAGES FOR CONTRACTOR:", contractorId, "===");
      
      // First, check if contractor has work images in database works field
      const { data: contractorData, error: dbError } = await supabase
        .from('Contractor')
        .select('works')
        .eq('id', contractorId)
        .single();

      if (!dbError && contractorData.works && Array.isArray(contractorData.works)) {
        const validDbImages = contractorData.works.filter(url => 
          url && typeof url === 'string' && url.trim() !== '' && url.startsWith('http')
        );
        
        if (validDbImages.length > 0) {
          console.log("Found work images in database:", validDbImages);
          setContractorWorkImages(validDbImages);
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
        setContractorWorkImages([]);
        setLoadingWorkImages(false);
        return;
      }

      console.log("All files in work-images folder:", files);

      if (!files || files.length === 0) {
        console.log("No files found in work-images folder");
        setContractorWorkImages([]);
        setLoadingWorkImages(false);
        return;
      }

      // Filter files for this specific contractor
      const contractorFiles = files.filter(file => {
        const fileName = file.name.toLowerCase();
        
        // Pattern for contractor work images
        const contractorPatterns = [
          `work_contractor_${contractorId}_`,
          `contractor_${contractorId}_`,
          `work_contractor${contractorId}_`,
          `contractor${contractorId}_`
        ];

        return contractorPatterns.some(pattern => 
          fileName.includes(pattern.toLowerCase())
        );
      });

      console.log(`Found ${contractorFiles.length} work images for contractor ${contractorId}:`, contractorFiles);

      // Get public URLs for matching files
      const workImageUrls = [];
      for (const file of contractorFiles) {
        const { data: { publicUrl } } = supabase.storage
          .from('partner-profile')
          .getPublicUrl(`work-images/${file.name}`);

        console.log(`Work image URL: ${publicUrl}`);
        workImageUrls.push(publicUrl);
      }

      console.log("Final work image URLs:", workImageUrls);
      setContractorWorkImages(workImageUrls);

    } catch (error) {
      console.error("Error in fetchContractorWorkImages:", error);
      setContractorWorkImages([]);
    } finally {
      setLoadingWorkImages(false);
    }
  };

  const handleContractorClick = async (contractor) => {
    setSelectedContractor(contractor);
    await fetchContractorWorkImages(contractor.id);
  };

  const handleWhatsAppBooking = (contractor) => {
    const message = `Hi Karia Mitra, I want to book ${contractor.name} (${contractor.expertise}). Please share their details.`;
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
      prev === contractorWorkImages.length - 1 ? 0 : prev + 1
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 border-b sticky top-0 z-10 pt-14">
        <div className="max-w-6xl mx-auto">
          {selectedType ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedType(null);
                  setContractors([]);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">{selectedType} Contractors</h1>
            </div>
          ) : (
            <h1 className="text-lg md:text-xl font-bold text-gray-900 text-center">Choose Service</h1>
          )}
        </div>
      </div>

      {/* Content - FIXED: Added pt-20 to prevent content hiding behind header */}
      <div className="max-w-6xl mx-auto p-4 pt-20 pb-20">
        {!selectedType ? (
          // Service Selection Grid - Mobile Responsive
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {contractorTypes.map((type) => (
              <button
                key={type.name}
                onClick={() => setSelectedType(type.name)}
                className="relative rounded-xl overflow-hidden shadow-sm border hover:shadow-md transition-all duration-200 aspect-square w-full group"
              >
                <img
                  src={type.image}
                  alt={type.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 flex items-center justify-center transition-colors">
                  <h3 className="text-white font-bold text-sm md:text-lg text-center px-1">{type.name}</h3>
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Contractors List - Mobile Responsive
          <div className="space-y-3 md:space-y-4">
            {contractors.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-500 text-lg">No contractors found for {selectedType}</p>
              </div>
            ) : (
              contractors.map((contractor) => (
                <div
                  key={contractor.id}
                  onClick={() => handleContractorClick(contractor)}
                  className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <img
                      src={contractor.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"}
                      alt={contractor.name}
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <h3 className="font-semibold text-gray-900 text-base md:text-lg truncate">{contractor.name}</h3>
                        {contractor.rate && (
                          <p className="text-green-600 font-semibold text-sm md:text-base whitespace-nowrap">₹{contractor.rate}/hr</p>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm md:text-base">{contractor.expertise}</p>
                      <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                          <span className="text-xs md:text-sm text-gray-600">{contractor.rating || 'New'}</span>
                        </div>
                        <span className="text-gray-300 mx-1">•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                          <span className="text-xs md:text-sm text-gray-600 truncate">{contractor.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Contractor Detail Modal - Mobile Responsive */}
      {selectedContractor && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full h-[90vh] sm:h-auto sm:max-h-[90vh] max-w-4xl flex flex-col">
            {/* Header - Sticky */}
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 flex-shrink-0">
              <div className="flex items-start gap-3 sm:gap-4">
                <img
                  src={selectedContractor.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"}
                  alt={selectedContractor.name}
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
                />
                <div className="text-white flex-1 min-w-0">
                  <h2 className="text-lg sm:text-2xl font-bold truncate">{selectedContractor.name}</h2>
                  <p className="text-blue-100 text-sm sm:text-base">{selectedContractor.expertise}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 fill-current" />
                    <span className="text-sm sm:text-base">{selectedContractor.rating || 'New'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedContractor(null);
                  setContractorWorkImages([]);
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
                {selectedContractor.experience && (
                  <div className="flex items-center gap-2 sm:gap-3 bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
                    <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-blue-600 font-medium truncate">Experience</p>
                      <p className="font-bold text-gray-900 text-sm truncate">{selectedContractor.experience}</p>
                    </div>
                  </div>
                )}
                {selectedContractor.site_completed && (
                  <div className="flex items-center gap-2 sm:gap-3 bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3">
                    <Award className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-green-600 font-medium truncate">Projects</p>
                      <p className="font-bold text-gray-900 text-sm truncate">{selectedContractor.site_completed}</p>
                    </div>
                  </div>
                )}
                {selectedContractor.rate && (
                  <div className="flex items-center gap-2 sm:gap-3 bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3">
                    <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-orange-600 font-medium truncate">Rate</p>
                      <p className="font-bold text-green-600 text-sm truncate">₹{selectedContractor.rate}/hr</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 sm:gap-3 bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-3">
                  <Star className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-purple-600 font-medium truncate">Rating</p>
                    <p className="font-bold text-gray-900 text-sm truncate">{selectedContractor.rating || 'New'}</p>
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
              ) : contractorWorkImages.length > 0 ? (
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      Previous Work Photos ({contractorWorkImages.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                    {contractorWorkImages.map((imageUrl, index) => (
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
              {selectedContractor.about && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">About</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{selectedContractor.about}</p>
                </div>
              )}

              {/* Action Buttons - Now inside scrollable area with bottom spacing */}
              <div className="mt-6 mb-10">
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  <button
                    onClick={() => handleWhatsAppBooking(selectedContractor)}
                    className="bg-green-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors text-sm sm:text-base"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => window.location.href = `tel:${selectedContractor.phone || mediatorNumber}`}
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
          {contractorWorkImages.length > 1 && (
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
            {selectedImageIndex + 1} / {contractorWorkImages.length}
          </div>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={contractorWorkImages[selectedImageIndex]}
              alt={`Work ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={closeImageGallery}
            />
          </div>

          {/* Thumbnail Strip (Desktop) */}
          {contractorWorkImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 hidden md:flex gap-2 max-w-full overflow-x-auto px-4">
              {contractorWorkImages.map((image, index) => (
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