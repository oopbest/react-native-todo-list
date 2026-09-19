import { useState, useEffect } from "react";
import {
  loadTasksFromStorage,
  saveTasksToStorage,
} from "../storage/taskStorage";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import type { Task, SaveStatus } from "../types";

export default function useTasks() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveAttempt, setSaveAttempt] = useState(0);

  // 1. โหลดข้อมูล (Cache-First + Cloud Sync)
  useEffect(() => {
    let isActive = true;

    async function loadTasks() {
      setLoadError(null);
      setIsLoaded(false);

      try {
        // ดึงจาก Local Storage ขึ้นมาแสดงก่อนทันที
        const localTasks = await loadTasksFromStorage();
        if (isActive && localTasks.length > 0) {
          setTasks(localTasks);
        }

        // ถ้าล็อกอินอยู่ ให้ดึงข้อมูลล่าสุดจาก Go Server มาซิงก์
        if (token) {
          const response = await api.getTasks(token);
          if (isActive) {
            setTasks(response.data || []);
            await saveTasksToStorage(response.data || []);
          }
        }

        if (isActive) {
          setIsLoaded(true);
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
        if (isActive) {
          setIsLoaded(true);
          // หากออฟไลน์ แต่มีข้อมูลเก่าในเครื่อง ก็ยังให้ใช้งานต่อได้
          setLoadError("Offline mode: could not sync with server.");
        }
      }
    }

    loadTasks();

    return () => {
      isActive = false;
    };
  }, [loadAttempt, token]);

  function retryLoad() {
    setLoadAttempt((previous) => previous + 1);
  }

  function retrySave() {
    setSaveAttempt((previous) => previous + 1);
  }

  // 2. เพิ่มงานใหม่ (ส่งขึ้น Go Server)
  async function addTask(newTaskTitle: string) {
    const title = newTaskTitle.trim();
    if (!title) return;

    setSaveStatus("saving");

    try {
      if (token) {
        // ยิงสร้างงานบน Go Server
        const createdTask = await api.createTask(token, title);
        setTasks((prevTasks) => {
          const updated = [...prevTasks, createdTask];
          saveTasksToStorage(updated);
          return updated;
        });
      } else {
        // Fallback ทำงานแบบ Local ถ้าไม่มี Token
        setTasks((prevTasks) => {
          const highestId =
            prevTasks.length > 0
              ? Math.max(...prevTasks.map((task) => task.id))
              : 0;
          const newTask = { id: highestId + 1, title, completed: false };
          const updated = [...prevTasks, newTask];
          saveTasksToStorage(updated);
          return updated;
        });
      }
      setSaveStatus("saved");
    } catch (error) {
      console.error("Failed to add task to server:", error);
      setSaveStatus("error");
    }
  }

  // 3. สลับสถานะ เสร็จ / ยังไม่เสร็จ (PUT /tasks/:id)
  async function handleToggle(taskId: number) {
    const targetTask = tasks.find((task) => task.id === taskId);
    if (!targetTask) return;

    const newCompleted = !targetTask.completed;

    // Optimistic Update: ปรับ UI ทันที
    setTasks((prevTasks) => {
      const updated = prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: newCompleted } : task,
      );
      saveTasksToStorage(updated);
      return updated;
    });

    if (token) {
      try {
        setSaveStatus("saving");
        await api.updateTask(token, taskId, {
          title: targetTask.title,
          completed: newCompleted,
        });
        setSaveStatus("saved");
      } catch (error) {
        console.error("Failed to update task on server:", error);
        setSaveStatus("error");
      }
    }
  }

  // 4. แก้ไขชื่องาน (PUT /tasks/:id)
  async function handleRenameTask(taskId: number, newTitle: string) {
    const title = newTitle.trim();
    if (!title) return;

    const targetTask = tasks.find((task) => task.id === taskId);
    if (!targetTask) return;

    setTasks((prevTasks) => {
      const updated = prevTasks.map((task) =>
        task.id === taskId ? { ...task, title } : task,
      );
      saveTasksToStorage(updated);
      return updated;
    });

    if (token) {
      try {
        setSaveStatus("saving");
        await api.updateTask(token, taskId, {
          title,
          completed: targetTask.completed,
        });
        setSaveStatus("saved");
      } catch (error) {
        console.error("Failed to rename task on server:", error);
        setSaveStatus("error");
      }
    }
  }

  // 5. ลบงาน (DELETE /tasks/:id)
  async function handleDeleteTask(taskId: number) {
    setTasks((prevTasks) => {
      const updated = prevTasks.filter((task) => task.id !== taskId);
      saveTasksToStorage(updated);
      return updated;
    });

    if (token) {
      try {
        setSaveStatus("saving");
        await api.deleteTask(token, taskId);
        setSaveStatus("saved");
      } catch (error) {
        console.error("Failed to delete task on server:", error);
        setSaveStatus("error");
      }
    }
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
