export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export type FilterStatus = "all" | "completed" | "pending";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export type RootStackParamList = {
  TaskList: undefined;
  TaskDetails: { taskId: number };
};
