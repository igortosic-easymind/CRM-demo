# API Integration Architecture

## Table of Contents

- [Overview](#overview)
- [Business Domain](#business-domain)
- [API Design Decisions](#api-design-decisions)
- [Core Functionality](#core-functionality)
- [Integration Examples](#integration-examples)

## Overview

Our CRM system's API is designed around core business processes of client relationship management, task tracking, and calendar management. We use Next.js 15 Server Actions for a seamless integration between frontend and backend, enabling type safety and better error handling.

## Business Domain

### Client Management

The client management API handles the complete lifecycle of client relationships:

```typescript
// Client Lifecycle APIs
/api/clients/            // List and create clients
/api/clients/:id         // Get, update, delete specific client
/api/clients/search      // Search across clients
```

Key design decisions:

1. **Lead Status Tracking**

   - We track clients as cold/warm/hot leads
   - This helps sales teams prioritize follow-ups
   - Enables filtering and reporting on lead conversion

2. **Contact History**
   - Store first contact date and description
   - Track last contact date
   - Record follow-up actions
   - Maintain communication history
   - Reason: Helps maintain relationship context and follow-up scheduling

Example of contact tracking:

```typescript
interface Client {
  // Basic info...
  first_contact: string;
  description_contact: string;
  date_of_last_contact: string;
  description_contact_more: string;
  follow_up_action: string;
  date_of_next_contact: string;
}
```

### Task Management

Tasks are designed to support various business activities:

```typescript
type TaskType = "follow-up" | "meeting" | "call" | "other";
type TaskPriority = "high" | "medium" | "low";
type TaskStatus = "todo" | "in-progress" | "completed";
```

Design considerations:

1. **Client Association**

   - Tasks can be linked to specific clients
   - Enables tracking of client-related activities
   - Provides context for follow-ups

2. **Priority System**
   - Three-level priority system for clear categorization
   - Helps teams focus on important tasks
   - Supports task sorting and filtering

### Calendar Integration

Calendar API is designed to support business scheduling needs:

```typescript
type CalendarEventType =
  | "meeting" // Client meetings
  | "call" // Phone calls
  | "task" // General tasks
  | "reminder" // Follow-up reminders
  | "other"; // Miscellaneous events
```

Key features:

1. **Event Links**

   - Events can link to clients and tasks
   - Provides unified view of activities
   - Enables cross-reference between modules

2. **Recurrence Handling**

```typescript
type CalendarEventRecurrence = "none" | "daily" | "weekly" | "monthly" | "yearly";
```

## API Design Decisions

### 1. Server Actions Choice

We chose Next.js Server Actions because:

- Enables direct server communication
- Provides type safety
- Reduces API boilerplate
- Simplifies authentication handling

Example implementation:

```typescript
"use server";

async function listClients(params: ListClientsParams) {
  // Authentication is handled automatically
  const token = await getAuthToken();

  // Type-safe parameters
  const queryParams = new URLSearchParams();
  if (params.lead) queryParams.append("lead", params.lead);
  if (params.search) queryParams.append("search", params.search);

  // Consistent error handling
  try {
    const response = await fetch(`${API_URL}/clients/?${queryParams}`);
    // ... error handling
  } catch (error) {
    // ... error processing
  }
}
```

### 2. Response Structure

We standardized API responses for consistency:

```typescript
interface ApiResponse<T> {
  success: boolean; // Clear success/failure indicator
  data?: T; // Type-safe data
  error?: string; // Human-readable error
  pagination?: {
    // Standard pagination
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
```

Reasons:

- Consistent error handling
- Predictable response structure
- Easy pagination implementation
- Clear success/failure states

### 3. Authentication Flow

Our token-based authentication system:

```typescript
async function login({ username, password }: LoginCredentials) {
  // 1. Authenticate user
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  // 2. Store token securely
  const { token } = await response.json();
  cookieStore.set("token", token, {
    httpOnly: true, // Security: No JS access
    secure: true, // Security: HTTPS only
    sameSite: "lax", // Security: CSRF protection
    path: "/", // Availability: All routes
  });

  // 3. Fetch user data
  const userResponse = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
```

Design considerations:

- Security: HttpOnly cookies
- CSRF protection
- Token refresh handling
- Session management

## Core Functionality

### Client Management Flow

1. **Client Creation**

   ```typescript
   async function createClient(data: CreateClientData) {
     // Validate required fields
     // Create client record
     // Set default lead status
     // Initialize contact history
     // Return client data
   }
   ```

2. **Lead Management**
   ```typescript
   async function updateLeadStatus(clientId: number, status: LeadStatus) {
     // Update lead status
     // Record status change
     // Trigger notifications
     // Update last modified
   }
   ```

### Task Integration

1. **Task Creation**

   ```typescript
   async function createTask(data: CreateTaskData) {
     // Create task
     // Link to client if provided
     // Set due date
     // Add to calendar if needed
     // Return task data
   }
   ```

2. **Task Updates**
   ```typescript
   async function updateTaskStatus(taskId: number, status: TaskStatus) {
     // Update status
     // Record completion if done
     // Update linked calendar events
     // Notify relevant users
   }
   ```

## Future Improvements

1. **Real-time Updates**

   - WebSocket integration for live updates
   - Reason: Improve collaboration and response time

2. **Batch Operations**

   - Bulk client updates
   - Mass task assignments
   - Reason: Improve efficiency for large datasets

3. **Advanced Search**
   - Elasticsearch integration
   - Full-text search
   - Reason: Better data accessibility

---

Last Updated: January 29, 2025
