import React, { createContext, useContext } from "react";
import useTasks from "../hooks/useTasks";

type TasksContextType = ReturnType<typeof useTasks>;

interface TasksProviderProps {
  children: React.ReactNode;
}

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: TasksProviderProps) {
  const taskManager = useTasks();

  return (
    <TasksContext.Provider value={taskManager}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasksContext(): TasksContextType {
  const context = useContext(TasksContext);

  if (context === null) {
    throw new Error("useTasksContext must be used inside TasksProvider");
  }

  return context;
}
