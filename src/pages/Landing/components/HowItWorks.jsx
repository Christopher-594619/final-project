import React from 'react';
import { FaUserPlus, FaSearch, FaCalendarCheck } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      icon: FaUserPlus,
      title: 'Create Account',
      description: 'Sign up as a student or tutor and set up your profile.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: FaSearch,
      title: 'Find Your Match',
      description: 'Search for tutors by subject, level, location, and more.',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: FaCalendarCheck,
      title: 'Book & Learn',
      description: 'Schedule sessions, attend lessons, and achieve your goals.',
      color: 'from-green-500 to-emerald-600',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Get started with Tutor Finder in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="bg-white rounded-2xl shadow-soft hover:shadow-hard transition-all duration-300 p-8 text-center border border-gray-100/50 hover:border-transparent">
                <div className={`
                  w-20 h-20 mx-auto mb-6 rounded-2xl 
                  bg-gradient-to-br ${step.color} 
                  flex items-center justify-center 
                  shadow-soft group-hover:shadow-medium 
                  transition-all duration-300 group-hover:scale-110
                `}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-gray-200 to-gray-300">
                  <div className="absolute top-1/2 -right-1 -mt-1.5 w-3 h-3 border-t-2 border-r-2 border-gray-300 transform rotate-45"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;