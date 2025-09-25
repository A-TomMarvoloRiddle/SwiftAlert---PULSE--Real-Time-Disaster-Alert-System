export type Disaster = {
  id: string;
  type: 'earthquake' | 'flood' | 'cyclone' | 'wildfire';
  location: string;
  latitude: number;
  longitude: number;
  date: string;
  magnitude?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
};

export const disasters: Disaster[] = [
  {
    id: 'eq-1',
    type: 'earthquake',
    location: 'San Francisco, USA',
    latitude: 37.7749,
    longitude: -122.4194,
    date: '2024-07-20T10:30:00Z',
    magnitude: 6.8,
    severity: 'high',
    details: 'Major earthquake reported near the Bay Area. Infrastructure damage is likely.',
  },
  {
    id: 'wf-1',
    type: 'wildfire',
    location: 'Napa Valley, USA',
    latitude: 38.5025,
    longitude: -122.2654,
    date: '2024-07-21T15:00:00Z',
    severity: 'critical',
    details: 'Fast-moving wildfire threatening vineyards and residential areas.',
  },
  {
    id: 'fl-1',
    type: 'flood',
    location: 'Miami, USA',
    latitude: 25.7617,
    longitude: -80.1918,
    date: '2024-07-21T08:00:00Z',
    severity: 'medium',
    details: 'Coastal flooding due to heavy rainfall and high tides. Several roads are closed.',
  },
  {
    id: 'cy-1',
    type: 'cyclone',
    location: 'New Orleans, USA',
    latitude: 29.9511,
    longitude: -90.0715,
    date: '2024-07-22T02:00:00Z',
    magnitude: 3, // Category 3
    severity: 'high',
    details: 'Cyclone approaching the coast with wind speeds up to 120 mph. Evacuations are recommended.',
  },
  {
    id: 'eq-2',
    type: 'earthquake',
    location: 'Tokyo, Japan',
    latitude: 35.6895,
    longitude: 139.6917,
    date: '2024-07-22T18:45:00Z',
    magnitude: 7.2,
    severity: 'critical',
    details: 'A powerful earthquake has struck the Kanto region. Tsunami warning issued.',
  },
  {
    id: 'wf-2',
    type: 'wildfire',
    location: 'Canberra, Australia',
    latitude: -35.282001,
    longitude: 149.128998,
    date: '2024-07-23T05:00:00Z',
    severity: 'high',
    details: 'Multiple bushfires are burning out of control near the capital.',
  }
];
