// src/components/calendar/EventModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { CalendarEvent, CreateCalendarEventData } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { addEvent, updateEvent, removeEvent } from "@/store/calendarSlice";
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from "@/app/actions/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { FormError } from "@/components/ui/form-error";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { Pencil, Trash2 } from "lucide-react";

interface EventModalProps {
  event?: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
  mode?: "view" | "create" | "edit";
  selectedDate?: Date;
}

export function EventModal({ event, isOpen, onClose, mode = "view", selectedDate = new Date() }: EventModalProps) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});

  const isEditing = currentMode === "edit" || currentMode === "create";

  const [formData, setFormData] = useState<CreateCalendarEventData>({
    title: event?.title || "",
    description: event?.description || "",
    // Ensure dates are properly formatted
    start_date: event?.start_date
      ? format(new Date(event.start_date), "yyyy-MM-dd'T'HH:mm")
      : format(selectedDate, "yyyy-MM-dd'T'HH:mm"),
    end_date: event?.end_date
      ? format(new Date(event.end_date), "yyyy-MM-dd'T'HH:mm")
      : format(selectedDate, "yyyy-MM-dd'T'HH:mm"),
    type: event?.type || "meeting",
    status: event?.status || "scheduled",
    all_day: event?.all_day || false,
    recurrence: event?.recurrence || "none",
    client_id: event?.client_id,
    task_id: event?.task_id,
    location: event?.location || "",
  });

  useEffect(() => {
    setCurrentMode(mode);

    // Reset form when opening in create mode
    if (mode === "create") {
      const startTime = selectedDate || new Date();
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 1);
      setFormData({
        title: "",
        description: "",
        start_date: format(startTime, "yyyy-MM-dd'T'HH:mm"),
        end_date: format(endTime, "yyyy-MM-dd'T'HH:mm"),
        type: "meeting",
        status: "scheduled",
        all_day: false,
        recurrence: "none",
        client_id: undefined,
        task_id: undefined,
        location: "",
      });
    } else if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        start_date: format(new Date(event.start_date), "yyyy-MM-dd'T'HH:mm"),
        end_date: format(new Date(event.end_date), "yyyy-MM-dd'T'HH:mm"),
        type: event.type,
        status: event.status,
        all_day: event.all_day,
        recurrence: event.recurrence,
        client_id: event.client_id,
        task_id: event.task_id,
        location: event.location || "",
      });
    }
  }, [mode, event, selectedDate]);

  // Original create handler
  const handleCreate = async () => {
    if (!validateForm()) return;

    setError(null);
    setLoading(true);
    try {
      const result = await createCalendarEvent(formData);
      if (result.success && result.data) {
        dispatch(addEvent(result.data));
        toast({
          title: "Success",
          description: "Event created successfully",
        });
        onClose();
      } else {
        throw new Error(result.error || "Failed to create event");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update handler
  const handleUpdate = async () => {
    if (!validateForm() || !event?.id) return;

    setLoading(true);
    try {
      const result = await updateCalendarEvent(event.id.toString(), {
        ...formData,
        id: event.id,
      });

      if (result.success && result.data) {
        dispatch(updateEvent(result.data));
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
        onClose();
      } else {
        throw new Error(result.error || "Failed to update event");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!event?.id) return;

    setError(null);
    setLoading(true);
    try {
      const result = await deleteCalendarEvent(event.id);
      if (result.success) {
        dispatch(removeEvent(event.id));
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
        onClose();
      } else {
        throw new Error(result.error || "Failed to delete event");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  // Submit handler that routes to appropriate operation
  const handleSubmit = () => {
    if (currentMode === "create") {
      handleCreate();
    } else if (currentMode === "edit") {
      handleUpdate();
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.start_date) {
      errors.start_date = "Start date is required";
    }

    if (!formData.end_date) {
      errors.end_date = "End date is required";
    }

    if (formData.start_date && formData.end_date && new Date(formData.start_date) > new Date(formData.end_date)) {
      errors.end_date = "End date must be after start date";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof CreateCalendarEventData, value: CreateCalendarEventData[typeof field]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentMode === "create" ? "Create Event" : currentMode === "edit" ? "Edit Event" : "Event Details"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {mode === "view" ? "View event details" : mode === "create" ? "Create new event" : "Edit event"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              disabled={!isEditing || loading}
              className={validationErrors.title ? "border-destructive" : ""}
            />
            <FormError message={validationErrors.title || ""} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={!isEditing || loading}
            />
          </div>

          <div className="flex items-center gap-4">
            <Label htmlFor="all_day">All Day</Label>
            <Switch
              id="all_day"
              checked={formData.all_day}
              onCheckedChange={(checked) => handleInputChange("all_day", checked)}
              disabled={!isEditing || loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start_date">Start</Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => handleInputChange("start_date", e.target.value)}
                disabled={!isEditing || loading}
                className={validationErrors.start_date ? "border-destructive" : ""}
              />
              <FormError message={validationErrors.start_date || ""} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="end_date">End</Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => handleInputChange("end_date", e.target.value)}
                disabled={!isEditing || loading}
                className={validationErrors.end_date ? "border-destructive" : ""}
              />
              <FormError message={validationErrors.end_date || ""} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
              disabled={!isEditing || loading}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              disabled={!isEditing || loading}
            />
          </div>

          {formData.client_id && <div className="text-sm text-muted-foreground">Client ID: {formData.client_id}</div>}

          {formData.task_id && <div className="text-sm text-muted-foreground">Task ID: {formData.task_id}</div>}
        </div>

        <DialogFooter>
          {currentMode === "view" ? (
            // View mode buttons
            <>
              <Button variant="outline" onClick={() => setCurrentMode("edit")} disabled={loading}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} disabled={loading}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          ) : (
            // Create/Edit mode buttons
            <>
              <Button
                variant="outline"
                onClick={() => {
                  if (currentMode === "edit") {
                    setCurrentMode("view");
                  } else {
                    onClose();
                  }
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : currentMode === "create" ? "Create" : "Save Changes"}
              </Button>
            </>
          )}
        </DialogFooter>
        <DeleteConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          title="Delete Event"
          description={`Are you sure you want to delete "${event?.title}"? This action cannot be undone.`}
        />
      </DialogContent>
    </Dialog>
  );
}
