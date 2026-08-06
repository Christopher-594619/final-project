import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { FaLocationDot, FaArrowRight} from "react-icons/fa6";
import SearchBar from '../../../components/common/SearchBar';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft mb-8 border border-gray-200/50">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-700">Live in 15,000+ cities</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Find Your Perfect
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {' '}Tutor
            </span>
            {' '}Near You
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with expert tutors in your area. Get personalized learning support 
            for any subject, at any level.
          </p>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-hard p-4 md:p-6 border border-gray-100">
              <SearchBar 
                placeholder="Search for subjects, tutors, or skills..."
                className="w-full"
                onSearch={(query) => {
                  // Handle search
                  console.log('Searching for:', query);
                }}
              />
              <div className="flex flex-wrap gap-3 justify-center mt-4 text-sm">
                <span className="text-gray-500">Popular:</span>
                <button className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  Mathematics
                </button>
                <button className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  Physics
                </button>
                <button className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  Chemistry
                </button>
                <button className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  Computer Science
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              to="/search"
              className="btn-primary px-8 py-3 text-base flex items-center gap-2"
            >
              Find Tutors Now
              <FaArrowRight className="text-sm" />
            </Link>
            <button
              className="btn-secondary px-8 py-3 text-base flex items-center gap-2"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      console.log('Location:', position.coords);
                    },
                    (error) => {
                      console.error('Location error:', error);
                    }
                  );
                }
              }}
            >
              <FaLocationDot className="text-primary-500" />
              Use My Location
            </button>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 flex-wrap">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">15,000+</div>
              <div className="text-sm text-gray-500">Active Tutors</div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">4.9/5</div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">50,000+</div>
              <div className="text-sm text-gray-500">Lessons Booked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl -translate-x-1/2"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl translate-x-1/2"></div>
    </section>
  );
};

export default Hero;