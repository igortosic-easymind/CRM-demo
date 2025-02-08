// src/app/tasks/[id]/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { Pencil, Trash2, Calendar, User } from "lucide-react";
import { getTask, deleteTask } from "@/app/actions/tasks";
import { removeTask } from "@/store/taskSlice";
import { Task } from "@/types";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TaskViewPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-amber-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "todo":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  useEffect(() => {
    const loadTask = async () => {
      try {
        const result = await getTask(resolvedParams.id);
        if (result.success && result.data) {
          setTask(result.data);
        } else {
          setError(result.error || "Failed to load task");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [resolvedParams.id]);

  const handleDelete = async () => {
    if (!task) return;

    setIsDeleting(true);
    try {
      const result = await deleteTask(task.id);
      if (result.success) {
        dispatch(removeTask(task.id));
        toast({
          title: "Success",
          description: "Task has been deleted successfully.",
        });
        router.push("/tasks");
      } else {
        throw new Error(result.error || "Failed to delete task");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

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
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{task.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getPriorityColor(task.priority)}>
                Priority: {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              <Badge className={getStatusColor(task.status)}>
                {task.status
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/tasks/${task.id}/edit`)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} disabled={isDeleting}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Task Details */}
        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div>
                <h3 className="font-medium mb-1">Description</h3>
                <p className="text-muted-foreground">{task.description || "No description provided"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Due: {formatDate(task.due_date)}</span>
              </div>
              {task.client_id && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Related Client ID: {task.client_id}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <DeleteConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          title="Delete Task"
          description="Are you sure you want to delete this task? This action cannot be undone."
          confirmText={isDeleting ? "Deleting..." : "Delete"}
        />
      </div>
    </DashboardLayout>
  );
}
