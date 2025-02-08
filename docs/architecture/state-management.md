# State Management Architecture

## Table of Contents

- [Overview](#overview)
- [Core State Management](#core-state-management)
- [Data Flow Architecture](#data-flow-architecture)
- [State Patterns](#state-patterns)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Future Improvements](#future-improvements)

---

## Overview

Our CRM system implements a hybrid state management approach combining Redux for client-side state management and Next.js 15 Server Actions for server-side data handling. This architecture was chosen to support complex business requirements.

### Key Business Requirements

- Real-time UI updates for sales team efficiency
- Complex filtering and sorting for large client datasets
- Offline data persistence for field sales teams
- Optimistic updates for better user experience
- Cross-entity state management (clients, tasks, calendar)

---

## Core State Management

### Why Redux?

We chose Redux for state management based on several business needs:

1. **Complex Data Relationships**

   - Clients link to tasks and calendar events
   - Changes in one entity affect others
   - Need centralized state management

2. **Performance Requirements**

   - Sales teams handle large client lists
   - Need efficient filtering and sorting
   - Require minimized server requests

3. **User Experience**
   - Sales teams need immediate feedback
   - Support offline capability
   - Maintain consistent UI state

### Redux Store Structure

```typescript
store/
  ├── authSlice.ts      // User authentication & permissions
  ├── clientsSlice.ts   // Client relationship management
  ├── taskSlice.ts      // Sales activity tracking
  ├── calendarSlice.ts  // Schedule management
  └── store.ts          // Store configuration
```

#### Business Context for Each Slice

1. **Auth Slice**

   - Manages user roles and permissions
   - Controls feature access based on role
   - Maintains security context

2. **Clients Slice**

   - Core CRM functionality
   - Manages lead status and pipeline
   - Tracks client interactions
   - Reason: Sales teams need quick access to client data

3. **Tasks Slice**

   - Sales activity management
   - Follow-up tracking
   - Task prioritization
   - Reason: Ensures no follow-ups are missed

4. **Calendar Slice**
   - Meeting and call scheduling
   - Integration with tasks
   - Resource allocation
   - Reason: Coordinates team activities

### State Persistence

We use Redux-persist for specific business needs:

```typescript
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated"],
};
```

#### Why This Configuration

- Persist authentication for seamless user experience
- Maintain user context across sessions
- Support offline access to critical data
- Whitelist approach for security and performance

---

## Data Flow Architecture

### Server-Side Data Handling

Server Actions handle API communications with focus on business operations:

```typescript
"use server";

async function listClients(params: ListClientsParams) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "Authentication required",
        data: [],
      };
    }

    const response = await fetch(`${API_URL}/clients/...`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch clients",
      data: [],
    };
  }
}
```

#### Business Benefits

- Type-safe server communication
- Centralized error handling
- Consistent response format
- Simplified authentication flow

### Client-Side State Management

Typical Redux action flow with business context:

```typescript
// Example client management flow
dispatch(setLoading({ operation: "list", isLoading: true }));
try {
  const result = await listClients(params);
  if (result.success && result.data) {
    dispatch(setClients(result.data)); // Update client list
    dispatch(setPagination(result.pagination)); // Update page controls
  } else {
    dispatch(setError(result.error)); // Show user feedback
  }
} finally {
  dispatch(setLoading({ operation: "list", isLoading: false }));
}
```

## State Patterns

### Common State Interfaces

```typescript
// Loading State
interface LoadingState {
  list: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}
// Pagination State
interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
// Filter State
interface FilterState {
  searchTerm: string;
  status?: string;
  startDate: string | null;
  endDate: string | null;
}
```

### Redux Slice Pattern

```typescript
const sliceName = createSlice({
  name: "entity",
  initialState,
  reducers: {
    setLoading: (
      state,
      action: PayloadAction<{
        operation: keyof LoadingState;
        isLoading: boolean;
      }>
    ) => {
      state.loading[action.payload.operation] = action.payload.isLoading;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // ... other reducers
  },
});
```

## Error Handling

### Error Response Structure

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: PaginationState;
}
```

### Error Handling Strategy

1. Server-side validation
2. Client-side validation
3. User feedback through toast notifications
4. Error state management in Redux
   Example error handling:

```typescript
try {
  const result = await apiCall();
  if (!result.success) {
    toast({
      variant: "destructive",
      title: "Error",
      description: result.error,
    });
  }
} catch (error) {
  toast({
    variant: "destructive",
    title: "Error",
    description: error instanceof Error ? error.message : "An unexpected error occurred",
  });
}
```

## Best Practices

### State Updates

1. Always use immutable updates

```typescript
// Good
state.items = [...state.items, newItem];
// Bad
state.items.push(newItem);
```

2. Use selector memoization

```typescript
const selectFilteredItems = createSelector([(state) => state.items, (state) => state.filter], (items, filter) =>
  items.filter((item) => item.status === filter)
);
```

3. Batch related updates

```typescript
dispatch(setLoading(true));
dispatch(setItems(data));
dispatch(setPagination(pagination));
dispatch(setLoading(false));
```

## Future Improvements

### Short Term

1. Entity normalization using `@reduxjs/toolkit`
2. Request deduplication
3. Request caching

### Medium Term

1. WebSocket integration for real-time updates
2. Optimistic UI updates with rollback
3. State preloading

### Long Term

1. Advanced TypeScript type safety
2. API type generation
3. Performance optimizations

---

Last Updated: January 29, 2025
