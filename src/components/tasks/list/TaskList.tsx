// src/components/tasks/list/TaskList.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setLoading, setTasks, setError, removeTask, setPagination } from "@/store/taskSlice";
import { listTasks, deleteTask } from "@/app/actions/tasks";
import { SearchBar } from "./SearchBar";
import { Filters } from "./Filters";
import { TaskTable } from "./TaskTable";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DeleteConfirmationDialog } from "../../DeleteConfirmationDialog";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/types";
import { Pagination } from "@/components/ui/pagination";

export function TaskList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const { list: tasks, loading, error, filters, pagination } = useSelector((state: RootState) => state.tasks);

  const [isInitialMount, setIsInitialMount] = useState(true);

  const loadTasks = useCallback(async () => {
    // Skip the initial server-side fetch if we already have tasks
    if (isInitialMount && tasks.length > 0) {
      setIsInitialMount(false);
      return;
    }

    try {
      dispatch(setLoading({ operation: "list", isLoading: true }));
      dispatch(setError(null));

      const result = await listTasks({
        status: filters.status,
        search: filters.searchTerm,
        client_id: filters.clientId,
        page: pagination.currentPage,
        itemsPerPage: pagination.itemsPerPage,
      });

      if (result.success && result.data) {
        dispatch(setTasks(result.data));
        dispatch(setPagination(result.pagination));
      } else {
        dispatch(setError(result.error || "Failed to load tasks"));
      }
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : "An unexpected error occurred"));
    } finally {
      dispatch(setLoading({ operation: "list", isLoading: false }));
      setIsInitialMount(false);
    }
  }, [
    dispatch,
    filters.status,
    filters.searchTerm,
    filters.clientId,
    tasks.length,
    isInitialMount,
    pagination.currentPage,
    pagination.itemsPerPage,
  ]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleViewTask = (task: Task) => {
    router.push(`/tasks/${task.id}`);
  };

  const handleEditTask = (task: Task) => {
    router.push(`/tasks/${task.id}/edit`);
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    try {
      dispatch(setLoading({ operation: "delete", isLoading: true }));
      const result = await deleteTask(taskToDelete.id);

      if (result.success) {
        dispatch(removeTask(taskToDelete.id));
        toast({
          title: "Success",
          description: "Task has been deleted successfully.",
        });
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
      dispatch(setLoading({ operation: "delete", isLoading: false }));
      setTaskToDelete(null);
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setPagination({ ...pagination, currentPage: page }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button onClick={() => router.push("/tasks/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchBar />
        <Filters />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white rounded-md border">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="text-sm text-muted-foreground">{pagination.totalItems} tasks found</div>
          <Button variant="ghost" size="sm" onClick={loadTasks} disabled={loading.list}>
            <RefreshCw className={`h-4 w-4 ${loading.list ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <TaskTable
          tasks={tasks}
          onView={handleViewTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteClick}
          loading={loading.delete}
        />

        <div className="p-4 border-t">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            disabled={loading.list}
          />
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        description={`Are you sure you want to delete this task? This action cannot be undone.`}
      />
    </div>
  );
}
