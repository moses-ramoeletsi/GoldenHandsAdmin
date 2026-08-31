import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, Trash2, Loader2 } from 'lucide-react';
import { bookingFunctionStore } from '../store/booking.store';
import toast from 'react-hot-toast';
import ConfirmDialog from './ConfirmDialog';

const BookingsTab = () => {
  const { bookings, fetchBookings, updateBookingStatus, deleteBooking, isLoading } = bookingFunctionStore();
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    const result = await updateBookingStatus(id, newStatus);
    if (result.success) toast.success(`Booking marked as ${newStatus}`);
    else toast.error(result.message);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const result = await deleteBooking(deleteId);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
    setIsDeleting(false);
    setDeleteId(null);
  };

  const filteredBookings = filterStatus === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Booking Management</h2>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === status ? 'bg-yellow-500 text-black' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-yellow-500" size={40} /></div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900">No bookings found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Service</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map(booking => (
                  <tr key={booking._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-sm">
                          {booking.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{booking.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12}/> {booking.email}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1"><Phone size={12}/> {booking.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{booking.service}</div>
                      {booking.notes && <div className="text-xs text-gray-500 mt-1 italic max-w-[200px] truncate" title={booking.notes}>"{booking.notes}"</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400"/> 
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <Clock size={14} className="text-gray-400"/> 
                        {booking.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${getStatusColor(booking.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setDeleteId(booking._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Booking"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Booking"
        message="Are you sure you want to delete this booking record? This cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default BookingsTab;