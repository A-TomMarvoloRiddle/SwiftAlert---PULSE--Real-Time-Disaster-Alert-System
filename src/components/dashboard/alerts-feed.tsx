import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { disasters } from "@/lib/data";
import { getDisasterIcon } from "@/components/icons";
import { formatDistanceToNow } from "date-fns";

const severityVariantMap = {
  low: "default",
  medium: "default",
  high: "secondary",
  critical: "destructive",
} as const;

export function AlertsFeed() {
  const sortedDisasters = [...disasters].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Alerts</CardTitle>
        <CardDescription>Live feed of disaster events happening now.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px]">
          <div className="space-y-4">
            {sortedDisasters.map((disaster) => {
              const Icon = getDisasterIcon(disaster.type);
              return (
                <div key={disaster.id} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{disaster.location}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(disaster.date), { addSuffix: true })}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{disaster.details}</p>
                    <div className="mt-1">
                      <Badge variant={severityVariantMap[disaster.severity]} className="capitalize">{disaster.severity}</Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
