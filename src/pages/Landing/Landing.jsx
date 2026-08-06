import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import FeaturedTutors from './components/FeaturedTutors';
import Testimonials from './components/Testimonials';
import CTASection from './components/CTASection';

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Hero />
      <HowItWorks />
      <FeaturedTutors />
      <Testimonials />
      <CTASection />
    </div>
  );
};

export default Landing;