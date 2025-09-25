"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Disaster } from "@/lib/data";
import { getDisasterIcon } from "@/components/icons";
import { formatDistanceToNow } from "date-fns";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";

const severityVariantMap = {
  low: "default",
  medium: "default",
  high: "secondary",
  critical: "destructive",
} as const;

export function AlertsFeed() {
  const firestore = useFirestore();
  const disasterEventsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, "disasterEvents"), orderBy("timestamp", "desc"))
        : null,
    [firestore]
  );
  const { data: disasters, isLoading } = useCollection<Disaster>(disasterEventsQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Alerts</CardTitle>
        <CardDescription>Live feed of disaster events happening now.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px]">
          <div className="space-y-4">
            {isLoading && (
              <>
                <div className="flex items-start gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </>
            )}
            {disasters && disasters.map((disaster) => {
              const Icon = getDisasterIcon(disaster.type);
              return (
                <div key={disaster.id} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{disaster.location}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(disaster.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{disaster.details}</p>
                    <div className="mt-1">
                      <Badge variant={severityVariantMap[disaster.severity]} className="capitalize">{disaster.severity}</Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
