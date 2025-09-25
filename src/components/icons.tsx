import type { SVGProps } from "react";
import { Waves, Flame, Tornado, Zap, Home, Hospital, ShieldCheck } from 'lucide-react';

export const PulseLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 12h2.5l2.5-6 2.5 12 2.5-9 2.5 6H21" />
  </svg>
);

export const EarthquakeIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
      <path d="M16 12h2" />
      <path d="M8 12H6" />
      <path d="M14 10V8" />
      <path d="M14 16v-2" />
      <path d="m4 4 1.93 1.93" />
      <path d="M20 4-1.93 1.93" />
      <path d="m21.93 18.07-1.93-1.93" />
      <path d="M2.07 18.07 4 16.14" />
    </svg>
);


export const DisasterIcons = {
  earthquake: EarthquakeIcon,
  flood: Waves,
  cyclone: Tornado,
  wildfire: Flame,
};

export const getDisasterIcon = (type: keyof typeof DisasterIcons) => {
    return DisasterIcons[type] || Zap;
}

export const SafeZoneIcons = {
    shelter: Home,
    hospital: Hospital,
    'emergency-center': ShieldCheck,
};

export const getSafeZoneIcon = (type: keyof typeof SafeZoneIcons) => {
    return SafeZoneIcons[type] || Home;
}
