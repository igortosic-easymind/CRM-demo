// src/store/calendarSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CalendarState, CalendarEvent, CalendarEventType } from "@/types";

const initialState: CalendarState = {
  events: [],
  currentEvent: null,
  loading: {
    list: false,
    create: false,
    update: false,
    delete: false,
  },
  error: null,
  view: "month",
  selectedDate: new Date().toISOString(),
  filters: {
    type: undefined,
    clientId: undefined,
    taskId: undefined,
    searchTerm: "",
    startDate: null,
    endDate: null,
  },
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    // List operations
    setEvents: (state, action: PayloadAction<CalendarEvent[]>) => {
      state.events = action.payload;
      state.error = null;
    },

    // Single event operations
    setCurrentEvent: (state, action: PayloadAction<CalendarEvent | null>) => {
      state.currentEvent = action.payload;
      state.error = null;
    },

    addEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.events.push(action.payload);
      state.error = null;
    },

    updateEvent: (state, action: PayloadAction<CalendarEvent>) => {
      const index = state.events.findIndex((event) => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
      if (state.currentEvent?.id === action.payload.id) {
        state.currentEvent = action.payload;
      }
      state.error = null;
    },

    removeEvent: (state, action: PayloadAction<number>) => {
      state.events = state.events.filter((event) => event.id !== action.payload);
      if (state.currentEvent?.id === action.payload) {
        state.currentEvent = null;
      }
      state.error = null;
    },

    // View operations
    setView: (state, action: PayloadAction<"month" | "week" | "day">) => {
      state.view = action.payload;
    },

    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },

    // Loading states
    setLoading: (
      state,
      action: PayloadAction<{
        operation: keyof CalendarState["loading"];
        isLoading: boolean;
      }>
    ) => {
      state.loading[action.payload.operation] = action.payload.isLoading;
    },

    // Error handling
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Filter operations
    setTypeFilter: (state, action: PayloadAction<CalendarEventType | undefined>) => {
      state.filters.type = action.payload;
    },

    setClientFilter: (state, action: PayloadAction<number | undefined>) => {
      state.filters.clientId = action.payload;
    },

    setTaskFilter: (state, action: PayloadAction<number | undefined>) => {
      state.filters.taskId = action.payload;
    },

    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload;
    },

    setDateFilter: (
      state,
      action: PayloadAction<{
        startDate: string | null;
        endDate: string | null;
      }>
    ) => {
      state.filters.startDate = action.payload.startDate;
      state.filters.endDate = action.payload.endDate;
    },

    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setEvents,
  setCurrentEvent,
  addEvent,
  updateEvent,
  removeEvent,
  setView,
  setSelectedDate,
  setLoading,
  setError,
  setTypeFilter,
  setClientFilter,
  setTaskFilter,
  setSearchTerm,
  setDateFilter,
  clearFilters,
} = calendarSlice.actions;

export default calendarSlice.reducer;
