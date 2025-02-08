// src/store/taskSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task, TasksState, TaskStatus } from "@/types";

const initialState: TasksState = {
  list: [],
  currentTask: null,
  loading: {
    list: false,
    create: false,
    update: false,
    delete: false,
  },
  error: null,
  filters: {
    status: undefined,
    searchTerm: "",
    clientId: undefined,
    startDate: null,
    endDate: null,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  sorting: {
    field: "due_date",
    direction: "asc",
  },
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // List operations
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.list = action.payload;
      state.error = null;
    },

    // Single task operations
    setCurrentTask: (state, action: PayloadAction<Task | null>) => {
      state.currentTask = action.payload;
      state.error = null;
    },

    addTask: (state, action: PayloadAction<Task>) => {
      state.list.push(action.payload);
      state.error = null;
    },

    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.list.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
      if (state.currentTask?.id === action.payload.id) {
        state.currentTask = action.payload;
      }
      state.error = null;
    },

    removeTask: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter((task) => task.id !== action.payload);
      if (state.currentTask?.id === action.payload) {
        state.currentTask = null;
      }
      state.error = null;
    },

    // Loading states
    setLoading: (
      state,
      action: PayloadAction<{
        operation: keyof TasksState["loading"];
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
    setStatusFilter: (state, action: PayloadAction<TaskStatus | undefined>) => {
      state.filters.status = action.payload;
    },

    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload;
    },

    setClientFilter: (state, action: PayloadAction<number | undefined>) => {
      state.filters.clientId = action.payload;
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

    setPagination: (
      state,
      action: PayloadAction<{
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage?: number;
      }>
    ) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },

    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setTasks,
  setCurrentTask,
  addTask,
  updateTask,
  removeTask,
  setLoading,
  setError,
  setStatusFilter,
  setSearchTerm,
  setClientFilter,
  setDateFilter,
  setPagination,
  clearFilters,
} = taskSlice.actions;

export default taskSlice.reducer;
