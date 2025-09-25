
"use client"

import { BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts"
import { useMemo } from "react";

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

interface TopLocationsChartProps {
    disasters: Disaster[];
    isLoading: boolean;
}

export function TopLocationsChart({ disasters, isLoading }: TopLocationsChartProps) {

  const chartData = useMemo(() => {
    return Object.entries(
        disasters.reduce((acc, disaster) => {
            // Simplify location name for better grouping
            const locationName = disaster.location.split(' - ')[0].split(',')[0];
            acc[locationName] = (acc[locationName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([location, count]) => ({ location, count }))
  }, [disasters]);


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
            chartData.length > 0 ? (
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
            ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  No data to display.
                </div>
            )
          }
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
