import { Timestamp } from "firebase/firestore";

export type Disaster = {
  id: string;
  type: 'earthquake' | 'flood' | 'cyclone' | 'wildfire';
  location: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  magnitude?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
};
