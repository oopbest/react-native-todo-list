import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import AddTaskForm from "../AddTaskForm";

describe("<AddTaskForm />", () => {
  test("calls onTaskTitleChange when user types in the input", async () => {
    const mockOnChange = jest.fn();
    const mockOnSubmit = jest.fn();

    await render(
      <AddTaskForm
        taskTitle=""
        onTaskTitleChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />,
    );

    // หันไปหาช่องกรอกที่มี placeholder ว่า "Enter a new task"
    const input = screen.getByPlaceholderText("Enter a new task");

    // จำลองผู้ใช้พิมพ์คำว่า "Buy coffee"
    fireEvent.changeText(input, "Buy coffee");

    // ตรวจว่าฟังก์ชัน onChange ถูกเรียกด้วยคำว่า "Buy coffee" หรือไม่
    expect(mockOnChange).toHaveBeenCalledWith("Buy coffee");
  });

  test("calls onSubmit when user presses the Add Task button with valid title", async () => {
    const mockOnChange = jest.fn();
    const mockOnSubmit = jest.fn();

    await render(
      <AddTaskForm
        taskTitle="Buy milk"
        onTaskTitleChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />,
    );

    // หาปุ่มที่มีข้อความ "+ Add Task"
    const button = screen.getByText("+ Add Task");

    // จำลองการกดปุ่ม
    fireEvent.press(button);

    // ตรวจว่าฟังก์ชัน onSubmit ถูกกดเรียกไป 1 ครั้งถ้วน
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});
