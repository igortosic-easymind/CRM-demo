// src/app/tasks/new/page.tsx
"use client";

import TaskForm from "@/components/tasks/form/TaskForm";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NewTaskPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm mode="create" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
