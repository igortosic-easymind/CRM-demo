"use server";

import { cookies } from "next/headers";
import { Task, PaginationState } from "@/types";

const API_URL = process.env.API_URL || "http://127.0.0.1:8000/api";

// Helper function to get token from cookies
async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

// Helper function to handle API errors
async function handleApiError(response: Response) {
  const error = await response.json();
  throw new Error(error.message || "API request failed");
}

interface ListTasksParams {
  status?: "todo" | "in-progress" | "completed";
  search?: string;
  client_id?: number;
  page?: number;
  itemsPerPage?: number;
}

interface ListTasksResponse {
  success: boolean;
  data: Task[];
  pagination: PaginationState;
  error?: string;
}

export async function listTasks(params: ListTasksParams = {}): Promise<ListTasksResponse> {
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
    if (params.status) {
      queryParams.append("status", params.status);
    }
    if (params.search) {
      queryParams.append("search", params.search);
    }
    if (params.client_id) {
      queryParams.append("client_id", params.client_id.toString());
    }
    if (typeof params.page === "number") {
      queryParams.append("page", params.page.toString());
    }
    if (typeof params.itemsPerPage === "number") {
      queryParams.append("per_page", params.itemsPerPage.toString());
    }

    const response = await fetch(`${API_URL}/tasks/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch tasks",
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

interface TaskResponse {
  success: boolean;
  data?: Task;
  error?: string;
}

export async function getTask(id: string): Promise<TaskResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch task",
    };
  }
}

export async function createTask(
  taskData: Omit<Task, "id" | "created_at" | "updated_at" | "completed_at">
): Promise<TaskResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/tasks/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create task",
    };
  }
}

export async function updateTask(id: string, taskData: Omit<Task, "created_at" | "updated_at">): Promise<TaskResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update task",
    };
  }
}

export async function deleteTask(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete task",
    };
  }
}
