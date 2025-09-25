"use client";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Zap, Waves, Flame, Tornado } from "lucide-react";
import type { Disaster } from "@/lib/data";
import { useState, useEffect, useMemo } from "react";
import { fetchDisasterData } from "@/ai/flows/fetch-disaster-data";

export function StatsCards() {
  const [allDisasters, setAllDisasters] = useState<Disaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get('type');
  const severityFilter = searchParams.get('severity');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await fetchDisasterData();
        setAllDisasters(data);
      } catch (error) {
        console.error("Failed to fetch disaster data", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredDisasters = useMemo(() => {
    if (!allDisasters) return [];
    return allDisasters.filter(disaster => {
        const typeMatch = !typeFilter || disaster.type === typeFilter;
        const severityMatch = !severityFilter || disaster.severity === severityFilter;
        return typeMatch && severityMatch;
    });
  }, [allDisasters, typeFilter, severityFilter]);


  const stats = useMemo(() => {
    if (!filteredDisasters) return {};
    return filteredDisasters.reduce((acc, disaster) => {
        if (!acc[disaster.type]) {
          acc[disaster.type] = 0;
        }
        acc[disaster.type]++;
        return acc;
      }, {} as Record<string, number>)
  }, [filteredDisasters]);


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
