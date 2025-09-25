
"use client";

import { StatsCards } from '@/components/dashboard/stats-cards';
import { DisasterMap } from '@/components/dashboard/disaster-map';
import { AlertsFeed } from '@/components/dashboard/alerts-feed';
import { DisasterCharts } from '@/components/dashboard/disaster-charts';
import { TopLocationsChart } from '@/components/dashboard/top-locations-chart';
import { DashboardFilters } from '@/components/dashboard/dashboard-filters';
import { useEffect, useState, useMemo, Suspense } from 'react';
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
        // Keep the disasters array empty on error
        setAllDisasters([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredDisasters = useMemo(() => {
    if (isLoading) return [];
    return allDisasters.filter(disaster => {
        const typeMatch = !typeFilter || typeFilter === 'all' || disaster.type === typeFilter;
        const severityMatch = !severityFilter || severityFilter === 'all' || disaster.severity === severityFilter;
        return typeMatch && severityMatch;
    });
  }, [allDisasters, typeFilter, severityFilter, isLoading]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

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
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardPageContent />
    </Suspense>
  )
}


function DashboardSkeleton() {
    return (
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-8 w-36" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
             <Skeleton className="h-full min-h-[500px] w-full" />
          </div>
          <div className="lg:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      </div>
    )
}
