// src/app/tasks/page.tsx
"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TaskList } from "@/components/tasks/list/TaskList";

export default function TasksPage() {
  return (
    <DashboardLayout>
      <TaskList />
    </DashboardLayout>
  );
}
