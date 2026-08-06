import { mockTutors } from '../data/tutors';
import { mockReviews } from '../data/reviews';

export const tutorService = {
  getTutors: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTutors);
      }, 500);
    });
  },

  getTutorById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tutor = mockTutors.find(t => t.id === id);
        if (tutor) {
          resolve({ ...tutor, reviews: mockReviews.filter(r => r.tutorId === id) });
        } else {
          reject(new Error('Tutor not found'));
        }
      }, 300);
    });
  },

  searchTutors: (params, tutors) => {
    let results = tutors || mockTutors;

    if (params.query) {
      const query = params.query.toLowerCase();
      results = results.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.subjects.some(s => s.toLowerCase().includes(query)) ||
        t.skills?.some(s => s.toLowerCase().includes(query)) ||
        t.bio?.toLowerCase().includes(query)
      );
    }

    if (params.subject) {
      results = results.filter(t =>
        t.subjects.some(s => s.toLowerCase().includes(params.subject.toLowerCase()))
      );
    }

    if (params.level) {
      results = results.filter(t => t.levels.includes(params.level));
    }

    if (params.mode) {
      results = results.filter(t => t.mode === params.mode || t.mode === 'both');
    }

    if (params.rating > 0) {
      results = results.filter(t => t.rating >= params.rating);
    }

    if (params.distance) {
      results = results.filter(t => (t.distance || 0) <= params.distance);
    }

    // Sort by rating and distance
    results.sort((a, b) => {
      if (a.rating !== b.rating) return b.rating - a.rating;
      return (a.distance || 0) - (b.distance || 0);
    });

    return results;
  },

  getFeaturedTutors: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const featured = mockTutors
          .filter(t => t.rating >= 4.5)
          .slice(0, 6);
        resolve(featured);
      }, 300);
    });
  },

  getPopularSubjects: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { name: 'Mathematics', count: 45, icon: '📐' },
          { name: 'Physics', count: 32, icon: '⚛️' },
          { name: 'Chemistry', count: 28, icon: '🧪' },
          { name: 'English', count: 25, icon: '📚' },
          { name: 'Computer Science', count: 22, icon: '💻' },
          { name: 'Biology', count: 18, icon: '🧬' },
        ]);
      }, 200);
    });
  },

  getTestimonials: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: 'Sarah Mulenga',
            role: 'Student',
            avatar: 'SJ',
            content: 'Tutor Finder helped me find an amazing math tutor. My grades improved from C to A in just three months!',
            rating: 5,
            subject: 'Mathematics',
          },
          {
            id: 2,
            name: 'Michael Mwanza',
            role: 'Student',
            avatar: 'MC',
            content: 'The platform made it so easy to find a physics tutor nearby. The booking system is seamless and intuitive.',
            rating: 5,
            subject: 'Physics',
          },
          {
            id: 3,
            name: 'Emily Chanda',
            role: 'Student',
            avatar: 'ER',
            content: 'I love how I can filter tutors by distance and price. Found my perfect chemistry tutor within minutes!',
            rating: 5,
            subject: 'Chemistry',
          },
        ]);
      }, 200);
    });
  },
};