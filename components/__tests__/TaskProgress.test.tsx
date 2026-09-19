import React from "react";
import { render, screen } from "@testing-library/react-native";
import TaskProgress from "../TaskProgress";

describe("<TaskProgress />", () => {
  test("renders 'Add your first task' when totalCount is 0", async () => {
    // ✨ เติม await หน้า render
    await render(<TaskProgress totalCount={0} completedCount={0} />);

    expect(screen.getByText("Add your first task")).toBeTruthy();
  });

  test("renders correct completed count and percentage", async () => {
    // ✨ เติม await หน้า render
    await render(<TaskProgress totalCount={4} completedCount={2} />);

    expect(screen.getByText("2 / 4 completed · 50%")).toBeTruthy();
  });
});
