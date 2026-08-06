import { useContext } from 'react';
import { TutorContext } from '../context/TutorContext';

export const useTutors = () => {
  const context = useContext(TutorContext);
  if (!context) {
    throw new Error('useTutors must be used within a TutorProvider');
  }
  return context;
};