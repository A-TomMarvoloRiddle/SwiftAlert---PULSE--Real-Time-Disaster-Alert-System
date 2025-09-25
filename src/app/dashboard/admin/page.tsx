
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
import { seedDisasters } from '@/lib/seed';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const severityVariantMap = {
  low: "default",
  medium: "default",
  high: "secondary",
  critical: "destructive",
} as const;

export default function AdminPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  
  const disasterEventsQuery = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, "disasterEvents")
        : null,
    [firestore]
  );
  const { data: disasters } = useCollection<Disaster>(disasterEventsQuery);

  async function handleSeedDatabase() {
    if (!firestore) return;
    setIsSeeding(true);
    
    seedDisasters(firestore)
      .then(() => {
        toast({
          title: "Database Seeded",
          description: "Sample disaster data has been added to Firestore.",
        });
      })
      .catch((error) => {
        // The contextual error is thrown globally by the FirebaseErrorListener.
        // We only need to show a generic message to the user here.
        toast({
          variant: "destructive",
          title: "Error Seeding Database",
          description: "Could not add sample data. Check console for details.",
        });
        console.error("Seeding failed:", error); // Optional: log for local debugging
      })
      .finally(() => {
        setIsSeeding(false);
      });
  }

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4 lg:grid-cols-2">
        <GenInsightForm />

        <div className="grid gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Database Tools</CardTitle>
                    <CardDescription>Manage your Firestore database.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSeedDatabase} disabled={isSeeding}>
                      {isSeeding ? 'Seeding...' : 'Seed Database'}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                        Click to populate the database with sample disaster events.
                    </p>
                </CardContent>
            </Card>
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
          <CardDescription>Review, edit, or manually issue disaster alerts.</CardDescription>
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
              {disasters?.map((disaster) => (
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
