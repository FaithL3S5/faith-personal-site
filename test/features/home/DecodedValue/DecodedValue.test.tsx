import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setMediaQueryMatches } from "@test/support/matchMedia";
import { DecodedValue } from "@/features/home/DecodedValue/DecodedValue";
import { hasPlayed, resetPlayedKeys } from "@/lib/motion/playOnce";
import { reducedMotionQuery } from "@/lib/motion/reducedMotion";

describe("DecodedValue", () => {
  beforeEach(() => {
    resetPlayedKeys();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps the real value accessible and starts after its stagger", () => {
    render(<DecodedValue order={2}>Java, TypeScript</DecodedValue>);
    expect(screen.getByText("Java, TypeScript")).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(400 + 2 * 120 - 1);
    });
    expect(hasPlayed("spec-decode-2")).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(hasPlayed("spec-decode-2")).toBe(true);
  });

  it("does not scramble with reduced motion", () => {
    setMediaQueryMatches(reducedMotionQuery, true);
    const { container } = render(<DecodedValue order={0}>Jakarta, Indonesia</DecodedValue>);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(container.querySelector("[aria-hidden='true']")).toBeNull();
    expect(hasPlayed("spec-decode-0")).toBe(false);
  });
});
