/* src/utils/mapHelpers.js */
import L from 'leaflet';

/**
 * Creates a pulsing user location marker icon.
 */
export const createUserIcon = () => {
  return L.divIcon({
    className: 'user-icon-container',
    html: `
      <div style="position:relative;width:20px;height:20px">
        <div style="
          position:absolute;inset:0;
          background:#E63946;
          border-radius:50%;
          border:3px solid white;
          box-shadow:0 2px 8px rgba(230,57,70,0.5);
          z-index:2
        "></div>
        <div style="
          position:absolute;inset:-8px;
          background:rgba(230,57,70,0.2);
          border-radius:50%;
          animation:pulse 2s infinite;
          z-index:1
        " class="user-location-pulse"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

/**
 * Creates a top-down ambulance marker icon.
 */
export const createAmbulanceIcon = () => {
  return L.divIcon({
    className: 'ambulance-icon-container',
    html: `
      <div style="
        width:36px;height:36px;
        background:#1D3557;
        border-radius:8px;
        border:2px solid white;
        box-shadow:0 3px 10px rgba(0,0,0,0.3);
        display:flex;align-items:center;justify-content:center;
        font-size:20px;
        transition: transform 0.6s linear;
      ">🚑</div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
};

/**
 * Creates a hospital marker icon.
 */
export const createHospitalIcon = (name = "Hospital") => {
  return L.divIcon({
    className: 'hospital-icon-container',
    html: `
      <div style="
        background:white;
        border:2px solid #457B9D;
        border-radius:8px;
        padding:4px 8px;
        font-size:11px;
        font-weight:600;
        color:#1D3557;
        white-space:nowrap;
        box-shadow:0 2px 8px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 4px;
      ">🏥 ${name}</div>
    `,
    iconSize: [120, 30],
    iconAnchor: [60, 15]
  });
};

/**
 * Fetches a road route from OSRM API with full steps.
 */
export const fetchOSRMRoute = async (startLat, startLng, endLat, endLng) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/` +
      `${startLng},${startLat};${endLng},${endLat}` +
      `?overview=full&geometries=geojson&steps=true`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);
    const data = await res.json();
    
    if (data.code === 'Ok' && data.routes.length > 0) {
      // Flip [lng, lat] to [lat, lng]
      return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    }
    throw new Error('OSRM Route not found');
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('OSRM Route fetch failed, using straight-line fallback:', error);
    
    // Straight-line interpolation fallback (40 points)
    const points = [];
    for (let i = 0; i <= 40; i++) {
      const lat = startLat + (endLat - startLat) * (i / 40);
      const lng = startLng + (endLng - startLng) * (i / 40);
      points.push([lat, lng]);
    }
    return points;
  }
};
