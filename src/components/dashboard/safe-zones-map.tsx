"use client";

import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import type { SafeZone } from "@/lib/safe-zones-data";
import { getSafeZoneIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect } from 'react';

const typeConfig = {
  hospital: {
    bg: "bg-red-500",
    icon: "text-white",
  },
  shelter: {
    bg: "bg-green-500",
    icon: "text-white",
  },
  'emergency-center': {
    bg: "bg-blue-500",
    icon: "text-white",
  },
};

function Markers({ safeZones }: { safeZones: SafeZone[] }) {
    const map = useMap();
    useEffect(() => {
        if(map && safeZones && safeZones.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            safeZones.forEach(d => bounds.extend({lat: d.latitude, lng: d.longitude}));
            map.fitBounds(bounds, 100);
        } else if (map) {
            map.setCenter({ lat: 37.7749, lng: -122.4194 });
            map.setZoom(12);
        }
    }, [map, safeZones]);

    return (
        <>
        {safeZones.map((zone) => {
            const Icon = getSafeZoneIcon(zone.type);
            const config = typeConfig[zone.type];
            
            return (
              <Tooltip key={zone.id}>
                <TooltipTrigger asChild>
                  <AdvancedMarker
                    position={{ lat: zone.latitude, lng: zone.longitude }}
                  >
                     <div className={cn("relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-card shadow-lg", config.bg)}>
                          <Icon className={cn("h-4 w-4", config.icon)} />
                      </div>
                  </AdvancedMarker>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-bold">{zone.name}</p>
                  <p className="capitalize">{zone.type}</p>
                  <p className="text-sm text-muted-foreground">{zone.location}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </>
    )
}

interface SafeZonesMapProps {
    safeZones: SafeZone[];
}

export function SafeZonesMap({ safeZones }: SafeZonesMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return (
      <div className="flex h-full min-h-[500px] w-full items-center justify-center rounded-lg bg-muted">
        <p className="text-center text-muted-foreground">
          Google Maps API Key is missing. <br/> Please add it to your .env file.
        </p>
      </div>
    );
  }

  const center = { lat: 37.7749, lng: -122.4194 };

  return (
    <div className="h-full min-h-[500px] w-full overflow-hidden rounded-lg border">
      <APIProvider apiKey={apiKey} libraries={['visualization']}>
        <Map
          defaultCenter={center}
          defaultZoom={12}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          mapId={"a3bbf3a8f4b4f4c"}
          styles={[
            { stylers: [{ "saturation": -100 }, { "gamma": 1 }] },
            { elementType: "labels.text.stroke", stylers: [{ visibility: "off" }] },
            { featureType: "poi.business", stylers: [{ visibility: "off" }] },
            { featureType: "transit", stylers: [{ visibility: "off" }] },
            { featureType: "road", stylers: [{ visibility: "off" }] },
            { featureType: "water", stylers: [{ color: "hsl(var(--primary) / 0.2)" }] },
          ]}
        >
          <Markers safeZones={safeZones} />
        </Map>
      </APIProvider>
    </div>
  );
}
