import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LiveClock } from "@/features/home/LiveClock/LiveClock";

describe("LiveClock", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-11T07:05:09Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("puts each of the six digits in a fixed slot and keeps the suffix as text", () => {
    const { container } = render(<LiveClock />);

    const digits = [...container.querySelectorAll("[data-clock-digit]")].map((slot) => slot.textContent);
    expect(digits).toEqual(["1", "4", "0", "5", "0", "9"]);
    expect(container.textContent).toBe("14:05:09 UTC+07:00");
  });
});
