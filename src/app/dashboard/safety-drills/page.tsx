"use client";

import { useState } from "react";
import { useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDoc } from "@/firebase/firestore/use-doc";
import { Skeleton } from "@/components/ui/skeleton";

const safetyDrills = [
  {
    id: "earthquake-ready",
    title: "Earthquake Preparedness",
    description: "Learn how to 'Drop, Cover, and Hold On' and create a family emergency plan.",
    badge: {
      id: "earthquake-master",
      name: "Earthquake Master",
      icon: Shield,
    },
  },
  {
    id: "fire-escape",
    title: "Fire Escape Plan",
    description: "Create and practice a fire escape plan with your family. Know two ways out.",
    badge: {
      id: "fire-warden",
      name: "Fire Warden",
      icon: Shield,
    },
  },
  {
    id: "flood-safety",
    title: "Flood Safety",
    description: "Understand flood warnings and learn how to stay safe during a flood.",
    badge: {
      id: "flood-navigator",
      name: "Flood Navigator",
      icon: Shield,
    },
  },
];

const allBadges = safetyDrills.map(d => d.badge);

export default function SafetyDrillsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const [updatingDrill, setUpdatingDrill] = useState<string | null>(null);

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "users", user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{badges?: string[]}>(userProfileRef);

  const earnedBadgeIds = userProfile?.badges || [];

  const handleCompleteDrill = async (drillId: string, badgeId: string) => {
    if (!firestore || !user) {
      toast({
        variant: "destructive",
        title: "Not Logged In",
        description: "You must be logged in to complete a drill.",
      });
      return;
    }

    setUpdatingDrill(drillId);

    const userDocRef = doc(firestore, `users/${user.uid}`);
    try {
      await updateDoc(userDocRef, {
        badges: arrayUnion(badgeId)
      });
      toast({
        title: "Drill Complete!",
        description: `You've earned the ${allBadges.find(b => b.id === badgeId)?.name || 'new'} badge!`,
      });
    } catch (error) {
      console.error("Failed to update user profile with new badge", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save your progress. Please try again.",
      });
    } finally {
        setUpdatingDrill(null);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Badges</CardTitle>
          <CardDescription>
            Collect badges by completing safety drills.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {isProfileLoading ? (
                <div className="flex gap-4">
                    <Skeleton className="h-20 w-20" />
                    <Skeleton className="h-20 w-20" />
                    <Skeleton className="h-20 w-20" />
                </div>
            ) : (
                <div className="flex flex-wrap gap-4">
                {allBadges.map((badge) => {
                    const hasBadge = earnedBadgeIds.includes(badge.id);
                    const BadgeIcon = badge.icon;
                    return (
                        <div key={badge.id} className={`flex flex-col items-center text-center p-4 rounded-lg w-32 ${hasBadge ? 'bg-accent/20' : 'bg-muted/50 opacity-50'}`}>
                            <BadgeIcon className={`h-8 w-8 mb-2 ${hasBadge ? 'text-accent' : 'text-muted-foreground'}`} />
                            <p className="text-sm font-semibold">{badge.name}</p>
                        </div>
                    )
                })}
                </div>
            )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Available Safety Drills</CardTitle>
          <CardDescription>
            Complete these drills to prepare for emergencies and earn badges.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {safetyDrills.map((drill) => {
            const isCompleted = earnedBadgeIds.includes(drill.badge.id);
            const isUpdating = updatingDrill === drill.id;
            return (
              <Card key={drill.id}>
                <CardHeader>
                    <CardTitle className="text-lg">{drill.title}</CardTitle>
                    <CardDescription>{drill.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button
                        onClick={() => handleCompleteDrill(drill.id, drill.badge.id)}
                        disabled={isCompleted || isProfileLoading || isUpdating}
                    >
                        {isCompleted ? <><Check className="mr-2 h-4 w-4" /> Completed</> : (isUpdating ? 'Completing...' : 'Complete Drill')}
                    </Button>
                </CardFooter>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
