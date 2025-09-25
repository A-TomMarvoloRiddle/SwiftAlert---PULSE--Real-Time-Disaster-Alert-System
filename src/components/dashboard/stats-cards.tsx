
"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Zap, Waves, Flame, Tornado } from "lucide-react";
import type { Disaster } from "@/lib/data";
import { useMemo } from "react";

interface StatsCardsProps {
  disasters: Disaster[];
  isLoading: boolean;
}

export function StatsCards({ disasters, isLoading }: StatsCardsProps) {
  const stats = useMemo(() => {
    return disasters.reduce((acc, disaster) => {
        if (!acc[disaster.type]) {
          acc[disaster.type] = 0;
        }
        acc[disaster.type]++;
        return acc;
      }, {} as Record<string, number>)
  }, [disasters]);

  const StatCard = ({ title, icon, value }: { title: string; icon: React.ReactNode; value: number }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="text-2xl font-bold">-</div>
        ) : (
            <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">Active events from live feed</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Earthquakes" icon={<Zap className="h-4 w-4 text-muted-foreground" />} value={stats.earthquake || 0} />
      <StatCard title="Floods" icon={<Waves className="h-4 w-4 text-muted-foreground" />} value={stats.flood || 0} />
      <StatCard title="Wildfires" icon={<Flame className="h-4 w-4 text-muted-foreground" />} value={stats.wildfire || 0} />
      <StatCard title="Cyclones" icon={<Tornado className="h-4 w-4 text-muted-foreground" />} value={stats.cyclone || 0} />
    </div>
  );
}
