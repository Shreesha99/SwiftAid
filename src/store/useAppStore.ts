import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Booking {
  id: string;
  status: 'Completed' | 'Cancelled' | 'Active';
  timestamp: string;
  emergencyType: string;
  userLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  hospital: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    address: string;
  };
  ambulanceType: string;
  driver: {
    name: string;
    phone: string;
    vehicleNumber: string;
  };
  cancelledAt?: string;
  completedAt?: string;
  rating?: number;
  feedback?: string;
  feedbackTags?: string[];
}

interface UserProfile {
  name: string;
  phone: string;
  bloodGroup: string;
  allergies: string;
  emergencyContacts: { name: string; phone: string }[];
}

interface AppState {
  userProfile: UserProfile;
  bookings: Booking[];
  currentBooking: Booking | null;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addBooking: (booking: Booking) => void;
  setCurrentBooking: (booking: Booking | null) => void;
  cancelBooking: (id: string) => void;
  completeBooking: (id: string, rating?: number, feedback?: string, tags?: string[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userProfile: {
        name: '',
        phone: '',
        bloodGroup: '',
        allergies: '',
        emergencyContacts: []
      },
      bookings: [],
      currentBooking: null,
      updateProfile: (profile) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...profile }
        })),
      addBooking: (booking) =>
        set((state) => ({
          bookings: [booking, ...state.bookings],
          currentBooking: booking
        })),
      setCurrentBooking: (booking) => set({ currentBooking: booking }),
      cancelBooking: (id) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, status: 'Cancelled', cancelledAt: new Date().toISOString() } : b
          ),
          currentBooking: state.currentBooking?.id === id ? null : state.currentBooking
        })),
      completeBooking: (id, rating, feedback, tags) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status: 'Completed',
                  completedAt: new Date().toISOString(),
                  rating,
                  feedback,
                  feedbackTags: tags
                }
              : b
          ),
          currentBooking: state.currentBooking?.id === id ? null : state.currentBooking
        }))
    }),
    {
      name: 'swift-aid-storage'
    }
  )
);
