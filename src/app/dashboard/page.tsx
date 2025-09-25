import { StatsCards } from '@/components/dashboard/stats-cards';
import { DisasterMap } from '@/components/dashboard/disaster-map';
import { AlertsFeed } from '@/components/dashboard/alerts-feed';
import { DisasterCharts } from '@/components/dashboard/disaster-charts';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <StatsCards />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <DisasterMap />
        </div>
        <div className="lg:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8">
          <AlertsFeed />
          <DisasterCharts />
        </div>
      </div>
    </div>
  );
}
