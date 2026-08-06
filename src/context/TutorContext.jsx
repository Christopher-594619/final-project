import React, { createContext, useState, useEffect } from 'react';
import { tutorService } from '../services/tutorService';
import { mockTutors } from '../data/tutors';

export const TutorContext = createContext();

export const TutorProvider = ({ children }) => {
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [searchParams, setSearchParams] = useState({
    query: '',
    subject: '',
    level: '',
    mode: '',
    distance: 10,
    priceRange: [0, 200],
    rating: 0,
    availability: '',
  });

  useEffect(() => {
    loadTutors();
    loadFavorites();
  }, []);

  const loadTutors = async () => {
    setIsLoading(true);
    try {
      const data = await tutorService.getTutors();
      setTutors(data);
      setFilteredTutors(data);
    } catch (error) {
      console.error('Error loading tutors:', error);
      setTutors(mockTutors);
      setFilteredTutors(mockTutors);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('tutorFinderFavorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const searchTutors = (params) => {
    setSearchParams(params);
    const results = tutorService.searchTutors(params, tutors);
    setFilteredTutors(results);
    return results;
  };

  const getTutorById = (id) => {
    return tutors.find(tutor => tutor.id === id);
  };

  const toggleFavorite = (tutorId) => {
    const newFavorites = favorites.includes(tutorId)
      ? favorites.filter(id => id !== tutorId)
      : [...favorites, tutorId];
    setFavorites(newFavorites);
    localStorage.setItem('tutorFinderFavorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (tutorId) => favorites.includes(tutorId);

  return (
    <TutorContext.Provider
      value={{
        tutors,
        filteredTutors,
        isLoading,
        searchTutors,
        getTutorById,
        favorites,
        toggleFavorite,
        isFavorite,
        searchParams,
      }}
    >
      {children}
    </TutorContext.Provider>
  );
};