# Types Architecture

## Table of Contents

- [Overview](#overview)
- [Domain Model](#domain-model)
- [Type Design Decisions](#type-design-decisions)
- [State Management Types](#state-management-types)
- [Type Relationships](#type-relationships)
- [Evolution & Improvements](#evolution--improvements)

## Overview

Our type system is designed to model a CRM business domain, focusing on client relationships, task management, and calendar scheduling. The type structure reflects real-world business processes and relationships.

## Domain Model

### Client Domain

The client domain represents our core business entity - the customer relationship:

```typescript
type LeadStatus = "cold" | "warm" | "hot";
// Why:
// - Simple three-state model for sales pipeline
// - Easy to understand and use
// - Maps to common sales terminology
// - Enables clear prioritization

interface Client {
  // Core Information
  id: number;
  company_name: string;
  first_name: string;
  last_name: string;
  position: string;

  // Contact Details
  phone: string;
  email: string;
  website: string;

  // Address Information
  address: string;
  city: string;
  state: string;
  zipcode: string;

  // Relationship Tracking
  lead: LeadStatus;
  related_name: string; // For referral tracking
  linkedin_connection: string; // Social media connection

  // Communication History
  first_contact: string | undefined; // When relationship started
  description_contact: string; // Initial contact notes
  date_of_last_contact: string; // Latest interaction
  description_contact_more: string; // Ongoing interaction notes

  // Follow-up Management
  follow_up_action: string; // Next steps
  date_of_next_contact: string; // Scheduled follow-up

  // Business Development
  new_business: string; // Opportunities
  recommendation: string; // Recommendations/Notes

  // Relationships
  owner_id: number; // Assigned account manager
  latest_task_id?: number; // Most recent task
  task_count?: number; // Activity volume indicator
}
```

Design considerations:

1. **Contact Information Split**

   - Separate personal and company information
   - Enables multiple contacts per company (future feature)
   - Maintains clean data structure

2. **Communication Timeline**
   - Track first and last contact
   - Store interaction descriptions
   - Enable follow-up scheduling
   - Reason: Build complete relationship history

### Task Domain

Tasks represent actionable items and follow-ups:

```typescript
type TaskPriority = "high" | "medium" | "low";
// Why: Simple prioritization that maps to business needs

type TaskStatus = "todo" | "in-progress" | "completed";
// Why:
// - Clear task lifecycle
// - Matches kanban methodology
// - Simple but effective tracking

type TaskType = "follow-up" | "meeting" | "call" | "other";
// Why:
// - Covers main CRM activities
// - Enables activity reporting
// - Maps to calendar events

interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  priority: TaskPriority;
  status: TaskStatus;
  type: TaskType;
  client_id?: number; // Optional link to client
}
```

Key decisions:

1. **Optional Client Association**

   - Tasks can exist without clients
   - Enables general task management
   - Maintains flexibility

2. **Type System**
   - Limited set of task types
   - Maps to common CRM activities
   - Enables meaningful reporting

### Calendar Domain

Calendar types handle scheduling and time-based activities:

```typescript
type CalendarEventType =
  | "meeting" // Face-to-face interactions
  | "call" // Phone/video calls
  | "task" // Time-blocked tasks
  | "reminder" // Follow-up reminders
  | "other"; // Miscellaneous

type CalendarEventStatus =
  | "scheduled" // Confirmed
  | "cancelled" // Called off
  | "completed"; // Finished

type CalendarEventRecurrence =
  | "none" // One-time
  | "daily" // Every day
  | "weekly" // Weekly
  | "monthly" // Monthly
  | "yearly"; // Annual

interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  start_date: string; // ISO string
  end_date: string; // ISO string
  all_day: boolean; // Full day event flag
  type: CalendarEventType;
  status: CalendarEventStatus;

  // Relationships
  client_id?: number; // Link to client
  task_id?: number; // Link to task

  // Location
  location?: string; // Meeting place/link

  // Recurrence
  recurrence: CalendarEventRecurrence;
  recurrence_end?: string; // End of recurrence
}
```

Design considerations:

1. **Event Relationships**

   - Links to both clients and tasks
   - Enables full activity tracking
   - Creates unified view of activities

2. **Recurrence Handling**
   - Simple recurrence patterns
   - Clear end dates
   - Manageable complexity

## Type Design Decisions

### 1. State Management Types

For Redux store management:

```typescript
// Common state patterns
interface LoadingState {
  list: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}
// Why: Track operation states separately

interface FilterState {
  searchTerm: string;
  startDate: string | null;
  endDate: string | null;
}
// Why: Consistent filtering across entities

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
// Why:
// - Standard pagination implementation
// - Enables UI pagination controls
// - Maintains consistent data loading
```

### 2. API Response Types

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: PaginationState;
}
// Why:
// - Consistent response structure
// - Clear success/failure states
// - Type-safe data handling
// - Optional pagination support
```

## Type Relationships

Our types form a connected system:

```
Client
  ↓
  ├── Tasks (client_id)
  ├── Calendar Events (client_id)
  └── Communication History

Task
  ↓
  ├── Client (client_id)
  └── Calendar Events (task_id)

Calendar Event
  ↓
  ├── Client (client_id)
  └── Task (task_id)
```

## Evolution & Improvements

### Current Limitations

1. **Client Contacts**

   - Single contact per client
   - Future: Add multiple contacts support

   ```typescript
   // Future contact type
   interface Contact {
     id: number;
     client_id: number;
     role: string;
     // ... contact details
   }
   ```

2. **Task Management**
   - Basic task structure
   - Future: Add subtasks, dependencies
   ```typescript
   // Future task enhancements
   interface Task {
     parent_task_id?: number;
     dependencies?: number[];
     // ... existing fields
   }
   ```

### Planned Improvements

1. **Enhanced Client Relations**

   ```typescript
   // Future relationship tracking
   interface ClientRelationship {
     source_client_id: number;
     target_client_id: number;
     relationship_type: "referral" | "partner" | "subsidiary";
   }
   ```

2. **Advanced Task Types**

   ```typescript
   // Future task categorization
   type TaskCategory = "sales" | "support" | "meeting" | "follow-up";
   type TaskComplexity = "simple" | "medium" | "complex";
   ```

3. **Calendar Enhancements**
   ```typescript
   // Future calendar features
   interface CalendarEventAttendee {
     user_id: number;
     status: "accepted" | "declined" | "pending";
     required: boolean;
   }
   ```

---

Last Updated: January 29, 2025
