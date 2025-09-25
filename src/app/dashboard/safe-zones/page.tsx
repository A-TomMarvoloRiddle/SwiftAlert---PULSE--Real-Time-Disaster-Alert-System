"use client";

import { SafeZonesMap } from "@/components/dashboard/safe-zones-map";
import { safeZonesData } from "@/lib/safe-zones-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { List } from "lucide-react";
import { getSafeZoneIcon } from "@/components/icons";

export default function SafeZonesPage() {
  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <SafeZonesMap safeZones={safeZonesData} />
      </div>
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Safe Zones List</CardTitle>
            <CardDescription>
              A list of nearby shelters, hospitals, and emergency centers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {safeZonesData.map((zone) => {
                const Icon = getSafeZoneIcon(zone.type);
                return (
                    <div key={zone.id} className="flex items-start gap-4">
                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{zone.name}</p>
                            <p className="text-sm text-muted-foreground capitalize">{zone.type}</p>
                            <p className="text-sm text-muted-foreground">{zone.location}</p>
                        </div>
                    </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
