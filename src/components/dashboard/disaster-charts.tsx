
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

interface DisasterChartsProps {
  disasters: Disaster[];
  isLoading: boolean;
}

export function DisasterCharts({ disasters, isLoading }: DisasterChartsProps) {
  
  const chartData = useMemo(() => {
    return disasters.reduce((acc, disaster) => {
      const existing = acc.find(d => d.type === disaster.type);
      if (existing) {
          existing.count += 1;
      } else {
          acc.push({ type: disaster.type, count: 1 });
      }
      return acc;
    }, [] as { type: string, count: number }[]);
  }, [disasters]);


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
           chartData.length > 0 ? (
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
