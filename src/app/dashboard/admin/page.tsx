
"use client";

import { GenInsightForm } from '@/components/admin/gen-insight-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Disaster } from '@/lib/data';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { fetchDisasterData } from '@/ai/flows/fetch-disaster-data';

const severityVariantMap = {
  low: "default",
  medium: "default",
  high: "secondary",
  critical: "destructive",
} as const;

export default function AdminPage() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await fetchDisasterData();
        setDisasters(data);
      } catch (error) {
        console.error("Failed to fetch disaster data", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);


  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4 lg:grid-cols-2">
        <GenInsightForm />

        <div className="grid gap-4">
             <Card>
                <CardHeader>
                    <CardTitle>System Analytics</CardTitle>
                    <CardDescription>Placeholder for detailed system analytics and charts.</CardDescription>
                </CardHeader>
                <CardContent className='flex items-center justify-center h-60 bg-muted rounded-b-lg'>
                    <p className='text-muted-foreground'>Analytics charts coming soon.</p>
                </CardContent>
            </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Manage Alerts</CardTitle>
          <CardDescription>Review, edit, or manually issue disaster alerts from the live feed.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden sm:table-cell">Severity</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                </TableRow>
              ))}
              {!isLoading && disasters?.map((disaster) => (
                <TableRow key={disaster.id}>
                  <TableCell>
                    <div className="font-medium">{disaster.location}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell capitalize">{disaster.type}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge className="text-xs capitalize" variant={severityVariantMap[disaster.severity]}>
                      {disaster.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{format(new Date(disaster.timestamp), "yyyy-MM-dd")}</TableCell>
                  <TableCell className="text-right">
                      <Button size="sm" variant="outline">Manage</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
