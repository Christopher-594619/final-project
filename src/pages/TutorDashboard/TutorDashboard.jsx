import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMoneyBillWave, FaUserCheck, FaStar } from 'react-icons/fa';
import StatsCard from '../../components/dashboard/StatsCard';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_ENDPOINT_URL;

const TutorDashboard = () => {
  const { user, getValidAccessToken } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);

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

  const handleConfirm = async (bookingId) => {
    setConfirmingId(bookingId);
    try {
      const token = await getValidAccessToken();
      const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/confirm`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not confirm booking.');
      }
      toast.success('Booking confirmed! The student can now pay.');
      loadBookings();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setConfirmingId(null);
    }
  };

  const pendingCount = bookings.filter(b => !b.is_confirmed).length;
  const confirmedCount = bookings.filter(b => b.is_confirmed).length;
  const totalEarnings = bookings
    .filter(b => b.payment_status === 'completed')
    .reduce((sum, b) => sum + Number(b.rate) * 0.9, 0);

  const stats = [
    {
      title: 'Pending Bookings',
      value: pendingCount,
      icon: FaCalendarAlt,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Total Earnings',
      value: `K${totalEarnings.toFixed(2)}`,
      icon: FaMoneyBillWave,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Confirmed Bookings',
      value: confirmedCount,
      icon: FaUserCheck,
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  return (
    <div className="space-y-8 w-full min-w-0">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0] || 'Tutor'}!
        </h1>
        <p className="text-gray-600 mt-1">Here's an overview of your tutoring business</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Bookings */}
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaCalendarAlt className="text-primary-500" />
          Your Bookings
        </h2>

        {isLoading ? (
          <p className="text-sm text-gray-500">Loading bookings...</p>
        ) : bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">{booking.student_email}</p>
                  <p className="text-sm text-gray-500">K{booking.rate}/hour</p>
                </div>
                <div className="flex items-center gap-3">
                  {booking.payment_status === 'completed' ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      Paid — {booking.receipt_number}
                    </span>
                  ) : booking.is_confirmed ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      Confirmed — awaiting payment
                    </span>
                  ) : (
                    <>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                      <button
                        onClick={() => handleConfirm(booking.id)}
                        disabled={confirmingId === booking.id}
                        className="btn-primary text-xs px-3 py-1.5 disabled:opacity-50"
                      >
                        {confirmingId === booking.id ? 'Confirming...' : 'Confirm'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="📅"
            title="No bookings yet"
            description="Bookings from students will show up here."
          />
        )}
      </div>
    </div>
  );
};

export default TutorDashboard;
