"use client"

import { useSearchParams } from "next/navigation";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useMemo, useState, useEffect } from "react";
import { fetchDisasterData } from "@/ai/flows/fetch-disaster-data";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { Disaster } from "@/lib/data"


export function TopLocationsChart() {
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
    return allDisasters.filter(disaster => {
        const typeMatch = !typeFilter || disaster.type === typeFilter;
        const severityMatch = !severityFilter || disaster.severity === severityFilter;
        return typeMatch && severityMatch;
    });
  }, [allDisasters, typeFilter, severityFilter]);

  const chartData = useMemo(() => {
    return Object.entries(
        filteredDisasters.reduce((acc, disaster) => {
            // Simplify location name for better grouping
            const locationName = disaster.location.split(' - ')[0].split(',')[0];
            acc[locationName] = (acc[locationName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([location, count]) => ({ location, count }))
  }, [filteredDisasters]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Affected Locations</CardTitle>
        <CardDescription>Most frequent disaster locations from live feed.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{
          count: {
            label: "Count",
            color: "hsl(var(--accent))",
          },
        }} className="h-[250px] w-full">
            {isLoading ? <div className="flex h-full w-full items-center justify-center">Loading...</div> :
            <BarChart
                layout="vertical"
                accessibilityLayer
                data={chartData}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                }}
            >
                <CartesianGrid horizontal={false} />
                <YAxis
                    dataKey="location"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    width={80}
                    tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                />
                <XAxis dataKey="count" type="number" allowDecimals={false}/>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
            }
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
