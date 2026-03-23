/* src/pages/MyBookings.tsx */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ChevronRight, Clock, XCircle, CheckCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { format, isValid } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MyBookings: React.FC = () => {
  const navigate = useNavigate();
  const { bookings } = useAppStore();

  const safeFormat = (dateStr: string | undefined, formatStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (!isValid(date)) return 'N/A';
    return format(date, formatStr);
  };

  return (
    <div className="flex flex-col p-6 gap-6 min-h-full bg-white overflow-y-auto">
      <h1 className="text-3xl font-black text-[#1D3557] mt-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-24 gap-6">
          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center text-5xl shadow-inner">
            🚑
          </div>
          <div className="text-center flex flex-col gap-2">
            <h3 className="text-xl font-black text-[#1D3557]">No bookings yet</h3>
            <p className="text-sm text-gray-500">Your emergency booking history will appear here.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-10 py-4 bg-[#E63946] text-white rounded-2xl font-black shadow-xl shadow-red-100 active:scale-95 transition-transform"
          >
            Book Now
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 pb-24">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => booking.status === 'Active' && navigate(`/tracking/${booking.id}`)}
              className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm flex flex-col gap-5 active:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    <Calendar size={12} />
                    <span>{safeFormat(booking.timestamp, 'dd MMM yyyy, hh:mm a')}</span>
                  </div>
                  <h3 className="font-black text-[#1D3557] text-xl capitalize">{booking.emergencyType}</h3>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                      booking.status === 'Completed' && "bg-green-100 text-green-700",
                      booking.status === 'Cancelled' && "bg-red-100 text-red-700",
                      booking.status === 'Active' && "bg-blue-100 text-blue-700 animate-pulse"
                    )}
                  >
                    {booking.status}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">ID: {booking.id}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3 text-xs text-gray-500">
                  <MapPin size={16} className="text-[#E63946] shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed truncate">{booking.userLocation.address}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <Clock size={16} className="text-[#457B9D] shrink-0" />
                  <span className="font-medium truncate">Hospital: {booking.hospital.name}</span>
                </div>
              </div>

              {booking.status === 'Active' ? (
                <div className="flex items-center justify-between mt-2 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                    <span className="text-xs font-black text-blue-700 uppercase tracking-wider">Track Live Ambulance</span>
                  </div>
                  <ChevronRight size={18} className="text-blue-700" />
                </div>
              ) : booking.status === 'Cancelled' ? (
                <div className="flex items-center gap-2 text-[10px] text-red-400 font-bold uppercase tracking-widest mt-2">
                  <XCircle size={14} />
                  <span>Cancelled at {safeFormat(booking.cancelledAt, 'hh:mm a')}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold uppercase tracking-widest mt-2">
                  <CheckCircle size={14} />
                  <span>Completed at {safeFormat(booking.completedAt, 'hh:mm a')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
