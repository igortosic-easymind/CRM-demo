// src/components/tasks/form/TaskForm.tsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormError } from "@/components/ui/form-error";
import { Task, TaskPriority, TaskStatus, TaskType } from "@/types";
import { addTask, updateTask as updateTaskStore } from "@/store/taskSlice";
import { createTask, updateTask } from "@/app/actions/tasks";
import { useToast } from "@/hooks/use-toast";

interface TaskFormProps {
  initialData?: Task;
  mode?: "create" | "edit";
}

type ValidationErrors = Partial<Record<keyof Task, string>>;

const requiredFields = ["title", "due_date", "priority", "status", "type"] as const;

export default function TaskForm({ initialData, mode = "create" }: TaskFormProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState<Partial<Task>>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    due_date: initialData?.due_date ? new Date(initialData.due_date).toISOString().slice(0, 16) : "",
    priority: initialData?.priority || "medium",
    status: initialData?.status || "todo",
    type: initialData?.type || "follow-up",
    // client_id: initialData?.client_id,
  });

  const validateForm = () => {
    const errors: ValidationErrors = {};
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = `${field
          .split("_")
          .join(" ")
          .replace(/\b\w/g, (l) => l.toUpperCase())} is required`;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleInputChange = (field: keyof Task, value: string | number | TaskPriority | TaskStatus | TaskType) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === "create") {
        const result = await createTask(formData as Task);

        if (result.success && result.data) {
          dispatch(addTask(result.data));
          toast({
            title: "Success",
            description: "Task created successfully",
          });
          router.push("/tasks");
        } else {
          throw new Error(result.error || "Failed to create task");
        }
      } else {
        if (!initialData?.id) throw new Error("No task ID provided for update");
        const result = await updateTask(initialData.id.toString(), formData as Task);

        if (result.success && result.data) {
          dispatch(updateTaskStore(result.data));
          toast({
            title: "Success",
            description: "Task updated successfully",
          });
          router.push("/tasks");
        } else {
          throw new Error(result.error || "Failed to update task");
        }
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                disabled={loading}
                className={validationErrors.title ? "border-destructive" : ""}
              />
              <FormError message={validationErrors.title ?? ""} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: TaskPriority) => handleInputChange("priority", value)}
                  disabled={loading}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormError message={validationErrors.priority ?? ""} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: TaskStatus) => handleInputChange("status", value)}
                  disabled={loading}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormError message={validationErrors.status ?? ""} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: TaskType) => handleInputChange("type", value)}
                  disabled={loading}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormError message={validationErrors.type ?? ""} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="datetime-local"
                  value={formData.due_date}
                  onChange={(e) => handleInputChange("due_date", e.target.value)}
                  disabled={loading}
                  className={validationErrors.due_date ? "border-destructive" : ""}
                />
                <FormError message={validationErrors.due_date ?? ""} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Create Task" : "Update Task"}
        </Button>
      </div>
    </form>
  );
}
