// src/types/index.ts

//user types
export interface User {
  id: string;
  username: string;
  // add other user fields as needed
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Client types
export type LeadStatus = "cold" | "warm" | "hot";

export interface Client {
  id: number;
  created_at: string;
  company_name: string;
  first_name: string;
  last_name: string;
  position: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  lead: string;
  related_name: string;
  linkedin_connection: string;
  comments: string;
  first_contact: string | undefined;
  description_contact: string;
  date_of_last_contact: string;
  description_contact_more: string;
  follow_up_action: string;
  date_of_next_contact: string;
  new_business: string;
  recommendation: string;
  owner_id: number;
  latest_task_id?: number;
  task_count?: number;
}

export type CreateClientData = Omit<
  Client,
  "id" | "created_at" | "owner_id" | "date_of_last_contact" | "date_of_next_contact"
>;

export interface UpdateClientData extends CreateClientData {
  id: number;
}

// State types
export interface LoadingState {
  list: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface FilterState {
  lead: LeadStatus | undefined;
  searchTerm: string;
  startDate: string | null;
  endDate: string | null;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface SortingState<T> {
  field: keyof T | undefined;
  direction: "asc" | "desc" | undefined;
}

// Store types
export interface ClientsState {
  list: Client[];
  currentClient: Client | null;
  loading: LoadingState;
  error: string | null;
  filters: FilterState;
  pagination: PaginationState;
  sorting: SortingState<Client>;
}

export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "in-progress" | "completed";
export type TaskType = "follow-up" | "meeting" | "call" | "other";
export type TaskCreationSource = "global" | "client" | "calendar" | "dashboard";

// Task types
export interface Task {
  id: number; // Changed to number to match your pattern with Client
  // created_at: string;  // Changed to match your pattern with Client
  title: string;
  description: string;
  due_date: string; // Changed to string to match date pattern
  priority: TaskPriority;
  status: TaskStatus;
  type: TaskType;
  client_id?: number; // Changed to snake_case and number to match pattern
  // updated_at: string;  // Changed to match pattern
  // completed_at?: string;
}

export interface TaskCreationContext {
  source: TaskCreationSource;
  client_id?: number; // Changed to snake_case and number
  date?: string;
  event_id?: string; // Changed to snake_case
  follow_up_action?: string; // Changed to snake_case
  prefilled_data?: {
    // Changed to snake_case
    title?: string;
    description?: string;
    type?: TaskType;
  };
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Store types (existing pattern)
export interface TasksState {
  list: Task[];
  currentTask: Task | null;
  loading: LoadingState;
  error: string | null;
  filters: {
    status?: TaskStatus;
    searchTerm: string;
    clientId?: number;
    startDate: string | null;
    endDate: string | null;
  };
  pagination: PaginationState;
  sorting: SortingState<Task>;
}

// Calendar types
export type CalendarEventType = "meeting" | "call" | "reminder" | "other";
export type CalendarEventStatus = "scheduled" | "cancelled" | "completed";
export type CalendarEventRecurrence = "none" | "daily" | "weekly" | "monthly" | "yearly";

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  start_date: string; // ISO string
  end_date: string; // ISO string
  all_day: boolean;
  type: CalendarEventType;
  status: CalendarEventStatus;
  client_id?: number; // Optional link to client
  task_id?: number; // Optional link to task
  location?: string;
  recurrence: CalendarEventRecurrence;
  recurrence_end?: string; // ISO string
  created_at: string; // ISO string
  updated_at: string; // ISO string
}

export type CreateCalendarEventData = Omit<CalendarEvent, "id" | "created_at" | "updated_at">;

export type UpdateCalendarEventData = Partial<CreateCalendarEventData> & {
  id: number;
};

// Calendar State Types
export interface CalendarState {
  events: CalendarEvent[];
  currentEvent: CalendarEvent | null;
  loading: LoadingState;
  error: string | null;
  view: "month" | "week" | "day";
  selectedDate: string; // ISO string
  filters: {
    type?: CalendarEventType;
    clientId?: number;
    taskId?: number;
    searchTerm: string;
    startDate: string | null;
    endDate: string | null;
  };
}
