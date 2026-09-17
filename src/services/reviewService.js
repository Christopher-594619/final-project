// src/services/reviewService.js
const BASE_URL = import.meta.env.VITE_ENDPOINT_URL;

function mapReview(r) {
  return {
    id: r.id,
    studentId: r.student_id,
    studentName: r.student_name || r.student_email || 'Student',
    rating: r.rating,
    content: r.comment,
    date: r.created_at,
  };
}

export const reviewService = {
  // Public — no token needed. Returns { reviews, averageRating, reviewCount }.
  getReviews: async (tutorId) => {
    const res = await fetch(`${BASE_URL}/api/reviews/tutor/${tutorId}`);
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Could not load reviews.');
    }
    return {
      reviews: (data.reviews || []).map(mapReview),
      averageRating: data.averageRating || 0,
      reviewCount: data.reviewCount || 0,
    };
  },

  // The logged-in student's own review for this tutor, if any.
  getMyReview: async (tutorId, token) => {
    if (!token) return null;
    const res = await fetch(`${BASE_URL}/api/reviews/tutor/${tutorId}/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok || !data.success) return null;
    return data.review ? mapReview(data.review) : null;
  },

  // Create or update the logged-in student's review for a tutor. Throws
  // with the backend's message (e.g. "You can only review a tutor after
  // completing a paid session with them.") if not eligible yet.
  addReview: async ({ tutorId, rating, comment }, token) => {
    const res = await fetch(`${BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tutor_id: tutorId, rating, comment }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Could not submit review.');
    }
    return mapReview(data.review);
  },

  deleteReview: async (reviewId, token) => {
    const res = await fetch(`${BASE_URL}/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Could not delete review.');
    }
    return true;
  },
};
