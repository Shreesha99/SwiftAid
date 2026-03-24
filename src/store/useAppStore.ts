import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Hospital } from '../data/hospitals';

export interface Booking {
  id: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  timestamp: string;
  emergencyType: string;
  userLocation: { lat: number; lng: number; address: string };
  hospital: Hospital;
  ambulanceType: string;
  driver?: {
    name: string;
    phone: string;
    vehicleNumber: string;
    currentLocation: { lat: number; lng: number };
    initialDistance: number;
    initialEta: number;
  };
  rating?: number;
  feedback?: string;
  feedbackTags?: string[];
}

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  emergencyContacts: { name: string; phone: string }[];
}

interface AppState {
  currentBooking: Booking | null;
  bookings: Booking[];
  userProfile: UserProfile;
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  addRating: (id: string, rating: number, feedback: string) => void;
  cancelBooking: (id: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentBooking: null,
      bookings: [],
      userProfile: {
        name: 'Rahul',
        phone: '+91 98765 43210',
        email: 'rahul@example.com',
        emergencyContacts: []
      },
      addBooking: (booking) => set((state) => ({
        currentBooking: booking,
        bookings: [booking, ...state.bookings]
      })),
      updateBookingStatus: (id, status) => set((state) => {
        const updatedBookings = state.bookings.map(b => 
          b.id === id ? { ...b, status } : b
        );
        const current = state.currentBooking?.id === id 
          ? { ...state.currentBooking, status } as Booking
          : state.currentBooking;
        return { bookings: updatedBookings, currentBooking: current };
      }),
      addRating: (id, rating, feedback) => set((state) => {
        const updatedBookings = state.bookings.map(b => 
          b.id === id ? { ...b, status: 'Completed' as const, rating, feedback } : b
        );
        return { 
          bookings: updatedBookings, 
          currentBooking: null 
        };
      }),
      cancelBooking: (id) => set((state) => {
        const updatedBookings = state.bookings.map(b => 
          b.id === id ? { ...b, status: 'Cancelled' as const } : b
        );
        return { 
          bookings: updatedBookings, 
          currentBooking: null 
        };
      }),
      updateProfile: (profile) => set((state) => ({
        userProfile: { ...state.userProfile, ...profile }
      }))
    }),
    {
      name: 'swift-aid-storage'
    }
  )
);
