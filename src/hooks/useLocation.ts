import { useState, useEffect } from 'react';

export interface LocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: true
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false
      }));
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        error: null,
        loading: false
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      setLocation((prev) => ({
        ...prev,
        error: error.message,
        loading: false
      }));
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  return location;
};
