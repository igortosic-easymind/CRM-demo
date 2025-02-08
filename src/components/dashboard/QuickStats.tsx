// src/components/dashboard/QuickStats.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, Users, UserPlus, Phone, Calendar, CheckSquare, Clock } from "lucide-react";

export function QuickStats() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                <Badge variant="outline" className="text-xs">
                  Demo
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mt-2">127</h3>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                12% increase
              </p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">New Clients</p>
                <Badge variant="outline" className="text-xs">
                  Demo
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mt-2">24</h3>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                8% this month
              </p>
            </div>
            <UserPlus className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">Follow-ups Due</p>
                <Badge variant="outline" className="text-xs">
                  Demo
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mt-2">12</h3>
              <p className="text-sm text-red-600 flex items-center mt-1">
                <ArrowDownRight className="h-4 w-4 mr-1" />3 overdue
              </p>
            </div>
            <Phone className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">Meetings This Week</p>
                <Badge variant="outline" className="text-xs">
                  Demo
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mt-2">8</h3>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <Clock className="h-4 w-4 mr-1" />
                Next in 2 days
              </p>
            </div>
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">Active Tasks</p>
                <Badge variant="outline" className="text-xs">
                  Demo
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mt-2">12</h3>
              <p className="text-sm text-amber-600 flex items-center mt-1">
                <Clock className="h-4 w-4 mr-1" />5 due today
              </p>
            </div>
            <CheckSquare className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
