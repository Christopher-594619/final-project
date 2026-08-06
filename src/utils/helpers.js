export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatTime = (time) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(new Date(`2000-01-01T${time}`));
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

export const getRandomColor = () => {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-800',
    'bg-indigo-100 text-indigo-800',
    'bg-teal-100 text-teal-800',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const sortByRating = (items) => {
  return [...items].sort((a, b) => b.rating - a.rating);
};

export const sortByDistance = (items, userLocation) => {
  if (!userLocation) return items;
  return [...items].sort((a, b) => {
    const distA = a.distance || 0;
    const distB = b.distance || 0;
    return distA - distB;
  });
};

export const getAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};

export const isAvailable = (tutor, day) => {
  return tutor.availability?.includes(day) || false;
};

export const getTutorStatus = (tutor) => {
  if (tutor.rating >= 4.8) return 'Top Rated';
  if (tutor.verified) return 'Verified';
  if (tutor.reviewsCount > 50) return 'Popular';
  return 'Available';
};

export const getPriceRange = (price) => {
  if (price < 50) return 'Affordable';
  if (price < 75) return 'Moderate';
  if (price < 100) return 'Premium';
  return 'Luxury';
};