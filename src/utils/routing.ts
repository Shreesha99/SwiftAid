/**
 * Fetches a road route from OSRM API.
 */
export const fetchRoute = async (
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
) => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
    );
    const data = await response.json();
    if (data.code === 'Ok' && data.routes.length > 0) {
      return data.routes[0].geometry.coordinates.map((coord: [number, number]) => [
        coord[1],
        coord[0],
      ]); // Convert [lng, lat] to [lat, lng]
    }
    return null;
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
};

/**
 * Generates a random starting point for the ambulance ~3km away.
 */
export const generateRandomAmbulanceStart = (userLat: number, userLng: number) => {
  const radius = 0.027; // Roughly 3km in degrees
  const angle = Math.random() * Math.PI * 2;
  return {
    lat: userLat + Math.cos(angle) * radius,
    lng: userLng + Math.sin(angle) * radius,
  };
};
