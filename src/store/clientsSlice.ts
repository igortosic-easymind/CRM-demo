import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Client, ClientsState, LeadStatus } from "@/types";

const initialState: ClientsState = {
  list: [],
  currentClient: null,
  loading: {
    list: false,
    create: false,
    update: false,
    delete: false,
  },
  error: null,
  filters: {
    lead: undefined,
    searchTerm: "",
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
    field: "created_at",
    direction: "desc",
  },
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    // List operations
    setClients: (state, action: PayloadAction<Client[]>) => {
      state.list = action.payload;
      state.error = null;
    },

    // Single client operations
    setCurrentClient: (state, action: PayloadAction<Client | null>) => {
      state.currentClient = action.payload;
      state.error = null;
    },

    addClient: (state, action: PayloadAction<Client>) => {
      state.list.unshift(action.payload); // Add to beginning since default sort is newest first
      state.error = null;
    },

    updateClient: (state, action: PayloadAction<Client>) => {
      const index = state.list.findIndex((client) => client.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
      if (state.currentClient?.id === action.payload.id) {
        state.currentClient = action.payload;
      }
      state.error = null;
    },

    removeClient: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter((client) => client.id !== action.payload);
      if (state.currentClient?.id === action.payload) {
        state.currentClient = null;
      }
      state.error = null;
    },

    // Loading states
    setLoading: (
      state,
      action: PayloadAction<{
        operation: keyof ClientsState["loading"];
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
    setLeadFilter: (state, action: PayloadAction<LeadStatus | undefined>) => {
      state.filters.lead = action.payload;
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

    // Pagination
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

    // Sorting
    setSorting: (
      state,
      action: PayloadAction<{
        field: keyof Client | undefined;
        direction: "asc" | "desc" | undefined;
      }>
    ) => {
      state.sorting = action.payload;
    },

    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
    },
  },
});

export const {
  setClients,
  setCurrentClient,
  addClient,
  updateClient,
  removeClient,
  setLoading,
  setError,
  setLeadFilter,
  setSearchTerm,
  setDateFilter,
  setPagination,
  setSorting,
  clearFilters,
} = clientsSlice.actions;

export default clientsSlice.reducer;
