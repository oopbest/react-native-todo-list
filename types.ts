export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  user_id?: number;
  created_at?: string;
}

export interface PaginatedTasksResponse {
  data: Task[];
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
}

export type FilterStatus = "all" | "completed" | "pending";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  TaskList: undefined;
  TaskDetails: { taskId: number };
};
