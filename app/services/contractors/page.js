"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Wrench, Zap, Paintbrush, Square, Home, Shield, Thermometer, SquareStack, Layout } from "lucide-react";

export default function ContractorPage() {
  const router = useRouter();

  const contractorTypes = [
    { 
      id: 1, 
      name: "Plumbing", 
      type: "plumbing", 
      image: "/images/plumber.jpg", 
      desc: "Water lines, fittings & bathroom works",
      icon: <Wrench className="w-8 h-8 text-white" />,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      id: 2, 
      name: "Electrical", 
      type: "electrical", 
      image: "/images/electrical.jpg", 
      desc: "Wiring, lighting & power systems",
      icon: <Zap className="w-8 h-8 text-white" />,
      color: "from-yellow-500 to-orange-500"
    },
    { 
      id: 3, 
      name: "Painting", 
      type: "painting", 
      image: "/images/painting-contractor.jpg", 
      desc: "Interior & exterior painting solutions",
      icon: <Paintbrush className="w-8 h-8 text-white" />,
      color: "from-purple-500 to-pink-500"
    },
    { 
      id: 4, 
      name: "Flooring", 
      type: "flooring", 
      image: "/images/flooring.jpg", 
      desc: "Tiles, marble, wooden & epoxy flooring",
      icon: <Square className="w-8 h-8 text-white" />,
      color: "from-amber-500 to-orange-500"
    },
    { 
      id: 5, 
      name: "Roofing", 
      type: "roofing", 
      image: "/images/roofing.jpg", 
      desc: "Roof installation & waterproofing",
      icon: <Home className="w-8 h-8 text-white" />,
      color: "from-red-500 to-rose-500"
    },
    { 
      id: 6, 
      name: "Cladding", 
      type: "cladding", 
      image: "/images/claddding.jpg", 
      desc: "Exterior finishing (ACP, glass, etc.)",
      icon: <Layout className="w-8 h-8 text-white" />,
      color: "from-gray-500 to-blue-500"
    },
    { 
      id: 7, 
      name: "Firefighting", 
      type: "firefighting", 
      image: "/images/fire-fighter.jpg", 
      desc: "Fire safety & sprinkler systems",
      icon: <Shield className="w-8 h-8 text-white" />,
      color: "from-red-600 to-orange-500"
    },
    { 
      id: 8, 
      name: "HVAC", 
      type: "hvac", 
      image: "/images/hvac.jpg", 
      desc: "Heating, ventilation, air conditioning",
      icon: <Thermometer className="w-8 h-8 text-white" />,
      color: "from-green-500 to-emerald-500"
    },
    { 
      id: 9, 
      name: "Masonry", 
      type: "masonry", 
      image: "/images/masonry.jpg", 
      desc: "Brick, block & concrete work",
      icon: <SquareStack className="w-8 h-8 text-white" />,
      color: "from-stone-500 to-gray-600"
    },
    { 
      id: 10, 
      name: "Interior", 
      type: "interior", 
      image: "/images/interior.jpg", 
      desc: "False ceilings, partitions & finishing",
      icon: <Layout className="w-8 h-8 text-white" />,
      color: "from-indigo-500 to-purple-500"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Enhanced Header */}
      <header className="bg-white shadow-lg border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-105 group"
            >
              <ArrowLeft size={24} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                <Users size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Contractors</h1>
                <p className="text-gray-600 text-lg mt-1">
                  Professional experts for every type of construction work
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Contractor Categories Grid */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your <span className="text-blue-600">Specialized</span> Contractor
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with certified professionals for all your construction needs. 
              Quality work guaranteed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {contractorTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => router.push(`/services/contractors/${type.type}`)}
                className="group bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer"
              >
                {/* Image Container with Overlay */}
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={type.image}
                    alt={type.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.className = 
                        "h-48 relative overflow-hidden bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center";
                    }}
                  />
                  
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300"></div>
                  
                  {/* Icon */}
                  <div className="absolute top-4 left-4">
                    <div className={`p-3 bg-gradient-to-r ${type.color} rounded-xl shadow-lg`}>
                      {type.icon}
                    </div>
                  </div>
                  
                  {/* Service Name Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white drop-shadow-2xl">
                      {type.name}
                    </h3>
                    <p className="text-white/90 text-sm mt-1 drop-shadow-lg">
                      {type.desc}
                    </p>
                  </div>

                  {/* Hover Effect - View Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-gray-900 font-semibold text-lg">View Contractors</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="p-4 bg-gradient-to-r from-white to-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">Available Now</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Can't Find What You're Looking For?
              </h3>
              <p className="text-gray-600 mb-6">
                Contact us directly and we'll connect you with the right professional for your specific needs.
              </p>
              <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Get Custom Quote
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}