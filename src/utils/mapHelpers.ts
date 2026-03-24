import L from 'leaflet';

export const ROTARY_LOGO_URL = "https://www.rotary.org/sites/default/files/styles/w_600/public/rotary-logo-color-en.png";

export const createUserIcon = () => {
  return L.divIcon({
    className: 'custom-user-icon',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: #3B82F6;
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(0,0,0,0.2);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          top: -4px; left: -4px; right: -4px; bottom: -4px;
          border-radius: 50%;
          animation: pulse-ring 2s infinite;
          background: rgba(59, 130, 246, 0.2);
        "></div>
        <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export const createAmbulanceIcon = (bearing = 0) => {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:48px; height:48px;
        display:flex; align-items:center; justify-content:center;
        transform: rotate(${bearing}deg);
        filter: drop-shadow(0 3px 6px rgba(0,0,0,0.25));
      ">
        <svg viewBox="0 0 64 64" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
          <!-- Ambulance body (top-down view) -->
          <rect x="12" y="8" width="40" height="48" rx="6" fill="#ffffff" stroke="#1D3557" stroke-width="3"/>
          <!-- Red cross on roof -->
          <rect x="29" y="16" width="6" height="18" rx="2" fill="#E63946"/>
          <rect x="22" y="22" width="20" height="6" rx="2" fill="#E63946"/>
          <!-- Front windshield -->
          <rect x="18" y="10" width="28" height="10" rx="3" fill="#93C5FD" opacity="0.8"/>
          <!-- Rear -->
          <rect x="18" y="44" width="28" height="8" rx="3" fill="#BFDBFE" opacity="0.6"/>
          <!-- Side details -->
          <rect x="12" y="24" width="4" height="16" rx="2" fill="#BFDBFE" opacity="0.5"/>
          <rect x="48" y="24" width="4" height="16" rx="2" fill="#BFDBFE" opacity="0.5"/>
          <!-- Wheels -->
          <rect x="8" y="12" width="8" height="10" rx="3" fill="#374151"/>
          <rect x="48" y="12" width="8" height="10" rx="3" fill="#374151"/>
          <rect x="8" y="42" width="8" height="10" rx="3" fill="#374151"/>
          <rect x="48" y="42" width="8" height="10" rx="3" fill="#374151"/>
          <!-- Direction indicator (small arrow at front) -->
          <polygon points="32,2 26,10 38,10" fill="#E63946"/>
        </svg>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

export const createPulseIcon = () => {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: 60px; height: 60px;
        border-radius: 50%;
        background: rgba(29,53,87,0.15);
        animation: pulse-ring 1.5s ease-out infinite;
        margin: -8px;
      "></div>
    `,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
  });
};

export function getBearing(start: [number, number], end: [number, number]) {
  const [lat1, lng1] = start;
  const [lat2, lng2] = end;
  const dLng = (lng2 - lng1) * Math.PI / 180
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const y = Math.sin(dLng) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(dLng)
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360
}

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
