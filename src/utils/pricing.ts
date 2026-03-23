import { haversine } from './haversine';

export type AmbulanceType = 'BLS' | 'ALS' | 'Neonatal';

interface PricingConfig {
  baseFare: number;
  perKmRate: number;
}

const PRICING_CONFIG: Record<AmbulanceType, PricingConfig> = {
  BLS: { baseFare: 800, perKmRate: 25 },
  ALS: { baseFare: 1500, perKmRate: 40 },
  Neonatal: { baseFare: 2000, perKmRate: 50 },
};

export const calculateEstimatedFare = (
  type: AmbulanceType,
  userLat: number,
  userLng: number,
  hospitalLat: number,
  hospitalLng: number
) => {
  const distance = haversine(userLat, userLng, hospitalLat, hospitalLng);
  const config = PRICING_CONFIG[type];
  const estimatedFare = config.baseFare + distance * config.perKmRate;
  
  // Return a range (±15% variance)
  const min = Math.round(estimatedFare * 0.85);
  const max = Math.round(estimatedFare * 1.15);
  
  return { min, max, base: Math.round(estimatedFare) };
};

export const getAmbulanceTypeForEmergency = (emergencyType: string): AmbulanceType => {
  switch (emergencyType) {
    case 'Cardiac':
    case 'Stroke':
    case 'Accident/Trauma':
      return 'ALS';
    case 'Maternity':
      return 'Neonatal';
    default:
      return 'BLS';
  }
};
