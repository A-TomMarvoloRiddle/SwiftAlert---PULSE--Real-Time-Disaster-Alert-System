
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
import { Skeleton } from "../ui/skeleton";
import { useMemo } from "react";

const severityVariantMap = {
  low: "default",
  medium: "default",
  high: "secondary",
  critical: "destructive",
} as const;

interface AlertsFeedProps {
    disasters: Disaster[];
    isLoading: boolean;
}

export function AlertsFeed({ disasters, isLoading }: AlertsFeedProps) {

  const sortedDisasters = useMemo(() => {
    return [...disasters].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [disasters]);

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
            {!isLoading && sortedDisasters.map((disaster) => {
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
                    <p className="text-sm text-muted-foreground truncate">{disaster.details}</p>
                    <div className="mt-1">
                      <Badge variant={severityVariantMap[disaster.severity]} className="capitalize">{disaster.severity}</Badge>
                    </div>
                  </div>
                </div>
              );
            })}
             {!isLoading && disasters.length === 0 && (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                    No active disaster events.
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
