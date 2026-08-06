import React from 'react';
import { Link } from 'react-router-dom';
import { useTutors } from '../../hooks/useTutors';
import RatingStars from './RatingStars';
import VerifiedBadge from './VerifiedBadge';
import AvailabilityBadge from './AvailabilityBadge';
import PriceBadge from './PriceBadge';
import SubjectTags from './SubjectTags';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaBookOpen } from 'react-icons/fa';
import { formatters } from '../../utils/formatters';

const TutorCard = ({ tutor }) => {
  const { toggleFavorite, isFavorite } = useTutors();
  const isFav = isFavorite(tutor.id);

  return (
    <div className="card card-hover overflow-hidden group">
      <div className="relative">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm shadow-soft flex items-center justify-center text-3xl font-bold text-primary-600">
              {tutor.avatar}
            </div>
          </div>
          {/* Favorite button */}
          <button
            onClick={() => toggleFavorite(tutor.id)}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft hover:bg-white transition-colors"
          >
            {isFav ? (
              <FaHeart className="text-red-500 w-4 h-4" />
            ) : (
              <FaRegHeart className="text-gray-400 w-4 h-4" />
            )}
          </button>
          {/* Verified badge */}
          {tutor.verified && (
            <div className="absolute top-3 left-3">
              <VerifiedBadge />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <Link to={`/tutor/${tutor.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                  {tutor.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <RatingStars rating={tutor.rating} size="sm" />
                <span className="font-medium">{tutor.rating}</span>
                <span>({tutor.reviewsCount} reviews)</span>
              </div>
            </div>
            <PriceBadge price={tutor.price} />
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {tutor.bio}
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <FaMapMarkerAlt className="w-3 h-3" />
            <span>{tutor.distance ? formatters.distance(tutor.distance) : 'Online'}</span>
            <span className="w-px h-4 bg-gray-200"></span>
            <FaBookOpen className="w-3 h-3" />
            <span>{tutor.subjects.slice(0, 2).join(', ')}{tutor.subjects.length > 2 && '...'}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            <SubjectTags subjects={tutor.subjects.slice(0, 3)} />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Available</span>
              <AvailabilityBadge availability={tutor.availability} />
            </div>
            <div className="flex gap-2">
              <Link
                to={`/tutor/${tutor.id}`}
                className="px-3 py-1.5 text-sm text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
              >
                View Profile
              </Link>
              <Link
                to={`/tutor/${tutor.id}?book=true`}
                className="btn-primary px-3 py-1.5 text-sm"
              >
                Book
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;