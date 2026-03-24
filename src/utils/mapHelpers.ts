import L from 'leaflet';

export const createUserIcon = () => {
  return L.divIcon({
    className: 'custom-user-icon',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: #3B82F6;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 50%;
          animation: pulse-ring 2s infinite;
          background: rgba(59, 130, 246, 0.4);
        "></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

export const createAmbulanceIcon = () => {
  return L.divIcon({
    className: 'custom-ambulance-icon',
    html: `
      <div style="
        width: 44px;
        height: 44px;
        background: white;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border: 2px solid #E63946;
      ">
        🚑
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
};

export const createHospitalIcon = () => {
  return L.divIcon({
    className: 'custom-hospital-icon',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: #1D3557;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        color: white;
      ">
        H
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export async function fetchRoute(start: [number, number], end: [number, number]) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/` +
      `${start[1]},${start[0]};${end[1]},${end[0]}` +
      `?overview=full&geometries=geojson`
    const res = await fetch(url)
    const data = await res.json()
    if (data.code !== 'Ok') throw new Error('OSRM error')
    return data.routes[0].geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng])
  } catch (err) {
    console.warn('Route fetch failed, falling back to interpolation', err)
    return interpolate(start, end, 40)
  }
}

export function interpolate(start: [number, number], end: [number, number], steps: number) {
  const [lat1, lng1] = start
  const [lat2, lng2] = end
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1)
    return [lat1 + (lat2 - lat1) * t, lng1 + (lng2 - lng1) * t] as [number, number]
  })
}

export function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function reverseGeocode(lat: number, lng: number) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
    const data = await res.json()
    return data.display_name || 'Unknown Location'
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  }
}
