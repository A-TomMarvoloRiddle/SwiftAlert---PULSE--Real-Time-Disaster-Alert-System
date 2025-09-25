"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

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
import { disasters } from "@/lib/data"

const chartData = disasters.reduce((acc, disaster) => {
    const existing = acc.find(d => d.type === disaster.type);
    if (existing) {
        existing.count += 1;
    } else {
        acc.push({ type: disaster.type, count: 1 });
    }
    return acc;
}, [] as { type: string, count: number }[]);


export function DisasterCharts() {
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
                <YAxis />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
