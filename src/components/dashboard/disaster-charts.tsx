"use client"

import { useSearchParams } from "next/navigation";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useEffect, useState, useMemo } from "react";
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


export function DisasterCharts() {
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
    return filteredDisasters.reduce((acc, disaster) => {
      const existing = acc.find(d => d.type === disaster.type);
      if (existing) {
          existing.count += 1;
      } else {
          acc.push({ type: disaster.type, count: 1 });
      }
      return acc;
    }, [] as { type: string, count: number }[]);
  }, [filteredDisasters]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Disaster Trends</CardTitle>
        <CardDescription>Count of active events by type.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{
          count: {
            label: "Count",
            color: "hsl(var(--primary))",
          },
        }} className="h-[250px] w-full">
           {isLoading ? <div className="flex h-full w-full items-center justify-center">Loading...</div> :
            <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="type"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis allowDecimals={false} />
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
