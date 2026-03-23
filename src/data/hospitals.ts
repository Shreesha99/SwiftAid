/* src/data/hospitals.ts */

export interface Hospital {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  tags: string[];
  specialities: string[];
}

export const hospitals: Hospital[] = [
  {
    id: 'h1',
    name: 'Manipal Hospital, Old Airport Road',
    address: '98, HAL Old Airport Rd, Kodihalli, Bengaluru',
    lat: 12.9592,
    lng: 77.6444,
    phone: '080-2502-4444',
    tags: ['cardiac', 'trauma', 'stroke', 'maternity'],
    specialities: ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency Care']
  },
  {
    id: 'h2',
    name: 'St. John\'s Medical College Hospital',
    address: 'Sarjapur Main Rd, John Nagar, Koramangala, Bengaluru',
    lat: 12.9279,
    lng: 77.6191,
    phone: '080-2206-5000',
    tags: ['trauma', 'breathing', 'general'],
    specialities: ['Trauma Care', 'Pulmonology', 'General Medicine']
  },
  {
    id: 'h3',
    name: 'Fortis Hospital, Bannerghatta Road',
    address: '154, 9, Bannerghatta Main Rd, Opposite IIM, Bengaluru',
    lat: 12.8950,
    lng: 77.5980,
    phone: '080-6621-4444',
    tags: ['cardiac', 'stroke', 'maternity'],
    specialities: ['Cardiology', 'Neurology', 'Obstetrics']
  },
  {
    id: 'h4',
    name: 'Apollo Hospitals, Jayanagar',
    address: '212, 2nd Main Rd, Jayanagar 3rd Block, Bengaluru',
    lat: 12.9300,
    lng: 77.5850,
    phone: '080-4668-8000',
    tags: ['cardiac', 'trauma', 'general'],
    specialities: ['Cardiology', 'Orthopedics', 'Emergency Care']
  },
  {
    id: 'h5',
    name: 'Cloudnine Hospital, Old Airport Road',
    address: '15, HAL Old Airport Rd, Murugeshpalya, Bengaluru',
    lat: 12.9560,
    lng: 77.6530,
    phone: '1860-500-9999',
    tags: ['maternity', 'pediatric'],
    specialities: ['Obstetrics', 'Pediatrics', 'Neonatology']
  },
  {
    id: 'h6',
    name: 'Narayana Health City, Bommasandra',
    address: '258/A, Bommasandra Industrial Area, Bengaluru',
    lat: 12.8120,
    lng: 77.6930,
    phone: '080-7122-2222',
    tags: ['cardiac', 'trauma', 'stroke'],
    specialities: ['Cardiology', 'Neurology', 'Trauma Care']
  }
];
