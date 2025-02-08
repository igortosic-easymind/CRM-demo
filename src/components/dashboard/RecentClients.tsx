// src/components/dashboard/RecentClients.tsx
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";

export function RecentClients() {
  const router = useRouter();
  const clients = useSelector((state: RootState) => state.clients.list);

  // Get last 3 clients
  const recentClients = [...clients]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case "hot":
        return "bg-red-500 hover:bg-red-600";
      case "warm":
        return "bg-amber-500 hover:bg-amber-600";
      case "cold":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>Recent Clients</CardTitle>
            <Badge variant="default">Live</Badge>
          </div>
          <CardDescription>Latest client additions and updates</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push("/clients")}>
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentClients.map((client) => (
            <div key={client.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
              <div>
                <p className="font-medium">{client.company_name}</p>
                <p className="text-sm text-muted-foreground">
                  {client.first_name} {client.last_name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getLeadStatusColor(client.lead)}>{client.lead}</Badge>
                <p className="text-sm text-muted-foreground">{format(new Date(client.created_at), "MMM d, yyyy")}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
