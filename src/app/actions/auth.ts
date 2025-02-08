"use server";

import { cookies } from "next/headers";

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface UserResponse {
  id: string;
  username: string;
  // add other user fields as needed
}

const API_URL = process.env.API_URL || "http://127.0.0.1:8000/api";

export async function login(credentials: LoginCredentials) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data: LoginResponse = await response.json();

    // Set the token in cookies - with await
    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    // Fetch user data
    const userResponse = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData: UserResponse = await userResponse.json();
    return { success: true, user: userData };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to logout",
    };
  }
}
