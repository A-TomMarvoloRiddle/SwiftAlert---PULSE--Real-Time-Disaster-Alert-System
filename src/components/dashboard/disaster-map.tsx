"use client";

import { useSearchParams } from 'next/navigation';
import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import type { Disaster } from "@/lib/data";
import { getDisasterIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, QueryConstraint } from "firebase/firestore";
import { useEffect, useMemo } from 'react';

const severityConfig = {
  low: {
    bg: "bg-secondary",
    icon: "text-secondary-foreground",
    ping: "bg-gray-400",
  },
  medium: {
    bg: "bg-primary/80",
    icon: "text-primary-foreground",
    ping: "bg-primary/80"
  },
  high: {
    bg: "bg-accent",
    icon: "text-accent-foreground",
    ping: "bg-accent"
  },
  critical: {
    bg: "bg-destructive",
    icon: "text-destructive-foreground",
    ping: "bg-destructive"
  },
};

function Markers({ disasters }: { disasters: Disaster[] }) {
    const map = useMap();
    useEffect(() => {
        if(map && disasters && disasters.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            disasters.forEach(d => bounds.extend({lat: d.latitude, lng: d.longitude}));
            map.fitBounds(bounds);
        }
    }, [map, disasters]);


    return (
        <>
        {disasters.map((disaster) => {
            const Icon = getDisasterIcon(disaster.type);
            const config = severityConfig[disaster.severity];
            
            return (
              <Tooltip key={disaster.id}>
                <TooltipTrigger asChild>
                  <AdvancedMarker
                    position={{ lat: disaster.latitude, lng: disaster.longitude }}
                  >
                     <div className="relative">
                      <div className={cn("relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-card shadow-lg", config.bg)}>
                          <Icon className={cn("h-4 w-4", config.icon)} />
                      </div>
                      <span className={cn("animate-ping absolute top-0 inline-flex h-full w-full rounded-full opacity-75", config.ping)}></span>
                    </div>
                  </AdvancedMarker>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-bold">{disaster.location}</p>
                  <p className="capitalize">{disaster.type}</p>
                  <p className="capitalize text-sm text-muted-foreground">{disaster.severity} severity</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </>
    )
}

function Heatmap({ disasters }: { disasters: Disaster[] }) {
  const map = useMap();
  const heatmapData = useMemo(() => {
    if (!disasters) return [];
    return disasters.map(d => new google.maps.LatLng(d.latitude, d.longitude));
  }, [disasters]);

  useEffect(() => {
    if (!map) return;
    
    // Check if visualization library is available
    if (!google.maps.visualization) {
      console.error("Google Maps visualization library not loaded.");
      return;
    }

    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: map,
    });
    
    heatmap.set('radius', 20);

    return () => {
      heatmap.setMap(null);
    };
  }, [map, heatmapData]);

  return null;
}

export function DisasterMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get('type');
  const severityFilter = searchParams.get('severity');

  const disasterEventsQuery = useMemoFirebase(() => {
    if (!firestore) return null;

    const constraints: QueryConstraint[] = [];
    if (typeFilter) {
      constraints.push(where('type', '==', typeFilter));
    }
    if (severityFilter) {
      constraints.push(where('severity', '==', severityFilter));
    }

    if (constraints.length > 0) {
        return query(collection(firestore, "disasterEvents"), ...constraints);
    }
    return collection(firestore, "disasterEvents");
  }, [firestore, typeFilter, severityFilter]);

  const { data: disasters } = useCollection<Disaster>(disasterEventsQuery);

  if (!apiKey) {
    return (
      <div className="flex h-full min-h-[500px] w-full items-center justify-center rounded-lg bg-muted">
        <p className="text-center text-muted-foreground">
          Google Maps API Key is missing. <br/> Please add it to your .env.local file.
        </p>
      </div>
    );
  }

  const center = { lat: 20, lng: 0 };

  return (
    <div className="h-full min-h-[500px] w-full overflow-hidden rounded-lg border">
      <APIProvider apiKey={apiKey} libraries={['visualization']}>
        <Map
          defaultCenter={center}
          defaultZoom={2}
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
          {disasters && <Markers disasters={disasters} />}
          {disasters && <Heatmap disasters={disasters} />}
        </Map>
      </APIProvider>
    </div>
  );
}
