import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { setMediaQueryMatches } from "@test/support/matchMedia";
import { WaveBands } from "@/components/layout/WaveBands/WaveBands";
import { reducedMotionQuery } from "@/lib/motion/reducedMotion";

function scrollTo(scrollY: number) {
  Object.defineProperty(window, "scrollY", { value: scrollY, configurable: true });
  fireEvent.scroll(window);
}

async function nextFrame() {
  await act(() => new Promise((resolve) => requestAnimationFrame(resolve)));
}

function wavefronts(container: HTMLElement) {
  return [...container.querySelectorAll("span")].map((band) => parseFloat(band.style.getPropertyValue("--wave-front")));
}

describe("WaveBands", () => {
  it("pours the wave down while scrolling down and pulls it back up while scrolling up", async () => {
    scrollTo(0);
    const { container, unmount } = render(<WaveBands leftClassName="left" rightClassName="right" />);
    const bands = [...container.querySelectorAll("span")];
    expect(bands.every((band) => band.hasAttribute("data-wave-masked"))).toBe(true);
    expect(wavefronts(container)).toEqual([0, 0]);

    scrollTo(200);
    await nextFrame();
    const filledFront = wavefronts(container)[0];
    expect(filledFront).toBeGreaterThan(0);

    scrollTo(100);
    await nextFrame();
    expect(wavefronts(container)[0]).toBeLessThan(filledFront);

    unmount();
    expect(bands.every((band) => !band.hasAttribute("data-wave-masked"))).toBe(true);
  });

  it("shows the whole wave with reduced motion", () => {
    setMediaQueryMatches(reducedMotionQuery, true);
    const { container } = render(<WaveBands leftClassName="left" rightClassName="right" />);
    expect(container.querySelector("[data-wave-masked]")).toBeNull();
  });
});
