
"use client"

import { useMemo } from "react";
import { Bar, BarChart, Pie, PieChart, Cell } from "recharts"

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
import { Skeleton } from "../ui/skeleton";

interface SystemAnalyticsProps {
    disasters: Disaster[];
    isLoading: boolean;
}

const severityColors = {
    low: "hsl(var(--chart-1))",
    medium: "hsl(var(--chart-2))",
    high: "hsl(var(--chart-3))",
    critical: "hsl(var(--chart-4))",
};


export function SystemAnalytics({ disasters, isLoading }: SystemAnalyticsProps) {

  const severityData = useMemo(() => {
    return Object.entries(disasters.reduce((acc, disaster) => {
        acc[disaster.severity] = (acc[disaster.severity] || 0) + 1;
        return acc;
    }, {} as Record<string, number>)).map(([name, value]) => ({ name, value, fill: severityColors[name as keyof typeof severityColors] }));
  }, [disasters]);

  const typeData = useMemo(() => {
    return Object.entries(disasters.reduce((acc, disaster) => {
        acc[disaster.type] = (acc[disaster.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>)).map(([type, count]) => ({ type, count }));
  }, [disasters]);

  if (isLoading) {
      return (
          <Card>
              <CardHeader>
                  <CardTitle>System Analytics</CardTitle>
                  <CardDescription>Overview of active disaster events.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="size-32 rounded-full" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-32 w-full" />
                  </div>
              </CardContent>
          </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Analytics</CardTitle>
        <CardDescription>Overview of active disaster events.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
            <p className="font-medium text-sm mb-2">Events by Severity</p>
             <ChartContainer config={{}} className="mx-auto aspect-square h-[150px]">
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie data={severityData} dataKey="value" nameKey="name" innerRadius={40} strokeWidth={5}>
                         {severityData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                        ))}
                    </Pie>
                </PieChart>
            </ChartContainer>
        </div>
        <div className="flex flex-col items-center">
            <p className="font-medium text-sm mb-2">Events by Type</p>
             <ChartContainer config={{
                count: {
                    label: "Count",
                    color: "hsl(var(--primary))",
                },
             }} className="h-[150px] w-full">
                <BarChart accessibilityLayer data={typeData} margin={{ top: 0, right: 0, left: 0, bottom: 0}}>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="count" fill="var(--color-count)" radius={3} />
                </BarChart>
            </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
