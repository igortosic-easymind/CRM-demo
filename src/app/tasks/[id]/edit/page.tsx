// src/app/tasks/[id]/edit/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TaskForm from "@/components/tasks/form/TaskForm";
import { getTask } from "@/app/actions/tasks";
import { Task } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditTaskPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { toast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTask = async () => {
      try {
        const result = await getTask(resolvedParams.id);
        if (result.success && result.data) {
          setTask(result.data);
        } else {
          setError(result.error || "Failed to load task");
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error || "Failed to load task",
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [resolvedParams.id, toast]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-6" />
          <div className="space-y-6">
            <div className="h-40 bg-gray-200 rounded" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !task) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertDescription>{error || "Task not found"}</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Task: {task.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm mode="edit" initialData={task} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
