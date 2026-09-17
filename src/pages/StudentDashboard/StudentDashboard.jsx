import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../hooks/useNotification';
import { FaCalendarAlt, FaHeart, FaSearch, FaBell, FaBookOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState';
import StatsCard from '../../components/dashboard/StatsCard';
import PaymentModal from '../../components/PaymentModal';
import ReceiptModal from '../../components/ReceiptModal';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_ENDPOINT_URL;

const StudentDashboard = () => {
  const { user, getValidAccessToken } = useAuth();
  const { notifications } = useNotification();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [payingBooking, setPayingBooking] = useState(null);
  const [viewingReceiptId, setViewingReceiptId] = useState(null);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const token = await getValidAccessToken();
      const res = await fetch(`${BASE_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upcomingCount = bookings.filter(b => b.payment_status !== 'completed').length;

  const stats = [
    {
      title: 'Upcoming Lessons',
      value: upcomingCount,
      icon: FaCalendarAlt,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: FaSearch,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Notifications',
      value: notifications.filter(n => !n.read).length,
      icon: FaBell,
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
        </h1>
        <p className="text-gray-600 mt-1">Here's an overview of your learning journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Bookings */}
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaCalendarAlt className="text-primary-500" />
            Your Bookings
          </h2>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500">Loading bookings...</p>
        ) : bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">{booking.tutor_email}</p>
                  <p className="text-sm text-gray-500">K{booking.rate}/hour</p>
                </div>
                <div className="flex items-center gap-3">
                  {booking.payment_status === 'completed' ? (
                    <button
                      onClick={() => setViewingReceiptId(booking.transaction_id)}
                      className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                    >
                      Paid — {booking.receipt_number} (view receipt)
                    </button>
                  ) : booking.is_confirmed ? (
                    <button
                      onClick={() => setPayingBooking(booking)}
                      className="btn-primary text-xs px-3 py-1.5"
                    >
                      Pay Now
                    </button>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                      Awaiting tutor confirmation
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="📅"
            title="No bookings yet"
            description="Start your learning journey by booking a session with a tutor."
            action={
              <Link to="/search" className="btn-primary text-sm">
                Find a Tutor
              </Link>
            }
          />
        )}
      </div>

      {/* Payment Modal */}
      {payingBooking && (
        <PaymentModal
          booking={payingBooking}
          onClose={() => setPayingBooking(null)}
          onSuccess={() => {
            toast.success('Payment complete!');
            setPayingBooking(null);
            loadBookings();
          }}
        />
      )}

      {viewingReceiptId && (
        <ReceiptModal
          transactionId={viewingReceiptId}
          onClose={() => setViewingReceiptId(null)}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
