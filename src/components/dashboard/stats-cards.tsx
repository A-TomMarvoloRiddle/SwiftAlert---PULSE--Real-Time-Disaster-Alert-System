"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Zap, Waves, Flame, Tornado } from "lucide-react";
import type { Disaster } from "@/lib/data";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

export function StatsCards() {
  const firestore = useFirestore();
  const disasterEventsQuery = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, "disasterEvents")
        : null,
    [firestore]
  );
  const { data: disasters } = useCollection<Disaster>(disasterEventsQuery);

  const stats = disasters
    ? disasters.reduce((acc, disaster) => {
        if (!acc[disaster.type]) {
          acc[disaster.type] = 0;
        }
        acc[disaster.type]++;
        return acc;
      }, {} as Record<string, number>)
    : {};

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Earthquakes</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.earthquake || 0}</div>
          <p className="text-xs text-muted-foreground">Active major events</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Floods</CardTitle>
          <Waves className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.flood || 0}</div>
          <p className="text-xs text-muted-foreground">Areas with active warnings</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wildfires</CardTitle>
          <Flame className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.wildfire || 0}</div>
          <p className="text-xs text-muted-foreground">Out-of-control fires</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cyclones</CardTitle>
          <Tornado className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.cyclone || 0}</div>
          <p className="text-xs text-muted-foreground">Active tropical cyclones</p>
        </CardContent>
      </Card>
    </div>
  );
}
