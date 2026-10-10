import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setMediaQueryMatches } from "@test/support/matchMedia";
import { Typer } from "@/features/error/Typer/Typer";
import { reducedMotionQuery } from "@/lib/motion/reducedMotion";

function typedText(container: HTMLElement) {
  return container.querySelector("[aria-hidden='true']")?.textContent;
}

describe("Typer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("types the value from 300ms at 45ms per character", () => {
    const { container } = render(<Typer value="/abc" />);
    expect(screen.getByText("/abc", { ignore: "[aria-hidden='true']" })).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(typedText(container)).toBe("");

    act(() => {
      vi.advanceTimersByTime(300 + 45 * 2);
    });
    expect(typedText(container)).toBe("/a");

    act(() => {
      vi.advanceTimersByTime(45 * 2);
    });
    expect(typedText(container)).toBe("/abc");
  });

  it("truncates long values in the middle but keeps the full value accessible", () => {
    const longPath = `/very${"-long".repeat(20)}`;
    const { container } = render(<Typer value={longPath} />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect([...(typedText(container) ?? "")]).toHaveLength(48);
    expect(screen.getByText(longPath, { ignore: "[aria-hidden='true']" })).toBeTruthy();
  });

  it("shows the full value straight away with reduced motion", () => {
    setMediaQueryMatches(reducedMotionQuery, true);
    const { container } = render(<Typer value="unavailable" />);

    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(typedText(container)).toBe("unavailable");
  });
});
