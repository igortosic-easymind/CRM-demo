// src/components/tasks/list/Filters.tsx
"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setStatusFilter } from "@/store/taskSlice";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TaskStatus } from "@/types";

export function Filters() {
  const dispatch = useDispatch();
  const statusFilter = useSelector((state: RootState) => state.tasks.filters.status);

  const handleStatusChange = (value: string) => {
    dispatch(setStatusFilter(value === "all" ? undefined : (value as TaskStatus)));
  };

  const clearFilters = () => {
    dispatch(setStatusFilter(undefined));
  };

  return (
    <div className="flex items-center gap-4">
      <Select value={statusFilter || "all"} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tasks</SelectItem>
          <SelectItem value="todo">To Do</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      {statusFilter && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
