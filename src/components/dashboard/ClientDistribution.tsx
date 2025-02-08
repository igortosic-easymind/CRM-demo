// src/components/dashboard/ClientDistribution.tsx
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ClientDistribution() {
  const clients = useSelector((state: RootState) => state.clients.list);

  // Calculate distribution with percentages
  const total = clients.length;
  const distribution = clients.reduce((acc, client) => {
    const status = client.lead;
    acc[status] = {
      count: (acc[status]?.count || 0) + 1,
      percentage: 0, // Will be calculated after counting
    };
    return acc;
  }, {} as Record<string, { count: number; percentage: number }>);

  // Calculate percentages
  Object.keys(distribution).forEach((status) => {
    distribution[status].percentage = total ? Math.round((distribution[status].count / total) * 100) : 0;
  });

  // Ensure all statuses exist even if zero
  const clientDistribution = {
    hot: distribution.hot || { count: 0, percentage: 0 },
    warm: distribution.warm || { count: 0, percentage: 0 },
    cold: distribution.cold || { count: 0, percentage: 0 },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Client Distribution</CardTitle>
          <Badge variant="default">Live</Badge>
        </div>
        <CardDescription>Breakdown by lead status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Hot Leads */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-500">Hot</Badge>
              <span>Hot Leads</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold">{clientDistribution.hot.count}</span>
              <div className="flex flex-col items-end">
                <span className="text-sm text-muted-foreground">{clientDistribution.hot.percentage}%</span>
                <div className="w-24 h-1 bg-gray-100 rounded-full mt-1">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${clientDistribution.hot.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Warm Leads */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500">Warm</Badge>
              <span>Warm Leads</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold">{clientDistribution.warm.count}</span>
              <div className="flex flex-col items-end">
                <span className="text-sm text-muted-foreground">{clientDistribution.warm.percentage}%</span>
                <div className="w-24 h-1 bg-gray-100 rounded-full mt-1">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${clientDistribution.warm.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cold Leads */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500">Cold</Badge>
              <span>Cold Leads</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold">{clientDistribution.cold.count}</span>
              <div className="flex flex-col items-end">
                <span className="text-sm text-muted-foreground">{clientDistribution.cold.percentage}%</span>
                <div className="w-24 h-1 bg-gray-100 rounded-full mt-1">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${clientDistribution.cold.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
