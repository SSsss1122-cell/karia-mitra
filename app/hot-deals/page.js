// app/hot-deals/page.js
'use client';

import { useState, useEffect } from 'react';
import { Star, MapPin, Phone, Mail, Award, BadgeCheck, MessageCircle, X, Zap, TrendingUp, Users, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function HotDealsPage() {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const router = useRouter();

  const bestDeals = [
    {
      id: 1,
      name: 'Excavator Pro',
      rating: '4.8',
      image: '/images/excavator.jpg',
      badge: 'HOT',
      category: 'Excavators',
      price: '₹15,000/day',
      discount: '20% OFF'
    },
    {
      id: 2,
      name: 'Crane Master',
      rating: '4.9',
      image: '/images/crane.jpg',
      badge: 'NEW',
      category: 'Cranes',
      price: '₹25,000/day',
      discount: '15% OFF'
    },
    {
      id: 3,
      name: 'Bulldozer X',
      rating: '4.7',
      image: '/images/bulldozer.jpg',
      badge: 'SALE',
      category: 'Bulldozers',
      price: '₹18,000/day',
      discount: '25% OFF'
    },
    {
      id: 4,
      name: 'Concrete Mixer',
      rating: '4.6',
      image: '/images/concrete-mixer.jpg',
      badge: 'HOT',
      category: 'Concrete Equipment',
      price: '₹8,000/day',
      discount: '30% OFF'
    }
  ];

  const shops = [
    {
      id: 1,
      name: 'Heavy Equipment Hub',
      rating: '4.8',
      image: '/images/flooring.jpg',
      specialty: 'Excavators & Cranes',
      location: 'Bangalore',
      projects: 150,
      delivery: 'Same Day'
    },
    {
      id: 2,
      name: 'Construction Gear Pro',
      rating: '4.9',
      image: '/images/roofing.jpg',
      specialty: 'Concrete Equipment',
      location: 'Chennai',
      projects: 200,
      delivery: '24 Hours'
    },
    {
      id: 3,
      name: 'Tools & Machinery',
      rating: '4.7',
      image: '/images/hardware.jpg',
      specialty: 'Power Tools',
      location: 'Mumbai',
      projects: 120,
      delivery: 'Next Day'
    },
    {
      id: 4,
      name: 'BuildTech Supplies',
      rating: '4.6',
      image: '/images/interior.jpg',
      specialty: 'Safety Equipment',
      location: 'Delhi',
      projects: 180,
      delivery: 'Same Day'
    }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Verified Professionals',
      description: 'All professionals are thoroughly verified and background checked'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Contact',
      description: 'Direct contact with professionals via call, WhatsApp, or email'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Best Deals',
      description: 'Exclusive discounts and offers you won\'t find anywhere else'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Trusted Community',
      description: 'Join thousands of satisfied customers and professionals'
    }
  ];

  useEffect(() => {
    fetchHotDealsProfessionals();
  }, []);

  const fetchHotDealsProfessionals = async () => {
    try {
      setLoading(true);
      
      const [buildersResult, contractorsResult, engineersResult, architectsResult] = await Promise.all([
        supabase
          .from('Builder')
          .select('*')
          .eq('Verified', true)
          .order('Rating', { ascending: false })
          .limit(4),
        
        supabase
          .from('Contractor')
          .select('*')
          .eq('is_active', true)
          .order('rating', { ascending: false })
          .limit(4),
        
        supabase
          .from('Engineer')
          .select('*')
          .eq('Is_active', true)
          .order('Rating', { ascending: false })
          .limit(4),
        
        supabase
          .from('architecture')
          .select('*')
          .order('rating', { ascending: false })
          .limit(4)
      ]);

      const professionalsData = [];

      // Process Builders
      if (buildersResult.data && buildersResult.data.length > 0) {
        buildersResult.data.forEach((builder, index) => {
          professionalsData.push({
            id: `builder-${builder.id}`,
            type: 'builder',
            name: builder.Name,
            profession: 'Building Constructor',
            specialty: builder.Specialties ? builder.Specialties.join(', ') : 'General Construction',
            experience: builder.Experience,
            location: builder.Location,
            rating: builder.Rating,
            reviews: builder.Reviews,
            projectsCompleted: builder.Projects_completed,
            phone: builder.Phone,
            email: builder.Email,
            about: builder.About,
            image: builder.Image,
            verified: builder.Verified,
            offer: '5% OFF on Construction',
            offerDescription: 'Special discount on building construction projects',
            badge: index === 0 ? 'TOP RATED' : 'TRENDING'
          });
        });
      }

      // Process Contractors
      if (contractorsResult.data && contractorsResult.data.length > 0) {
        contractorsResult.data.forEach((contractor, index) => {
          professionalsData.push({
            id: `contractor-${contractor.id}`,
            type: 'contractor',
            name: contractor.name,
            profession: 'Civil Contractor',
            specialty: contractor.expertise,
            experience: contractor.experience,
            location: contractor.location,
            rating: contractor.rating,
            reviews: contractor.reviews ? Object.keys(contractor.reviews).length : 0,
            projectsCompleted: contractor.site_completed,
            phone: contractor.phone,
            email: contractor.email,
            about: contractor.about,
            image: contractor.image_url,
            verified: true,
            offer: '5% OFF on Contract Work',
            offerDescription: 'Discount on civil contracting projects',
            badge: index === 0 ? 'TOP RATED' : 'POPULAR'
          });
        });
      }

      // Process Engineers
      if (engineersResult.data && engineersResult.data.length > 0) {
        engineersResult.data.forEach((engineer, index) => {
          professionalsData.push({
            id: `engineer-${engineer.id}`,
            type: 'engineer',
            name: engineer.Name,
            profession: 'Agricultural Engineer',
            specialty: engineer.Specialization,
            experience: engineer.Experience,
            location: engineer.Location,
            rating: engineer.Rating,
            reviews: engineer.Reviews,
            projectsCompleted: engineer.Site_completed,
            phone: engineer.Phone,
            email: engineer.Email,
            about: engineer.Qualification,
            image: engineer.image,
            verified: engineer.Is_active,
            offer: '5% OFF on Engineering',
            offerDescription: 'Special rates for engineering consultations',
            badge: index === 0 ? 'EXPERT' : 'TRENDING'
          });
        });
      }

      // Process Architects
      if (architectsResult.data && architectsResult.data.length > 0) {
        architectsResult.data.forEach((architect, index) => {
          professionalsData.push({
            id: `architect-${architect.id}`,
            type: 'architect',
            name: architect.name,
            profession: 'Building Architect',
            specialty: architect.specialization,
            experience: architect.experience,
            location: architect.location,
            rating: architect.rating,
            reviews: 0,
            projectsCompleted: 0,
            phone: architect.Phone,
            email: null,
            about: architect.about,
            image: architect.logo_url,
            verified: true,
            offer: '5% OFF on Design',
            offerDescription: 'Discount on architectural design services',
            badge: index === 0 ? 'CREATIVE' : 'INNOVATIVE'
          });
        });
      }

      setProfessionals(professionalsData.slice(0, 4));
    } catch (error) {
      console.error('Error fetching professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleWhatsApp = (professional) => {
    const message = `Hello ${professional.name}, I'm interested in your ${professional.offer.toLowerCase()} for ${professional.profession.toLowerCase()} services.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919480072737?text=${encodedMessage}`, '_blank');
  };

  const handleEmail = (email) => {
    if (email) {
      window.open(`mailto:${email}`, '_self');
    } else {
      alert('Email not available for this professional');
    }
  };

  const openProfessionalModal = (professional) => {
    setSelectedProfessional(professional);
  };

  const closeProfessionalModal = () => {
    setSelectedProfessional(null);
  };

  const handleBestDealClick = (deal) => {
    router.push(`/shops?category=${encodeURIComponent(deal.category)}`);
  };

  const handleShopClick = (shop) => {
    router.push(`/shops?shop=${encodeURIComponent(shop.name)}`);
  };

  const handleImageError = (e, name) => {
    e.target.style.display = 'none';
    const parent = e.target.parentElement;
    const fallback = document.createElement('div');
    fallback.className = 'w-full h-full flex items-center justify-center bg-gray-200 rounded-lg';
    fallback.innerHTML = `<span class="text-gray-500 font-medium">${name}</span>`;
    parent.appendChild(fallback);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0e1e55] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading hot deals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                <Award className="text-white" size={32} />
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Zap size={12} className="text-white" />
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
            Exclusive Hot Deals
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover premium professionals and equipment with special discounts. 
            Your one-stop destination for construction excellence.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
              🎯 Verified Professionals
            </div>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
              ⚡ Instant Contact
            </div>
            <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold">
              💰 Best Prices
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Premium Professionals Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              👑 Premium Professionals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked top-rated professionals with exclusive 5% OFF offers. 
              Click to connect directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {professionals.map((professional) => (
              <div
                key={professional.id}
                onClick={() => openProfessionalModal(professional)}
                className="group bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200/50 transition-all duration-500 hover:shadow-2xl hover:scale-105 cursor-pointer relative"
              >
                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {professional.badge}
                  </span>
                </div>

                {/* Professional Card */}
                <div className="p-6">
                  {/* Professional Image */}
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4 relative group-hover:scale-110 transition-transform duration-300">
                      {professional.image ? (
                        <img 
                          src={professional.image} 
                          alt={professional.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                          onError={(e) => handleImageError(e, professional.name)}
                        />
                      ) : (
                        <span className="text-2xl font-bold text-gray-600">
                          {professional.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                      {professional.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white">
                          <BadgeCheck size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-2">
                      <h3 className="text-xl font-bold text-gray-900 truncate">{professional.name}</h3>
                      <p className="text-sm font-semibold text-blue-600">{professional.profession}</p>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span className="truncate max-w-[120px]">{professional.location || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{professional.rating || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Offer Badge */}
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 text-center shadow-lg">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <Award className="w-5 h-5" />
                      <span className="font-bold text-lg">5% OFF</span>
                    </div>
                    <p className="text-sm font-semibold">{professional.offer}</p>
                  </div>

                  {/* Click to View */}
                  <div className="flex justify-center mt-4">
                    <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                      Click to view details ↓
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Best Deals Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🔥 Hot Equipment Deals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Premium construction equipment with massive discounts. 
              Limited time offers!
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#0e1e55] via-[#1e3a8a] to-[#3730a3] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestDeals.map((deal) => (
                  <div 
                    key={deal.id}
                    onClick={() => handleBestDealClick(deal)}
                    className="group bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer border border-white/30"
                  >
                    {/* Badge */}
                    <div className="absolute -top-2 -right-2 z-20">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold text-white shadow-xl ${
                        deal.badge === 'HOT' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                        deal.badge === 'NEW' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                        'bg-gradient-to-r from-green-500 to-emerald-500'
                      }`}>
                        {deal.badge}
                      </span>
                    </div>
                    
                    {/* Image */}
                    <div className="relative h-40 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-gray-100 to-gray-200">
                      <img 
                        src={deal.image} 
                        alt={deal.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 p-4"
                        onError={(e) => handleImageError(e, deal.name)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="font-bold text-gray-900 text-lg mb-2 text-center">{deal.name}</h3>
                    <div className="flex items-center justify-center space-x-1 mb-3">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className="text-gray-600 font-medium">{deal.rating}</span>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <div className="text-lg font-bold text-green-600">{deal.discount}</div>
                      <div className="text-sm text-gray-500 line-through">{deal.price}</div>
                      <div className="text-xs text-gray-600">{deal.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Shops Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🏪 Top Equipment Shops
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trusted equipment rental and sales shops with excellent service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shops.map((shop) => (
              <div
                key={shop.id}
                onClick={() => handleShopClick(shop)}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200/50 transition-all duration-500 hover:shadow-2xl hover:scale-105 cursor-pointer group"
              >
                <div className="p-6">
                  {/* Shop Image */}
                  <div className="relative h-32 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-gray-100 to-gray-200">
                    <img 
                      src={shop.image} 
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => handleImageError(e, shop.name)}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        {shop.rating} ★
                      </span>
                    </div>
                  </div>

                  {/* Shop Info */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{shop.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{shop.specialty}</p>
                  
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <MapPin size={12} />
                        <span>{shop.location}</span>
                      </div>
                      <span>🚚 {shop.delivery}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>📊 {shop.projects}+ projects</span>
                      <span className="text-green-600 font-semibold">Verified</span>
                    </div>
                  </div>

                  {/* Explore Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShopClick(shop);
                    }}
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 text-sm hover:scale-105"
                  >
                    Explore Shop
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Connect with top professionals and get the best equipment deals today. 
              Your construction success starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/')}
                className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Browse All Professionals
              </button>
              <button
                onClick={() => router.push('/shops')}
                className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Explore Equipment Shops
              </button>
            </div>
          </div>
        </section>

        {/* Professional Modal */}
        {selectedProfessional && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-3xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Professional Details</h3>
                  <button
                    onClick={closeProfessionalModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors hover:scale-110"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                {/* Professional Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    {selectedProfessional.image ? (
                      <img 
                        src={selectedProfessional.image} 
                        alt={selectedProfessional.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-gray-600">
                        {selectedProfessional.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xl font-bold text-gray-900">{selectedProfessional.name}</h4>
                      {selectedProfessional.verified && (
                        <BadgeCheck size={20} className="text-blue-500" />
                      )}
                    </div>
                    <p className="text-blue-600 font-semibold">{selectedProfessional.profession}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <MapPin size={14} />
                      <span>{selectedProfessional.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Special Offer */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Award className="w-6 h-6" />
                      <span className="font-bold text-lg">Special Offer</span>
                    </div>
                    <span className="bg-white text-orange-600 px-4 py-2 rounded-xl font-bold text-lg">
                      5% OFF
                    </span>
                  </div>
                  <p className="font-semibold text-lg">{selectedProfessional.offer}</p>
                  <p className="text-orange-100 text-sm mt-2">{selectedProfessional.offerDescription}</p>
                </div>

                {/* Professional Details */}
                <div className="space-y-4">
                  <h5 className="font-semibold text-gray-900 text-lg">Professional Information</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <span className="text-gray-600">Experience</span>
                      <p className="font-semibold text-gray-900">{selectedProfessional.experience || 'Not specified'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <span className="text-gray-600">Rating</span>
                      <p className="font-semibold text-gray-900">{selectedProfessional.rating || 'N/A'}/5</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <span className="text-gray-600">Projects</span>
                      <p className="font-semibold text-gray-900">{selectedProfessional.projectsCompleted || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <span className="text-gray-600">Reviews</span>
                      <p className="font-semibold text-gray-900">{selectedProfessional.reviews || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <span className="text-gray-600 text-sm">Specialization</span>
                    <p className="font-semibold text-gray-900 mt-1">{selectedProfessional.specialty}</p>
                  </div>

                  {selectedProfessional.about && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <span className="text-gray-600 text-sm">About</span>
                      <p className="text-gray-700 mt-1">{selectedProfessional.about}</p>
                    </div>
                  )}
                </div>

                {/* Contact Actions */}
                <div className="space-y-3">
                  <h5 className="font-semibold text-gray-900 text-lg">Contact Now</h5>
                  <button
                    onClick={() => handleCall(selectedProfessional.phone || '9480072737')}
                    className="w-full bg-green-600 text-white font-semibold py-4 rounded-xl hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105 shadow-lg"
                  >
                    <Phone size={20} />
                    <span>Call {selectedProfessional.phone || '9480072737'}</span>
                  </button>
                  
                  <button
                    onClick={() => handleWhatsApp(selectedProfessional)}
                    className="w-full bg-green-500 text-white font-semibold py-4 rounded-xl hover:bg-green-600 transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105 shadow-lg"
                  >
                    <MessageCircle size={20} />
                    <span>Message on WhatsApp</span>
                  </button>

                  {selectedProfessional.email && (
                    <button
                      onClick={() => handleEmail(selectedProfessional.email)}
                      className="w-full border-2 border-blue-600 text-blue-600 font-semibold py-4 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105"
                    >
                      <Mail size={20} />
                      <span>Send Email</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}