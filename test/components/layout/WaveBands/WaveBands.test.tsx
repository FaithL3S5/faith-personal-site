import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { setMediaQueryMatches } from "@test/support/matchMedia";
import { WaveBands } from "@/components/layout/WaveBands/WaveBands";
import { reducedMotionQuery } from "@/lib/motion/reducedMotion";

function setScrollHeight(scrollHeight: number) {
  Object.defineProperty(document.documentElement, "scrollHeight", { value: scrollHeight, configurable: true });
}

async function scrollTo(scrollY: number) {
  Object.defineProperty(window, "scrollY", { value: scrollY, configurable: true });
  fireEvent.scroll(window);
  await act(() => new Promise((resolve) => requestAnimationFrame(resolve)));
}

function firstWaveFront(container: HTMLElement) {
  return parseFloat((container.querySelector("span") as HTMLElement).style.getPropertyValue("--wave-front"));
}

describe("WaveBands", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  });

  afterEach(() => {
    setScrollHeight(0);
  });

  it("is empty at the top, pours in while scrolling down, and drains at the same pace going up", async () => {
    setScrollHeight(5000);
    const { container, unmount } = render(<WaveBands leftClassName="left" rightClassName="right" />);
    const bands = [...container.querySelectorAll("span")];
    expect(bands.every((band) => band.hasAttribute("data-wave-masked"))).toBe(true);
    expect(firstWaveFront(container)).toBe(0);

    await scrollTo(300);
    expect(firstWaveFront(container)).toBe(400);

    await scrollTo(0);
    expect(firstWaveFront(container)).toBe(0);

    unmount();
    expect(bands.every((band) => !band.hasAttribute("data-wave-masked"))).toBe(true);
  });

  it("is drawn straight away when the page loads part way down", () => {
    setScrollHeight(5000);
    Object.defineProperty(window, "scrollY", { value: 2000, configurable: true });
    const { container } = render(<WaveBands leftClassName="left" rightClassName="right" />);
    expect(firstWaveFront(container)).toBe(800);
  });

  it("shows the whole wave with reduced motion", () => {
    setMediaQueryMatches(reducedMotionQuery, true);
    const { container } = render(<WaveBands leftClassName="left" rightClassName="right" />);
    expect(container.querySelector("[data-wave-masked]")).toBeNull();
  });
});
