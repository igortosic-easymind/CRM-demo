// src/app/actions/calendar.ts
"use server";

import { cookies } from "next/headers";
import { CalendarEvent, CreateCalendarEventData, UpdateCalendarEventData, PaginationState } from "@/types";

const API_URL = process.env.API_URL || "http://127.0.0.1:8000/api";

// Helper function to get token from cookies
async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

interface ListCalendarEventsParams {
  type?: string;
  search?: string;
  client_id?: number;
  task_id?: number;
  start_date?: string;
  end_date?: string;
}

interface ListCalendarEventsResponse {
  success: boolean;
  data: CalendarEvent[];
  pagination: PaginationState;
  error?: string;
}

export async function listCalendarEvents(params: ListCalendarEventsParams = {}): Promise<ListCalendarEventsResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "Authentication required",
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
        },
      };
    }

    const queryParams = new URLSearchParams();
    if (params.type) queryParams.append("type", params.type);
    if (params.search) queryParams.append("search", params.search);
    if (params.client_id) queryParams.append("client_id", params.client_id.toString());
    if (params.task_id) queryParams.append("task_id", params.task_id.toString());
    if (params.start_date) queryParams.append("start_date", params.start_date);
    if (params.end_date) queryParams.append("end_date", params.end_date);

    const response = await fetch(`${API_URL}/calendar/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch calendar events",
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      },
    };
  }
}

interface CalendarEventResponse {
  success: boolean;
  data?: CalendarEvent;
  error?: string;
}

export async function getCalendarEvent(id: string): Promise<CalendarEventResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/calendar/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch calendar event",
    };
  }
}

export async function createCalendarEvent(eventData: CreateCalendarEventData): Promise<CalendarEventResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/calendar/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create calendar event",
    };
  }
}

export async function updateCalendarEvent(
  id: string,
  eventData: UpdateCalendarEventData
): Promise<CalendarEventResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/calendar/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update calendar event",
    };
  }
}

export async function deleteCalendarEvent(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/calendar/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete calendar event",
    };
  }
}
