import { StrictMode } from "react";
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeroHeadline } from "@/features/home/HeroHeadline/HeroHeadline";
import { headlineGagAttribute } from "@/lib/motion/headlineGag";

function gagText(container: HTMLElement) {
  const layer = container.querySelector("[aria-hidden='true']");
  return [...(layer?.querySelectorAll("[data-text]") ?? [])].map((glyphs) => glyphs.getAttribute("data-text")).join("");
}

describe("HeroHeadline", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.documentElement.removeAttribute(headlineGagAttribute);
  });

  it("keeps the real headline as the accessible heading", () => {
    render(<HeroHeadline className="title" />);
    expect(screen.getByRole("heading", { level: 1, name: "FULL-STACK DEVELOPER" })).toBeTruthy();
  });

  it("keeps the gag letters out of the page text so crawlers never read STUCK", () => {
    document.documentElement.setAttribute(headlineGagAttribute, "");
    const { container } = render(<HeroHeadline className="title" />);
    expect(container.querySelector("[aria-hidden='true']")?.textContent).toBe("");
    expect(container.textContent).not.toContain("STUCK");
  });

  it("corrects FULL-STUCK to FULL-STACK on the armed load, then hands back to the real text", () => {
    document.documentElement.setAttribute(headlineGagAttribute, "");
    const { container } = render(<HeroHeadline className="title" />);
    expect(gagText(container)).toBe("FULL-STUCKDEVELOPER");

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(gagText(container)).toBe("FULL-STCKDEVELOPER");

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(gagText(container)).toBe("FULL-STACKDEVELOPER");

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(document.documentElement.hasAttribute(headlineGagAttribute)).toBe(false);
  });

  it("still plays when strict mode reruns the effect", () => {
    document.documentElement.setAttribute(headlineGagAttribute, "");
    const { container } = render(
      <StrictMode>
        <HeroHeadline className="title" />
      </StrictMode>,
    );

    act(() => {
      vi.advanceTimersByTime(1800);
    });
    expect(gagText(container)).toBe("FULL-STACKDEVELOPER");
    expect(document.documentElement.hasAttribute(headlineGagAttribute)).toBe(true);
  });

  it("does nothing when the gag is not armed", () => {
    const { container } = render(<HeroHeadline className="title" />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(gagText(container)).toBe("FULL-STUCKDEVELOPER");
    expect(document.documentElement.hasAttribute(headlineGagAttribute)).toBe(false);
  });
});
