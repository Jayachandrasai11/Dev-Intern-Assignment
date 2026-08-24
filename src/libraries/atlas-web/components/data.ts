/** Sample content for showcase + composer fixtures — the Atlas scooter range
 *  and website content shapes. */

export interface AtlasModel {
  id: string;
  name: string;
  price: string;
  rangeKm: number;
  topSpeedKmh: number;
  batteryKwh: number;
  chargeTime: string;
  tag?: string;
}

export const SAMPLE_MODELS: AtlasModel[] = [
  {
    id: 'v2-pro',
    name: 'Atlas V2 Pro',
    price: '₹1,35,000',
    rangeKm: 165,
    topSpeedKmh: 90,
    batteryKwh: 3.94,
    chargeTime: '5h 55m',
    tag: 'Flagship',
  },
  {
    id: 'v2-plus',
    name: 'Atlas V2 Plus',
    price: '₹1,15,000',
    rangeKm: 142,
    topSpeedKmh: 80,
    batteryKwh: 3.44,
    chargeTime: '5h 15m',
  },
  {
    id: 'v2-lite',
    name: 'Atlas V2 Lite',
    price: '₹96,000',
    rangeKm: 94,
    topSpeedKmh: 69,
    batteryKwh: 2.2,
    chargeTime: '3h 35m',
    tag: 'New',
  },
  {
    id: 'vx2',
    name: 'Atlas VX2',
    price: '₹99,490',
    rangeKm: 112,
    topSpeedKmh: 78,
    batteryKwh: 3.4,
    chargeTime: '4h 30m',
  },
];

export interface AtlasDealer {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  distanceKm: number;
  open: boolean;
}

export const SAMPLE_DEALERS: AtlasDealer[] = [
  {
    id: 'd1',
    name: 'Atlas Hub Indiranagar',
    address: '100 Feet Road, Indiranagar',
    city: 'Bengaluru',
    phone: '+91 80 4718 3000',
    distanceKm: 2.4,
    open: true,
  },
  {
    id: 'd2',
    name: 'Atlas Experience Centre Koramangala',
    address: '80 Feet Road, 4th Block',
    city: 'Bengaluru',
    phone: '+91 80 4718 3111',
    distanceKm: 5.1,
    open: true,
  },
  {
    id: 'd3',
    name: 'Atlas Motors — Whitefield',
    address: 'ITPL Main Road, Whitefield',
    city: 'Bengaluru',
    phone: '+91 80 4718 3222',
    distanceKm: 11.8,
    open: false,
  },
];

export interface AtlasFaq {
  q: string;
  a: string;
}

export const SAMPLE_FAQS: AtlasFaq[] = [
  {
    q: 'What is the real-world range of the V2 Pro?',
    a: 'The V2 Pro delivers an IDC-certified 165 km; in mixed city riding expect roughly 120–130 km on a full charge with both batteries.',
  },
  {
    q: 'Can I charge at home?',
    a: 'Yes — the removable batteries charge from any 5A household socket. A full charge takes under 6 hours, or 65% in about 3.5 hours.',
  },
  {
    q: 'What warranty does Atlas offer?',
    a: 'Every Atlas comes with a 3-year / 30,000 km standard warranty, extendable to 5 years, and the battery is covered separately.',
  },
  {
    q: 'How does the EMI plan work?',
    a: 'Plans start around ₹2,999/month with flexible tenures from 12 to 48 months through our finance partners.',
  },
];

export interface AtlasAward {
  title: string;
  outlet: string;
  year: string;
}

export const SAMPLE_AWARDS: AtlasAward[] = [
  { title: 'EV of the Year', outlet: 'Autocar India', year: '2025' },
  { title: 'Best Electric Scooter', outlet: 'BikeWale Awards', year: '2025' },
  { title: 'Design of the Year', outlet: 'CarAndBike', year: '2024' },
  { title: 'Smart Mobility Award', outlet: 'ET Auto', year: '2024' },
];

export interface AtlasSpecRow {
  label: string;
  values: string[]; // one per model, aligned with SAMPLE_MODELS order
}

export const SAMPLE_SPECS: AtlasSpecRow[] = [
  { label: 'Certified range', values: ['165 km', '142 km', '94 km', '112 km'] },
  { label: 'Top speed', values: ['90 km/h', '80 km/h', '69 km/h', '78 km/h'] },
  { label: 'Battery', values: ['3.94 kWh', '3.44 kWh', '2.2 kWh', '3.4 kWh'] },
  { label: 'Charge time', values: ['5h 55m', '5h 15m', '3h 35m', '4h 30m'] },
  { label: 'Removable battery', values: ['Yes · 2', 'Yes · 2', 'Yes · 1', 'No'] },
];
