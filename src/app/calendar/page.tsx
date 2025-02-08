// src/app/calendar/page.tsx
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setLoading, setEvents, setError, setView, setSelectedDate } from "@/store/calendarSlice";
import { listCalendarEvents } from "@/app/actions/calendar";
import { listTasks } from "@/app/actions/tasks";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Loader2, Clock, MapPin } from "lucide-react";
import { addMonths, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { EventModal } from "@/components/calendar/EventModal";
import { CalendarEvent } from "@/types";
import WeekView from "@/components/calendar/WeekView";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function CalendarPage() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { events, loading, error, view, selectedDate } = useSelector((state: RootState) => state.calendar);
  const [date, setDate] = useState<Date>(new Date(selectedDate));
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [showEventModal, setShowEventModal] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "create" | "edit">("view");
  const [showTasks, setShowTasks] = useState(true);

  const handleWeekChange = (newDate: Date) => {
    setDate(newDate);
    dispatch(setSelectedDate(newDate.toISOString()));
    // Reload events for the new week
    loadEvents();
  };

  // Update loadEvents to handle both month and week views
  const loadEvents = useCallback(async () => {
    if (isInitialMount && events.length > 0) {
      setIsInitialMount(false);
      return;
    }
    try {
      dispatch(setLoading({ operation: "list", isLoading: true }));
      dispatch(setError(null));

      let start, end;
      if (view === "month") {
        start = startOfMonth(date).toISOString();
        end = endOfMonth(date).toISOString();
      } else {
        start = startOfWeek(date, { weekStartsOn: 1 }).toISOString();
        end = endOfWeek(date, { weekStartsOn: 1 }).toISOString();
      }

      // Fetch both calendar events and tasks
      const [eventsResult, tasksResult] = await Promise.all([
        listCalendarEvents({
          start_date: start,
          end_date: end,
        }),
        listTasks({
          page: 1,
          itemsPerPage: 100,
        }),
      ]);

      if (eventsResult.success && tasksResult.success) {
        // Convert tasks to calendar events format
        const currentTime = new Date().toISOString();
        const taskEvents: CalendarEvent[] = tasksResult.data
          .filter((task) => task.due_date)
          .map((task) => ({
            id: task.id + 10000, // Use task ID directly
            title: task.title,
            description: task.description,
            start_date: task.due_date,
            end_date: task.due_date,
            all_day: false,
            type: "meeting" as const,
            status: "scheduled" as const,
            task_id: task.id,
            recurrence: "none" as const,
            created_at: currentTime,
            updated_at: currentTime,
            location: undefined,
            ...(task.priority && { _priority: task.priority }),
          }));

        // Combine regular events and task events
        const allEvents: CalendarEvent[] = [...eventsResult.data, ...taskEvents];
        dispatch(setEvents(allEvents));
      } else {
        dispatch(setError(eventsResult.error || tasksResult.error || "Failed to load events"));
        toast({
          variant: "destructive",
          title: "Error",
          description: eventsResult.error || tasksResult.error || "Failed to load events",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      dispatch(setError(errorMessage));
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      dispatch(setLoading({ operation: "list", isLoading: false }));
      setIsInitialMount(false);
    }
  }, [dispatch, date, events.length, isInitialMount, toast, view]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      dispatch(setSelectedDate(newDate.toISOString()));
    }
  };

  const handleViewChange = (newView: "month" | "week") => {
    dispatch(setView(newView));
    // Reload events when switching views
    loadEvents();
  };

  const handlePreviousMonth = () => {
    const newDate = addMonths(date, -1);
    setDate(newDate);
    dispatch(setSelectedDate(newDate.toISOString()));
  };

  const handleNextMonth = () => {
    const newDate = addMonths(date, 1);
    setDate(newDate);
    dispatch(setSelectedDate(newDate.toISOString()));
  };

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setModalMode("view");
    setShowEventModal(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowEventModal(false);
    setSelectedEvent(undefined);
    // Ensure we reload events after modal closes
    loadEvents();
  }, [loadEvents]);

  const handleCreateEvent = () => {
    setSelectedEvent(undefined);
    setModalMode("create");
    setShowEventModal(true);
  };

  const handleDaySelect = (date: Date) => {
    setDate(date);
    dispatch(setSelectedDate(date.toISOString()));
  };

  const handleTimeSlotClick = (dateString: string) => {
    // Set the selected date to the clicked time slot
    const slotDate = new Date(dateString);
    setDate(slotDate);

    // Open modal with the correct date and time
    setSelectedEvent(undefined);
    setModalMode("create");
    setShowEventModal(true);

    // The formData in EventModal will now use this date
    dispatch(setSelectedDate(slotDate.toISOString()));
  };

  const getEventsForDay = useCallback(
    (day: Date) => {
      return events.filter((event) => {
        const eventDate = new Date(event.start_date);
        return eventDate.toDateString() === day.toDateString();
      });
    },
    [events]
  );

  const EventCard = ({ event }: { event: CalendarEvent }) => (
    <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer" onClick={() => handleEventClick(event)}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium">{event.title}</h4>
        <Badge variant="outline">{event.type}</Badge>
      </div>
      <div className="space-y-1">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          {event.all_day
            ? "All day"
            : `${format(new Date(event.start_date), "h:mm a")} - ${format(new Date(event.end_date), "h:mm a")}`}
        </div>
        {event.location && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {event.location}
          </div>
        )}
      </div>
    </div>
  );

  const headerSection = (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Calendar</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch id="show-tasks" checked={showTasks} onCheckedChange={setShowTasks} />
          <Label htmlFor="show-tasks">Show Tasks</Label>
        </div>
        <div className="flex gap-2">
          <Select value={view} onValueChange={(value: "month" | "week") => handleViewChange(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreateEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>
    </div>
  );

  // Filter events before passing to week/month view
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (!showTasks && event.task_id) {
        return false;
      }
      return true;
    });
  }, [events, showTasks]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {headerSection}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="icon" onClick={handlePreviousMonth} disabled={loading.list}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle className="flex items-center gap-2">
                      {format(date, "MMMM yyyy")}
                      {loading.list && <Loader2 className="h-4 w-4 animate-spin" />}
                    </CardTitle>
                    <Button variant="outline" size="icon" onClick={handleNextMonth} disabled={loading.list}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" onClick={() => handleDateChange(new Date())} disabled={loading.list}>
                    Today
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 relative">
                {loading.list && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                )}
                {view === "month" ? (
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    className="rounded-none"
                    month={startOfMonth(date)}
                    modifiers={{
                      hasEvents: (day) => getEventsForDay(day).length > 0,
                    }}
                    modifiersStyles={{
                      hasEvents: {
                        fontWeight: "bold",
                        textDecoration: "underline",
                      },
                    }}
                    disabled={loading.list}
                  />
                ) : (
                  <WeekView
                    selectedDate={date}
                    events={filteredEvents}
                    onEventClick={handleEventClick}
                    onTimeSlotClick={handleTimeSlotClick}
                    onWeekChange={handleWeekChange}
                    onDaySelect={handleDaySelect}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Events</CardTitle>
                <CardDescription>{format(date, "MMMM d, yyyy")}</CardDescription>
              </CardHeader>
              <CardContent>
                {loading.list ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-100 rounded-lg" />
                      </div>
                    ))}
                  </div>
                ) : getEventsForDay(date).length > 0 ? (
                  <div className="space-y-3">
                    {getEventsForDay(date).map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No events scheduled</p>
                )}
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={handleCreateEvent}>
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleCreateEvent}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reminder
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </div>

        <EventModal
          event={selectedEvent}
          isOpen={showEventModal}
          onClose={handleModalClose}
          mode={modalMode}
          selectedDate={date}
        />
      </div>
    </DashboardLayout>
  );
}
