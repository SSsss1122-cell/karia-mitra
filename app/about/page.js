// app/about/page.js
'use client';

import { useRouter } from 'next/navigation';
import { Users, Shield, FileText, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const router = useRouter();

  const legalPages = [
    {
      id: 'terms',
      title: 'Terms of Service',
      description: 'Read our terms and conditions',
      icon: <FileText size={20} />
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      description: 'Learn how we protect your data',
      icon: <Shield size={20} />
    },
    {
      id: 'refund',
      title: 'Refund Policy',
      description: 'Our refund and cancellation policy',
      icon: <FileText size={20} />
    },
    {
      id: 'shipping',
      title: 'Shipping Policy',
      description: 'Information about delivery and shipping',
      icon: <FileText size={20} />
    }
  ];

  const handleJoinPartner = () => {
    router.push('/partner-registration');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Karia Mitra</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted partner in agricultural solutions. We connect farmers with the best 
            resources, tools, and partners to enhance productivity and growth.
          </p>
        </div>

        {/* Join as Partner Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-white" size={28} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join as a Partner</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Become part of our growing network of agricultural partners. Offer your products 
              and services to thousands of farmers across the region.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Benefits for Partners</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#0e1e55] rounded-full mr-3"></div>
                 Increased visibility among local customers.
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#0e1e55] rounded-full mr-3"></div>
                  Steady and reliable work opportunities.
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#0e1e55] rounded-full mr-3"></div>
                 Easy profile and service management through the app.
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#0e1e55] rounded-full mr-3"></div>
                 Secure, fast, and transparent payment system.


                </li>
             
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#0e1e55] rounded-full mr-3"></div>
                  Registered business entity
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#0e1e55] rounded-full mr-3"></div>
                  Quality products/services
                </li>
              
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#0e1e55] rounded-full mr-3"></div>
                  Good customer service
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#0e1e55] rounded-full mr-3"></div>
                  Compliance with standards
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleJoinPartner}
              className="bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] text-white font-bold py-4 px-12 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 text-lg shadow-lg"
            >
              Join as Partner Now
            </button>
            <p className="text-gray-500 mt-4 text-sm">
              Our team will contact you within 24 hours
            </p>
          </div>
        </div>

        {/* Legal Pages Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Legal Information</h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {legalPages.map((page) => (
              <Link
                key={page.id}
                href={`/legal/${page.id}`}
                className="border border-gray-200 rounded-xl p-6 hover:border-[#0e1e55] hover:shadow-md transition-all duration-300 cursor-pointer group block"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-[#0e1e55] group-hover:scale-110 transition-transform duration-300">
                    {page.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#0e1e55] transition-colors duration-300">
                      {page.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">{page.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-[#0e1e55] to-[#1e3a8a] rounded-2xl p-8 mt-8 text-white">
          <h2 className="text-2xl font-bold text-center mb-6">Contact Us</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Mail className="mb-2" size={24} />
              <p className="font-semibold">Email</p>
              <p className="text-blue-100">support@kariamitra.com</p>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="mb-2" size={24} />
              <p className="font-semibold">Phone</p>
              <p className="text-blue-100">+91-63625 27976</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="mb-2" size={24} />
              <p className="font-semibold">Address</p>
              <p className="text-blue-100">kalaburagi karnataka , India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}