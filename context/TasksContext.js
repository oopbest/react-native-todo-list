import { createContext, useContext } from "react";
import useTasks from "../hooks/useTasks.js";

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const taskManager = useTasks();

  return (
    <TasksContext.Provider value={taskManager}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasksContext() {
  const context = useContext(TasksContext);

  if (context === null) {
    throw new Error("useTasksContext must be used inside TasksProvider");
  }

  return context;
}
