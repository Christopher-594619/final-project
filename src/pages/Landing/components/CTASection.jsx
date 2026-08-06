import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary-600 to-secondary-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Find Your Perfect Tutor?
        </h2>
        <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
          Join thousands of students who have found their ideal learning partner. 
          Start your journey to academic success today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Find a Tutor Now
            <FaArrowRight className="text-sm" />
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-500/20 text-white rounded-xl font-semibold border border-primary-400/30 hover:bg-primary-500/30 transition-all duration-200"
          >
            Become a Tutor
          </Link>
        </div>
        <p className="text-primary-200 text-sm mt-6">
          🎓 Join 15,000+ tutors and 50,000+ students already on Tutor Finder
        </p>
      </div>
    </section>
  );
};

export default CTASection;