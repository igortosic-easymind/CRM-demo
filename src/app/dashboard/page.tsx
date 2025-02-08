// src/app/dashboard/page.tsx
"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { ClientGrowth } from "@/components/dashboard/ClientGrowth";
import { RecentClients } from "@/components/dashboard/RecentClients";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { ClientDistribution } from "@/components/dashboard/ClientDistribution";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Quick Stats Section */}
        <QuickStats />

        {/* Charts and Tables Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ClientGrowth />
          <RecentClients />
        </div>

        {/* Bottom Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <UpcomingEvents />
          <ClientDistribution />
        </div>
      </div>
    </DashboardLayout>
  );
}
