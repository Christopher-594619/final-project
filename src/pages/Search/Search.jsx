import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTutors } from '../../hooks/useTutors';
import { useGeolocation } from '../../hooks/useGeolocation';
import TutorCard from '../../components/common/TutorCard';
import SearchFilters from './components/SearchFilters';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { FiFilter } from 'react-icons/fi';
import { FaSlidersH } from 'react-icons/fa';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filteredTutors, isLoading, searchTutors } = useTutors();
  const { location } = useGeolocation();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    subject: '',
    level: '',
    mode: '',
    distance: 10,
    priceRange: [0, 200],
    rating: 0,
    availability: '',
  });

  useEffect(() => {
    // Update search results when filters change
    searchTutors(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, query }));
    if (query) {
      searchParams.set('q', query);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      subject: '',
      level: '',
      mode: '',
      distance: 10,
      priceRange: [0, 200],
      rating: 0,
      availability: '',
    });
    searchParams.delete('q');
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Tutor</h1>
          <p className="text-gray-600 mt-2">
            {filteredTutors.length} tutors found {location && 'near you'}
          </p>
        </div>

        {/* Mobile filter button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl shadow-soft border border-gray-200 hover:shadow-medium transition-all"
          >
            <FaSlidersH className="text-gray-500" />
            <span className="font-medium">Filters</span>
            <span className="ml-auto text-sm text-gray-500">
              {Object.values(filters).filter(v => v && v !== '' && v !== 0 && v !== [0, 200]).length} active
            </span>
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filters sidebar */}
          <div className={`
            fixed inset-0 z-40 lg:relative lg:inset-auto
            ${showMobileFilters ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 transition-transform duration-300
          `}>
            <div className="bg-white lg:bg-transparent w-80 lg:w-72 h-full overflow-y-auto p-6 lg:p-0">
              <div className="lg:sticky lg:top-8">
                <div className="flex items-center justify-between lg:hidden mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <SearchFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClear={clearFilters}
                />
              </div>
            </div>
            {/* Overlay */}
            {showMobileFilters && (
              <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden"
                onClick={() => setShowMobileFilters(false)}
              />
            )}
          </div>

          {/* Results */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <LoadingSkeleton key={i} type="card" />
                ))}
              </div>
            ) : filteredTutors.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTutors.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="🔍"
                title="No tutors found"
                description="Try adjusting your filters or search terms to find more tutors."
                action={
                  <button
                    onClick={clearFilters}
                    className="btn-primary"
                  >
                    Clear all filters
                  </button>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;