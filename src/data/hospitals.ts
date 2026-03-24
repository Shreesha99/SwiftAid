export interface Hospital {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  specialities: string[];
  tags: string[];
}

export const hospitals: Hospital[] = [
  {
    id: 'h1',
    name: 'Manipal Hospital',
    lat: 12.9592,
    lng: 77.6444,
    address: '98, HAL Old Airport Rd, Kodihalli, Bengaluru',
    phone: '080 2222 1111',
    specialities: ['Cardiac', 'Trauma', 'General'],
    tags: ['Cardiac', '24/7', 'ICU']
  },
  {
    id: 'h2',
    name: 'St. John\'s Medical College',
    lat: 12.9344,
    lng: 77.6192,
    address: 'Sarjapur Main Rd, John Nagar, Koramangala, Bengaluru',
    phone: '080 2206 5000',
    specialities: ['Trauma', 'General', 'Pediatric'],
    tags: ['Trauma', 'Govt-Aided', 'Emergency']
  },
  {
    id: 'h3',
    name: 'Fortis Hospital',
    lat: 12.8944,
    lng: 77.5989,
    address: '154, 9, Bannerghatta Main Rd, Sahyadri Layout, Panduranga Nagar, Bengaluru',
    phone: '096633 67253',
    specialities: ['General', 'Cardiac', 'Neuro'],
    tags: ['General', 'Neuro', 'ICU']
  },
  {
    id: 'h4',
    name: 'Apollo Hospitals',
    lat: 12.8962,
    lng: 77.5994,
    address: '154, 11, Bannerghatta Main Rd, Opp. IIM, Bengaluru',
    phone: '080 2630 4050',
    specialities: ['Cardiac', 'Trauma', 'General'],
    tags: ['Cardiac', 'Emergency', '24/7']
  }
];
