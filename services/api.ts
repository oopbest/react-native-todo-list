import { Platform } from "react-native";
import type { AuthResponse, PaginatedTasksResponse, Task } from "../types";

// ตั้งค่า Base URL ให้เหมาะกับ Platform ที่รันอยู่
// หากรันบนมือถือจริงผ่าน Expo Go ให้เปลี่ยนเป็น IP เช่น "http://192.168.1.33:8080"
export const API_BASE_URL = Platform.select({
  android: "http://10.0.2.2:8080",
  ios: "http://localhost:8080",
  default: "http://localhost:8080",
});

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData.error ||
      errorData.message ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}

export const api = {
  // Auth
  async register(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(res);
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(res);
  },

  // Tasks
  async getTasks(token: string): Promise<PaginatedTasksResponse> {
    const res = await fetch(`${API_BASE_URL}/tasks?limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<PaginatedTasksResponse>(res);
  },

  async createTask(
    token: string,
    title: string,
    description = "",
  ): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });
    return handleResponse<Task>(res);
  },

  async updateTask(
    token: string,
    id: number,
    data: { title?: string; description?: string; completed?: boolean },
  ): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Task>(res);
  },

  async deleteTask(token: string, id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error(`Failed to delete task ${id}`);
    }
  },
};
