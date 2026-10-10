import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stack } from "@/features/home/Stack/Stack";

describe("Stack", () => {
  it("renders every tier with its tools", () => {
    render(<Stack />);

    const tierHeadings = screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent);
    expect(tierHeadings).toEqual([
      "Backend",
      "Frontend",
      "Data",
      "Queues and jobs",
      "Also worked with",
      "Learning",
    ]);

    const learningList = screen.getAllByRole("list").at(-1) as HTMLElement;
    expect(within(learningList).getByText("Go")).toBeTruthy();
  });
});
