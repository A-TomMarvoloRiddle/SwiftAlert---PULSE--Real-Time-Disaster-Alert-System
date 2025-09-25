
"use client";

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Siren } from 'lucide-react';
import { FirebaseClientProvider, useAuth, useUser } from '@/firebase/client-provider';
import { useRouter } from 'next/navigation';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PulseLogo } from '@/components/icons';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/theme-toggle';
import { useToast } from '@/hooks/use-toast';

function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const handlePanicClick = () => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation Not Supported",
        description: "Your browser does not support location services.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        toast({
          title: "Emergency Alert Sent",
          description: `Alert with your location (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) sent to emergency contacts.`,
        });
        // In a real app, you would send this data to a server/service.
      },
      (error) => {
        toast({
          variant: "destructive",
          title: "Location Error",
          description: "Could not retrieve your location. Please ensure location services are enabled.",
        });
      }
    );
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  const handleLogout = () => {
    if (auth) {
      auth.signOut();
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar>
          <SidebarHeader className="group-data-[collapsible=icon]:justify-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <PulseLogo className="size-7 text-primary transition-all group-data-[collapsible=icon]:size-8" />
              <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">
                PULSE
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <DashboardNav />
          </SidebarContent>
          <SidebarFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-12 w-full justify-start gap-2 px-2 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                  <Avatar className="h-8 w-8">
                    {userAvatar && <AvatarImage data-ai-hint={userAvatar.imageHint} src={userAvatar.imageUrl} />}
                    <AvatarFallback>
                        {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium truncate">{user.email || 'Operator'}</p>
                    <p className="text-xs text-muted-foreground">User</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.email || 'Operator'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.uid}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="sm:hidden" />
            <div className="flex w-full justify-end items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
               <ThemeToggle />
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" className="h-8 w-8">
                        <Siren className="h-4 w-4" />
                        <span className="sr-only">Panic Button</span>
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will immediately send your current location to your emergency contacts and local authorities. Use only in a genuine emergency.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePanicClick}>Confirm & Send Alert</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
               </AlertDialog>
            </div>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <FirebaseClientProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </FirebaseClientProvider>
  )
}
