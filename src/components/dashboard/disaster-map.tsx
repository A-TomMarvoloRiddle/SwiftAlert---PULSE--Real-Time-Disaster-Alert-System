"use client";

import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import type { Disaster } from "@/lib/data";
import { getDisasterIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

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

export function DisasterMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const firestore = useFirestore();
  const disasterEventsQuery = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, "disasterEvents")
        : null,
    [firestore]
  );
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
      <APIProvider apiKey={apiKey}>
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
          {disasters && disasters.map((disaster) => {
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
        </Map>
      </APIProvider>
    </div>
  );
}
