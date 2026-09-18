import AsyncStorage from "@react-native-async-storage/async-storage";

const TASKS_STORAGE_KEY = "task-tracker:tasks";
let saveQueue = Promise.resolve();

export async function loadTasksFromStorage() {
  const savedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
  if (savedTasks === null) return [];

  const loadedTasks = JSON.parse(savedTasks); // Convert JSON string back to an array

  if (!isValidTasks(loadedTasks)) {
    throw new Error("Invalid saved tasks format.");
  }

  return loadedTasks;
}

export async function saveTasksToStorage(tasks) {
  const serializedTasks = JSON.stringify(tasks);
  const currentSave = saveQueue.then(() =>
    AsyncStorage.setItem(TASKS_STORAGE_KEY, serializedTasks),
  );

  saveQueue = currentSave.catch(() => {});

  await currentSave;
}

// Helper functions
function isValidTasks(value) {
  if (!Array.isArray(value)) return false;

  const ids = new Set();

  return value.every((task) => {
    if (typeof task !== "object" || task === null) return false;
    if (!Number.isInteger(task.id) || task.id <= 0) return false;
    if (typeof task.title !== "string" || !task.title.trim()) return false;
    if (typeof task.completed !== "boolean") return false;

    if (ids.has(task.id)) return false;

    ids.add(task.id);
    return true;
  });
}
