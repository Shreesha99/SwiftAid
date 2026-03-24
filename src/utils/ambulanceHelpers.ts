import { haversine } from './mapHelpers';

/**
 * Simulates finding the closest available ambulance driver.
 * In a real app, this would query a backend with live driver locations.
 */
export function getClosestAmbulance(userLat: number, userLng: number) {
  // Simulate 3-5 drivers in the vicinity
  const drivers = [
    { name: 'Ravi Kumar', phone: '+91 98765 00001', vehicleNumber: 'KA-01-AB-1234' },
    { name: 'Suresh Raina', phone: '+91 98765 00002', vehicleNumber: 'KA-01-CD-5678' },
    { name: 'Amit Singh', phone: '+91 98765 00003', vehicleNumber: 'KA-01-EF-9012' },
  ];

  // Randomly place them within 1-4km of the user
  const simulatedDrivers = drivers.map(d => {
    // Random offset (roughly 0.01 degree is ~1.1km)
    const latOffset = (Math.random() - 0.5) * 0.04; 
    const lngOffset = (Math.random() - 0.5) * 0.04;
    
    const lat = userLat + latOffset;
    const lng = userLng + lngOffset;
    const distance = haversine(userLat, userLng, lat, lng);
    
    return {
      ...d,
      currentLocation: { lat, lng },
      distance,
      // Assume average speed of 20km/h in city traffic (3 min per km)
      eta: Math.ceil(distance * 3) + 2 // +2 min for dispatch/prep
    };
  });

  // Sort by distance and return the closest
  return simulatedDrivers.sort((a, b) => a.distance - b.distance)[0];
}

/**
 * Formats distance for display
 */
export function formatDistance(km: number) {
  if (km < 1) {
    return `${(km * 1000).toFixed(0)}m`;
  }
  return `${km.toFixed(1)}km`;
}

/**
 * Formats ETA for display
 */
export function formatEta(minutes: number) {
  if (minutes <= 1) return 'Arriving now';
  return `${minutes} min`;
}
