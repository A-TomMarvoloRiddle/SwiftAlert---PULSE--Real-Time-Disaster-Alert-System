
"use client";

import { GenInsightForm } from '@/components/admin/gen-insight-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Disaster } from '@/lib/data';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { fetchDisasterData } from '@/ai/flows/fetch-disaster-data';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { SystemAnalytics } from '@/components/admin/system-analytics';
import { translateText } from '@/ai/flows/translate-text';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const severityVariantMap = {
  low: "default",
  medium: "accent",
  high: "accent",
  critical: "destructive",
} as const;

export default function AdminPage() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await fetchDisasterData();
        setDisasters(data);
      } catch (error) {
        console.error("Failed to fetch disaster data", error);
        setDisasters([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSendAlert = async (disaster: Disaster) => {
    if (!firestore || !user) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "You must be logged in to send alerts.",
        });
        return;
    }

    const alertsCollection = collection(firestore, `users/${user.uid}/alerts`);
    const originalMessage = `New ${disaster.type} alert in ${disaster.location}. Severity: ${disaster.severity}.`;
    
    // For demonstration, we'll translate to Spanish. In a real app, this would be the user's preference.
    const targetLanguage = 'Spanish'; 
    let translatedMessage = originalMessage;

    try {
        const translationResult = await translateText({ text: originalMessage, language: targetLanguage });
        translatedMessage = translationResult.translatedText;
        toast({
            title: `Alert Translated to ${targetLanguage}`,
            description: "The alert message has been translated.",
        });
    } catch (e) {
        console.error("Translation failed", e);
        toast({
            variant: "destructive",
            title: "Translation Failed",
            description: "Could not translate the alert. Sending in English.",
        });
    }


    const newAlert = {
        userId: user.uid,
        disasterEventId: disaster.id,
        message: translatedMessage,
        timestamp: new Date().toISOString(),
        channel: "dashboard", // Simulating a dashboard-triggered alert
    };
    
    addDoc(alertsCollection, newAlert).catch(error => {
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: alertsCollection.path,
            operation: 'create',
            requestResourceData: newAlert,
          })
        )
      });

    toast({
        title: "Alert Sent",
        description: `An alert for the ${disaster.type} in ${disaster.location} has been created.`,
    });
  };

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4 lg:grid-cols-2">
        <GenInsightForm />
        <div className="grid gap-4 auto-rows-max">
            <SystemAnalytics disasters={disasters} isLoading={isLoading} />
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
                 <TableRow key={i} className="animate-pulse">
                    <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-28 ml-auto" /></TableCell>
                 </TableRow>
              ))}
              {!isLoading && disasters.map((disaster) => (
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
                      <Button size="sm" variant="outline" onClick={() => handleSendAlert(disaster)}>Send Alert</Button>
                  </TableCell>
                </TableRow>
              ))}
               {!isLoading && disasters.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                        No active disasters to display.
                    </TableCell>
                </TableRow>
            )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
