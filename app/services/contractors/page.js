"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Phone, MessageCircle, X, Star, MapPin, ArrowLeft, Briefcase, Award, Clock, Image as ImageIcon } from "lucide-react";

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
    }
  ];
  
  const [selectedType, setSelectedType] = useState(null);
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [contractorWorkImages, setContractorWorkImages] = useState([]);
  const [loadingWorkImages, setLoadingWorkImages] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 border-b">
        <div className="max-w-6xl mx-auto">
          {selectedType ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setSelectedType(null);
                  setContractors([]);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">{selectedType} Contractors</h1>
            </div>
          ) : (
            <h1 className="text-xl font-bold text-gray-900 text-center">Choose Service</h1>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        {!selectedType ? (
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            {contractorTypes.map((type) => (
              <button
                key={type.name}
                onClick={() => setSelectedType(type.name)}
                className="relative rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow w-full md:w-40 h-40"
              >
                <img
                  src={type.image}
                  alt={type.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-white font-bold text-lg">{type.name}</h3>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {contractors.map((contractor) => (
              <div
                key={contractor.id}
                onClick={() => handleContractorClick(contractor)}
                className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={contractor.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"}
                    alt={contractor.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{contractor.name}</h3>
                    <p className="text-gray-600 text-sm">{contractor.expertise}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{contractor.rating || 'New'}</span>
                      <MapPin className="w-4 h-4 text-gray-400 ml-2" />
                      <span className="text-sm text-gray-600">{contractor.location}</span>
                    </div>
                    {contractor.rate && (
                      <p className="text-green-600 font-semibold text-sm mt-1">₹{contractor.rate}/hr</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contractor Detail Modal */}
      {selectedContractor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6">
              <div className="flex items-center gap-4">
                <img
                  src={selectedContractor.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"}
                  alt={selectedContractor.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{selectedContractor.name}</h2>
                  <p className="text-blue-100">{selectedContractor.expertise}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 text-yellow-300 fill-current" />
                    <span className="text-sm">{selectedContractor.rating || 'New'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedContractor(null);
                  setContractorWorkImages([]);
                }}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                {selectedContractor.experience && (
                  <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3 flex-1">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-xs text-blue-600 font-medium">Experience</p>
                      <p className="font-bold text-gray-900">{selectedContractor.experience}</p>
                    </div>
                  </div>
                )}
                {selectedContractor.site_completed && (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3 flex-1">
                    <Award className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-xs text-green-600 font-medium">Projects</p>
                      <p className="font-bold text-gray-900">{selectedContractor.site_completed}</p>
                    </div>
                  </div>
                )}
                {selectedContractor.rate && (
                  <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-lg p-3 flex-1">
                    <Clock className="w-6 h-6 text-orange-600" />
                    <div>
                      <p className="text-xs text-orange-600 font-medium">Rate</p>
                      <p className="font-bold text-green-600">₹{selectedContractor.rate}/hr</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-lg p-3 flex-1">
                  <Star className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-xs text-purple-600 font-medium">Rating</p>
                    <p className="font-bold text-gray-900">{selectedContractor.rating || 'New'}</p>
                  </div>
                </div>
              </div>

              {/* Work Images Section */}
              {loadingWorkImages ? (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Loading Work Photos...</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="w-full h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ) : contractorWorkImages.length > 0 ? (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Previous Work Photos ({contractorWorkImages.length})</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {contractorWorkImages.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Work ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                          onError={(e) => {
                            console.error("Failed to load image:", imageUrl);
                            e.target.style.display = 'none';
                          }}
                          onLoad={() => console.log("Successfully loaded image:", imageUrl)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-6 text-center py-4 text-gray-500">
                  No work photos available
                </div>
              )}

              {selectedContractor.about && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-600 text-sm">{selectedContractor.about}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleWhatsAppBooking(selectedContractor)}
                  className="bg-green-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </button>
                <button
                  onClick={() => window.location.href = 'tel:'}
                  className="bg-blue-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}