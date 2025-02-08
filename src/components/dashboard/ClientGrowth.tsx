// src/components/dashboard/ClientGrowth.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockChartData = [
  { name: "Jan", clients: 20 },
  { name: "Feb", clients: 25 },
  { name: "Mar", clients: 30 },
  { name: "Apr", clients: 28 },
  { name: "May", clients: 35 },
  { name: "Jun", clients: 40 },
];

export function ClientGrowth() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Client Growth</CardTitle>
            <CardDescription>Total clients over the last 6 months</CardDescription>
          </div>
          <Badge variant="outline">Demo</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="clients" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
