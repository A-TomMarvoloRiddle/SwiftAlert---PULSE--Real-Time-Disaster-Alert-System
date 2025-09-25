
"use client";

import { StatsCards } from '@/components/dashboard/stats-cards';
import { DisasterMap } from '@/components/dashboard/disaster-map';
import { AlertsFeed } from '@/components/dashboard/alerts-feed';
import { DisasterCharts } from '@/components/dashboard/disaster-charts';
import { TopLocationsChart } from '@/components/dashboard/top-locations-chart';
import { DashboardFilters } from '@/components/dashboard/dashboard-filters';
import { useEffect, useState, useMemo } from 'react';
import { fetchDisasterData } from '@/ai/flows/fetch-disaster-data';
import type { Disaster } from '@/lib/data';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardPageContent() {
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
    if (isLoading) return [];
    return allDisasters.filter(disaster => {
        const typeMatch = !typeFilter || disaster.type === typeFilter;
        const severityMatch = !severityFilter || disaster.severity === severityFilter;
        return typeMatch && severityMatch;
    });
  }, [allDisasters, typeFilter, severityFilter, isLoading]);

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <DashboardFilters />
      </div>
      <StatsCards disasters={filteredDisasters} isLoading={isLoading} />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <DisasterMap disasters={filteredDisasters} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8">
          <AlertsFeed disasters={filteredDisasters} isLoading={isLoading} />
          <DisasterCharts disasters={filteredDisasters} isLoading={isLoading} />
          <TopLocationsChart disasters={filteredDisasters} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}


export default function DashboardPage() {
  return (
    // Use a suspense boundary if you want to show a loading state for the whole page
    // For now, we let each component handle its loading state.
    <DashboardPageContent />
  )
}
