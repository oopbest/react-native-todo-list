import { isValidTasks } from "../taskStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadTasksFromStorage, saveTasksToStorage } from "../taskStorage";

describe("isValidTasks", () => {
  // 1. กรณีที่ข้อมูลถูกต้อง
  test("returns true for a valid list of tasks", () => {
    const validTasks = [
      { id: 1, title: "Learn TypeScript", completed: true },
      { id: 2, title: "Write unit tests", completed: false },
    ];
    expect(isValidTasks(validTasks)).toBe(true);
  });

  test("returns true for an empty array", () => {
    expect(isValidTasks([])).toBe(true);
  });

  // 2. กรณีที่ข้อมูลไม่ใช่ Array
  test("returns false for non-array inputs", () => {
    expect(isValidTasks(null)).toBe(false);
    expect(isValidTasks(undefined)).toBe(false);
    expect(isValidTasks("string")).toBe(false);
    expect(isValidTasks({})).toBe(false);
  });

  // 3. กรณีที่ข้อมูลใน Task ผิดรูปแบบ (Edge cases)
  test("returns false if task id is invalid or duplicate", () => {
    // id ติดลบ
    expect(
      isValidTasks([{ id: -1, title: "Invalid id", completed: false }]),
    ).toBe(false);

    // id ซ้ำกัน
    const duplicateIdTasks = [
      { id: 1, title: "Task 1", completed: false },
      { id: 1, title: "Task 2", completed: false },
    ];
    expect(isValidTasks(duplicateIdTasks)).toBe(false);
  });

  test("returns false if title is empty or only whitespace", () => {
    expect(isValidTasks([{ id: 1, title: "", completed: false }])).toBe(false);
    expect(isValidTasks([{ id: 1, title: "   ", completed: false }])).toBe(
      false,
    );
  });
});

describe("loadTasksFromStorage and saveTasksToStorage", () => {
  // ล้าง Storage ก่อนเริ่มเทสแต่ละข้อ
  beforeEach(async () => {
    await AsyncStorage.clear();
  });
  test("returns empty array if nothing is saved in storage", async () => {
    const tasks = await loadTasksFromStorage();
    expect(tasks).toEqual([]);
  });
  test("saves tasks and loads them back correctly", async () => {
    const sampleTasks = [{ id: 1, title: "Task from test", completed: false }];
    // บันทึกลง storage
    await saveTasksToStorage(sampleTasks);
    // โหลดกลับขึ้นมาตรวจสอบ
    const loadedTasks = await loadTasksFromStorage();
    expect(loadedTasks).toEqual(sampleTasks);
  });
  test("throws error when stored data is corrupted or invalid", async () => {
    // แอบใส่ข้อมูลขยะลงไปใน storage ตรงๆ
    await AsyncStorage.setItem(
      "task-tracker:tasks",
      JSON.stringify("invalid json"),
    );
    // loadTasksFromStorage ต้องตรวจจับได้และ throw error ออกมา
    await expect(loadTasksFromStorage()).rejects.toThrow(
      "Invalid saved tasks format.",
    );
  });
});
