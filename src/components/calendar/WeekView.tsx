import { useMemo, useCallback } from "react";
import { format, startOfWeek, addDays, differenceInMinutes, addWeeks, subWeeks, isSameDay } from "date-fns";
import { CalendarEvent, TaskPriority, TaskStatus } from "@/types";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Clock, CheckSquare } from "lucide-react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

interface WeekViewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick?: (dateString: string) => void;
  onWeekChange?: (date: Date) => void;
  onDaySelect?: (date: Date) => void;
}

interface EventContentProps {
  event: CalendarEvent;
}

const TaskStatusBadge = ({ status }: { status: TaskStatus }) => {
  const statusColors = {
    todo: "bg-gray-100 text-gray-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  const statusLabels = {
    todo: "To Do",
    "in-progress": "In Progress",
    completed: "Done",
  };

  return <Badge className={cn("text-xs", statusColors[status])}>{statusLabels[status]}</Badge>;
};

const EventContent = ({ event }: EventContentProps) => {
  const startTime = format(new Date(event.start_date), "h:mm a");
  const task = useSelector((state: RootState) =>
    event.task_id ? state.tasks.list.find((t) => t.id === event.task_id) : null
  );

  return (
    <div className="flex h-full gap-2">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm leading-tight truncate">
          {event.task_id && <CheckSquare className="h-3 w-3 inline-block mr-1 text-muted-foreground" />}
          {event.title}
        </div>
        {task && (
          <div className="flex items-center gap-1 mt-1">
            <TaskStatusBadge status={task.status} />
          </div>
        )}
      </div>
      <div className="flex flex-col items-end text-xs text-muted-foreground shrink-0">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{startTime}</span>
        </div>
      </div>
    </div>
  );
};

const TaskTooltipContent = ({ event }: { event: CalendarEvent }) => {
  const task = useSelector((state: RootState) =>
    event.task_id ? state.tasks.list.find((t) => t.id === event.task_id) : null
  );

  return (
    <div className="space-y-2 p-1">
      <div className="flex items-center gap-2">
        {event.task_id && <CheckSquare className="h-4 w-4" />}
        <p className="font-medium">{event.title}</p>
      </div>
      <p className="text-xs text-muted-foreground">Due: {format(new Date(event.start_date), "MMM d, h:mm a")}</p>
      {event.description && <p className="text-xs max-w-xs text-muted-foreground">{event.description}</p>}
      {task && (
        <div className="flex flex-col gap-1">
          <TaskStatusBadge status={task.status} />
          {task.priority && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                task.priority === "high"
                  ? "border-red-500 text-red-700"
                  : task.priority === "medium"
                  ? "border-amber-500 text-amber-700"
                  : "border-blue-500 text-blue-700"
              )}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default function WeekView({
  selectedDate,
  events,
  onEventClick,
  onTimeSlotClick,
  onWeekChange,
  onDaySelect,
}: WeekViewProps) {
  const weekDates = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [selectedDate]);

  const hours = useMemo(() => {
    return Array.from({ length: 13 }).map((_, i) => i + 8);
  }, []);

  const handleTimeSlotClick = useCallback(
    (date: Date, hour: number) => {
      if (onTimeSlotClick) {
        const newDate = new Date(date);
        newDate.setHours(hour, 0, 0, 0);
        onTimeSlotClick(newDate.toISOString());
      }
    },
    [onTimeSlotClick]
  );

  const handleDayClick = useCallback(
    (date: Date) => {
      if (onDaySelect) {
        onDaySelect(date);
      }
    },
    [onDaySelect]
  );

  const handlePrevWeek = useCallback(() => {
    if (onWeekChange) {
      const newDate = subWeeks(selectedDate, 1);
      onWeekChange(newDate);
    }
  }, [selectedDate, onWeekChange]);

  const handleNextWeek = useCallback(() => {
    if (onWeekChange) {
      const newDate = addWeeks(selectedDate, 1);
      onWeekChange(newDate);
    }
  }, [selectedDate, onWeekChange]);

  const getEventStyle = useCallback((event: CalendarEvent) => {
    const eventStart = new Date(event.start_date);
    const eventEnd = new Date(event.end_date);
    const startHour = eventStart.getHours();
    const startMinute = eventStart.getMinutes();
    const relativeStartHour = startHour - 8;

    const topPosition = relativeStartHour * 60 + startMinute;
    const duration = differenceInMinutes(eventEnd, eventStart);

    return {
      top: `${topPosition}px`,
      height: `${Math.max(duration, 35)}px`,
      minHeight: "35px",
    };
  }, []);

  const weekEvents = useMemo(() => {
    return weekDates.map((date) =>
      events
        .filter((event) => isSameDay(new Date(event.start_date), date))
        .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    );
  }, [events, weekDates]);

  return (
    <div className="flex flex-col h-[900px] border rounded-lg bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="font-medium">
          {format(weekDates[0], "MMM d")} - {format(weekDates[6], "MMM d, yyyy")}
        </div>
      </div>

      {/* Days Header */}
      <div className="flex border-b sticky top-0 z-10 bg-white pr-[17px]">
        <div className="w-20 flex-shrink-0 p-2 border-r bg-gray-50" />
        {weekDates.map((date, i) => (
          <div
            key={i}
            onClick={() => handleDayClick(date)}
            className={cn(
              "flex-1 p-2 text-center border-r cursor-pointer hover:bg-gray-50 transition-colors last:border-r-0",
              isSameDay(date, selectedDate) && "bg-blue-50"
            )}
          >
            <div className="font-medium">{format(date, "EEE")}</div>
            <div className="text-sm text-muted-foreground">{format(date, "MMM d")}</div>
          </div>
        ))}
      </div>

      {/* Main Grid Container */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="flex h-full absolute inset-0">
          {/* Time Column */}
          <div className="w-20 flex-shrink-0 border-r bg-gray-50 sticky left-0 z-10">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-[60px] border-b last:border-b-0 p-2 text-sm text-muted-foreground flex items-start justify-end pr-4"
              >
                {format(new Date().setHours(hour, 0, 0, 0), "h a")}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="flex flex-1 relative">
            {weekDates.map((date, dayIndex) => (
              <div
                key={dayIndex}
                className={cn(
                  "flex-1 relative border-r last:border-r-0",
                  isSameDay(date, selectedDate) && "bg-blue-50/30"
                )}
                style={{
                  width: `calc((100% - 17px) / 7)`,
                }}
              >
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-[60px] border-b last:border-b-0 hover:bg-gray-50/50 transition-colors cursor-pointer hover:shadow-inner"
                    onClick={() => handleTimeSlotClick(date, hour)}
                  />
                ))}

                {/* Events */}
                {weekEvents[dayIndex].map((event, eventIndex) => (
                  <TooltipProvider key={event.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "absolute left-1 right-1 p-2 rounded-md border shadow-sm cursor-pointer",
                            "transition-colors duration-200",
                            getEventTypeStyles(event.type, event.task_id)
                          )}
                          style={{
                            ...getEventStyle(event),
                            zIndex: eventIndex + 1,
                          }}
                          onClick={() => onEventClick(event)}
                        >
                          <EventContent event={event} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <TaskTooltipContent event={event} />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface EnhancedCalendarEvent extends CalendarEvent {
  _priority?: TaskPriority;
}
function getEventTypeStyles(type: string, taskId?: number, event?: CalendarEvent) {
  // Base styles for task-linked events
  if (taskId && (event as EnhancedCalendarEvent)?._priority) {
    const priorityColors = {
      high: "bg-red-50 border-red-200 hover:bg-red-100",
      medium: "bg-amber-50 border-amber-200 hover:bg-amber-100",
      low: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    };

    const priority = (event as EnhancedCalendarEvent)._priority;
    return priority ? priorityColors[priority] : "bg-purple-50 border-purple-200 hover:bg-purple-100";
  }

  // Original event type styles
  switch (type) {
    case "meeting":
      return "bg-blue-50 border-blue-200 hover:bg-blue-100";
    case "call":
      return "bg-green-50 border-green-200 hover:bg-green-100";
    case "task":
      return "bg-amber-50 border-amber-200 hover:bg-amber-100";
    case "reminder":
      return "bg-purple-50 border-purple-200 hover:bg-purple-100";
    default:
      return "bg-gray-50 border-gray-200 hover:bg-gray-100";
  }
}
