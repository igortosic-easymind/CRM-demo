"use server";

import { cookies } from "next/headers";
import { Client, CreateClientData, UpdateClientData, PaginationState } from "@/types";

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

interface ListClientsParams {
  lead?: "cold" | "warm" | "hot";
  search?: string;
  page?: number;
  itemsPerPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface ListClientsResponse {
  success: boolean;
  data: Client[];
  pagination: PaginationState;
  error?: string;
}

export async function listClients(params: ListClientsParams = {}): Promise<ListClientsResponse> {
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
    if (params.lead) {
      queryParams.append("lead", params.lead);
    }
    if (params.search) {
      queryParams.append("search", params.search);
    }
    if (typeof params.page === "number") {
      queryParams.append("page", params.page.toString());
    }
    if (typeof params.itemsPerPage === "number") {
      queryParams.append("per_page", params.itemsPerPage.toString());
    }

    const response = await fetch(`${API_URL}/clients/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`, {
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
      error: error instanceof Error ? error.message : "Failed to fetch clients",
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

interface ClientResponse {
  success: boolean;
  data?: Client;
  error?: string;
}

export async function getClient(id: string): Promise<ClientResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/clients/${id}`, {
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
      error: error instanceof Error ? error.message : "Failed to fetch client",
    };
  }
}

export async function createClient(clientData: CreateClientData): Promise<ClientResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/clients/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create client",
    };
  }
}

export async function updateClient(id: string, clientData: UpdateClientData): Promise<ClientResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/clients/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update client",
    };
  }
}

export async function deleteClient(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/clients/${id}`, {
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
      error: error instanceof Error ? error.message : "Failed to delete client",
    };
  }
}
