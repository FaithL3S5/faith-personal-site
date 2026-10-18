import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setMediaQueryMatches } from "@test/support/matchMedia";
import { JellyPlayground } from "@/features/jelly/JellyPlayground/JellyPlayground";
import { reducedMotionQuery } from "@/lib/motion/reducedMotion";

describe("JellyPlayground", () => {
  const requestFrame = vi.fn(() => 1);

  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", requestFrame);
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    requestFrame.mockClear();
    document.documentElement.style.overflow = "";
  });

  it("draws Jelly's body, both ears, and his eyes", () => {
    render(<JellyPlayground />);

    const stage = screen.getByRole("img", { name: /J三LLY, a soft jelly you can drag/ });
    expect(stage.querySelector("path[fill='#fff']")?.getAttribute("d")).toMatch(/^M.+Z$/);
    const ears = [...stage.querySelectorAll(":scope > g:first-child > path")];
    expect(ears).toHaveLength(2);
    ears.forEach((ear) => expect(ear.getAttribute("d")).toMatch(/^M.+Z$/));
    expect(stage.querySelector("[data-jelly-eyes]")).not.toBeNull();
    expect(screen.getByRole("heading", { level: 1, name: "Jelly playground" })).toBeTruthy();
  });

  it("starts with open eyes and keeps the brow knockout ready but unused", () => {
    render(<JellyPlayground />);

    const stage = screen.getByRole("img");
    expect(stage.querySelector("[data-expression]")?.getAttribute("data-expression")).toBe("open");
    expect(stage.querySelector("mask#jelly-brow-knockout")).not.toBeNull();
    const outline = stage.querySelector("path[fill='none'][stroke='#141414']");
    expect(outline?.getAttribute("d")).toMatch(/^M.+Z$/);
    expect(outline?.hasAttribute("mask")).toBe(false);
  });

  it("starts the physics loop and lets him be grabbed", () => {
    render(<JellyPlayground />);
    expect(requestFrame).toHaveBeenCalled();
    expect(screen.getByRole("img").hasAttribute("data-draggable")).toBe(true);
  });

  it("keeps him still and undraggable with reduced motion", () => {
    setMediaQueryMatches(reducedMotionQuery, true);
    render(<JellyPlayground />);

    expect(requestFrame).not.toHaveBeenCalled();
    expect(screen.getByRole("img").hasAttribute("data-draggable")).toBe(false);
  });

  it("locks page scrolling while open and restores it after", () => {
    const { unmount } = render(<JellyPlayground />);
    expect(document.documentElement.style.overflow).toBe("hidden");

    unmount();
    expect(document.documentElement.style.overflow).toBe("");
  });
});
