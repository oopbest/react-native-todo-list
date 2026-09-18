import { useState, useEffect } from "react";
import {
  loadTasksFromStorage,
  saveTasksToStorage,
} from "../storage/taskStorage.js";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveAttempt, setSaveAttempt] = useState(0);

  // Load tasks
  useEffect(() => {
    async function loadTasks() {
      setLoadError(null);
      setIsLoaded(false);

      try {
        const loadedTasks = await loadTasksFromStorage();
        setTasks(loadedTasks);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading tasks:", error);
        setLoadError("Unable to load your tasks. Please try again.");
      }
    }

    loadTasks();
  }, [loadAttempt]);

  // Save tasks
  useEffect(() => {
    if (!isLoaded) return; // Don't attempt to save tasks if they haven't been loaded

    let isActive = true;

    async function saveTasks() {
      setSaveStatus("saving");

      try {
        await saveTasksToStorage(tasks);

        if (isActive) {
          setSaveStatus("saved");
        }
      } catch (error) {
        console.error("Error saving tasks:", error);

        if (isActive) {
          setSaveStatus("error");
        }
      }
    }

    saveTasks();

    return () => {
      isActive = false;
    };
  }, [tasks, isLoaded, saveAttempt]);

  function retryLoad() {
    setLoadAttempt((previous) => previous + 1);
  }

  function retrySave() {
    setSaveAttempt((previous) => previous + 1);
  }

  function handleToggle(taskId) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function handleDeleteTask(taskId) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  }

  function handleRenameTask(taskId, newTitle) {
    const title = newTitle.trim();
    if (!title) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, title } : task)),
    );
  }

  function addTask(newTaskTitle) {
    const title = newTaskTitle.trim();
    if (!title) return;

    setTasks((prevTasks) => {
      const highestId =
        prevTasks.length > 0
          ? Math.max(...prevTasks.map((task) => task.id))
          : 0;

      const newTask = {
        id: highestId + 1,
        title,
        completed: false,
      };
      return [...prevTasks, newTask];
    });
  }

  return {
    tasks,
    isLoaded,
    loadError,
    saveStatus,
    retryLoad,
    retrySave,
    handleToggle,
    handleDeleteTask,
    handleRenameTask,
    addTask,
  };
}
