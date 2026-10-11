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

  it("places the factory between the daily tiers and the extra tiers", () => {
    const { container } = render(<Stack />);

    const factory = container.querySelector("img[src*='factory.svg']") as Element;
    const lastDailyTier = screen.getByRole("heading", { name: "Queues and jobs" });
    const firstExtraTier = screen.getByRole("heading", { name: "Also worked with" });
    expect(lastDailyTier.compareDocumentPosition(factory) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(factory.compareDocumentPosition(firstExtraTier) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
