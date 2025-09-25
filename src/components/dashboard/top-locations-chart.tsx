"use client"

import { useSearchParams } from "next/navigation";
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
import type { Disaster } from "@/lib/data"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, QueryConstraint } from "firebase/firestore";


export function TopLocationsChart() {
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get('type');
  const severityFilter = searchParams.get('severity');

  const disasterEventsQuery = useMemoFirebase(() => {
    if (!firestore) return null;

    const constraints: QueryConstraint[] = [];
    if (typeFilter) {
      constraints.push(where('type', '==', typeFilter));
    }
    if (severityFilter) {
      constraints.push(where('severity', '==', severityFilter));
    }

    if (constraints.length > 0) {
        return query(collection(firestore, "disasterEvents"), ...constraints);
    }
    return collection(firestore, "disasterEvents");
  }, [firestore, typeFilter, severityFilter]);

  const { data: disasters } = useCollection<Disaster>(disasterEventsQuery);

  const chartData = disasters
  ? Object.entries(
        disasters.reduce((acc, disaster) => {
            acc[disaster.location] = (acc[disaster.location] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([location, count]) => ({ location, count }))
  : [];


  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Affected Locations</CardTitle>
        <CardDescription>Most frequent disaster locations.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{
          count: {
            label: "Count",
            color: "hsl(var(--accent))",
          },
        }} className="h-[250px] w-full">
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
                />
                <XAxis dataKey="count" type="number" />
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
