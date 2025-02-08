import { Task, TaskPriority, TaskStatus } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface TaskTableProps {
  tasks: Task[];
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  loading?: boolean;
}

export function TaskTable({ tasks = [], onView, onEdit, onDelete, loading = false }: TaskTableProps) {
  const getPriorityColor = (priority: TaskPriority | undefined) => {
    switch (priority) {
      case "high":
        return "bg-red-500 hover:bg-red-600";
      case "medium":
        return "bg-amber-500 hover:bg-amber-600";
      case "low":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusColor = (status: TaskStatus | undefined) => {
    switch (status) {
      case "completed":
        return "bg-green-500 hover:bg-green-600";
      case "in-progress":
        return "bg-blue-500 hover:bg-blue-600";
      case "todo":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const formatDisplayText = (text: string | undefined) => {
    if (!text) return "N/A";
    return text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderTableHeader = () => (
    <TableHeader>
      <TableRow>
        <TableHead>Title</TableHead>
        <TableHead>Priority</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Due Date</TableHead>
        <TableHead>Type</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );

  const renderLoadingSkeleton = () => (
    <TableBody>
      {Array.from({ length: 3 }).map((_, index) => (
        <TableRow key={`loading-row-${index}`}>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  const renderEmptyState = () => (
    <TableBody>
      <TableRow>
        <TableCell colSpan={6} className="text-center">
          No tasks found
        </TableCell>
      </TableRow>
    </TableBody>
  );

  const renderTaskList = () => (
    <TableBody>
      {tasks.map((task) => (
        <TableRow key={`task-${task.id}`}>
          <TableCell className="font-medium">{task.title || "Untitled Task"}</TableCell>
          <TableCell>
            <Badge className={getPriorityColor(task.priority as TaskPriority)}>
              {formatDisplayText(task.priority)}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge className={getStatusColor(task.status as TaskStatus)}>{formatDisplayText(task.status)}</Badge>
          </TableCell>
          <TableCell>{task.due_date ? formatDate(task.due_date) : "No due date"}</TableCell>
          <TableCell>
            <Badge variant="outline">{formatDisplayText(task.type)}</Badge>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => onView(task)} disabled={loading}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(task)} disabled={loading}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(task)} disabled={loading}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  return (
    <Table>
      {renderTableHeader()}
      {loading ? renderLoadingSkeleton() : tasks.length === 0 ? renderEmptyState() : renderTaskList()}
    </Table>
  );
}
