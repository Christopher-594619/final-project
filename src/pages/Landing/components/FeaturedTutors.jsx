import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tutorService } from '../../../services/tutorService';
import TutorCard from '../../../components/common/TutorCard';
import LoadingSkeleton from '../../../components/common/LoadingSkeleton';

const FeaturedTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTutors = async () => {
      try {
        const data = await tutorService.getFeaturedTutors();
        setTutors(data);
      } catch (error) {
        console.error('Error loading featured tutors:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTutors();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Featured Tutors</h2>
          <p className="section-subtitle">
            Meet our top-rated tutors with exceptional reviews and proven expertise
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} type="card" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/search"
                className="btn-primary inline-flex items-center gap-2"
              >
                View All Tutors
                <span className="text-sm">→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedTutors;