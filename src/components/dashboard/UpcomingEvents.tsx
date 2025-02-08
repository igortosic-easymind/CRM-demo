// src/components/dashboard/UpcomingEvents.tsx
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function UpcomingEvents() {
  const router = useRouter();
  const events = useSelector((state: RootState) => state.calendar.events);

  // Get next 3 upcoming events
  const upcomingEvents = [...events]
    .filter((event) => new Date(event.start_date) > new Date())
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Upcoming Events</CardTitle>
              <Badge variant="default">Live</Badge>
            </div>
            <CardDescription>Your schedule for the next 7 days</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/calendar")}>
            View Calendar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(event.start_date), "MMM d")} at {format(new Date(event.start_date), "h:mm a")}
                </p>
              </div>
              <Badge variant="outline">{event.type}</Badge>
            </div>
          ))}
          {upcomingEvents.length === 0 && <p className="text-sm text-muted-foreground">No upcoming events</p>}
        </div>
      </CardContent>
    </Card>
  );
}
