export type SafeZone = {
    id: string;
    name: string;
    type: 'shelter' | 'hospital' | 'emergency-center';
    location: string;
    latitude: number;
    longitude: number;
};

export const safeZonesData: SafeZone[] = [
    {
        id: 'sz-001',
        name: 'City General Hospital',
        type: 'hospital',
        location: '123 Main St, San Francisco, CA',
        latitude: 37.7749,
        longitude: -122.4194,
    },
    {
        id: 'sz-002',
        name: 'Community Shelter North',
        type: 'shelter',
        location: '456 Oak Ave, San Francisco, CA',
        latitude: 37.7949,
        longitude: -122.4294,
    },
    {
        id: 'sz-003',
        name: 'St. Mary\'s Medical Center',
        type: 'hospital',
        location: '789 Pine St, San Francisco, CA',
        latitude: 37.7849,
        longitude: -122.4394,
    },
    {
        id: 'sz-004',
        name: 'Red Cross Emergency Center',
        type: 'emergency-center',
        location: '101 Market St, San Francisco, CA',
        latitude: 37.7936,
        longitude: -122.3944,
    },
    {
        id: 'sz-005',
        name: 'Downtown Safe Haven',
        type: 'shelter',
        location: '212 Howard St, San Francisco, CA',
        latitude: 37.7888,
        longitude: -122.398,
    },
    {
        id: 'sz-006',
        name: 'Tokyo International Clinic',
        type: 'hospital',
        location: '1-5-9, Minato-ku, Tokyo',
        latitude: 35.6585,
        longitude: 139.7454,
    },
    {
        id: 'sz-007',
        name: 'Shibuya Evacuation Center',
        type: 'shelter',
        location: '2-21-1 Shibuya, Tokyo',
        latitude: 35.6595,
        longitude: 139.703,
    },
];
