import { act, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { triggerIntersection } from "@test/support/intersectionObserver";
import { setMediaQueryMatches } from "@test/support/matchMedia";
import { FactoryArt } from "@/features/home/FactoryArt/FactoryArt";
import { reducedMotionQuery } from "@/lib/motion/reducedMotion";

const namedFactorySvg = '<svg viewBox="0 0 1790 1407"><g id="grey-truck"></g></svg>';

function renderFactory() {
  const result = render(<FactoryArt className="factory" />);
  const frame = result.container.firstElementChild as HTMLElement;
  return { ...result, frame };
}

describe("FactoryArt", () => {
  const fetchSvg = vi.fn();

  beforeEach(() => {
    fetchSvg.mockResolvedValue({ ok: true, text: () => Promise.resolve(namedFactorySvg) });
    vi.stubGlobal("fetch", fetchSvg);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchSvg.mockReset();
  });

  it("shows the static factory image until it first comes on screen", () => {
    const { container } = renderFactory();

    expect(container.querySelector("img[src*='factory.svg']")).not.toBeNull();
    expect(fetchSvg).not.toHaveBeenCalled();
  });

  it("swaps in the named SVG and plays while on screen", async () => {
    const { container, frame } = renderFactory();

    act(() => triggerIntersection(frame, true));
    await waitFor(() => expect(container.querySelector("#grey-truck")).not.toBeNull());
    expect(fetchSvg).toHaveBeenCalledWith("/factory.svg");
    expect(container.querySelector("img")).toBeNull();
    expect(frame.hasAttribute("data-playing")).toBe(true);

    act(() => triggerIntersection(frame, false));
    expect(frame.hasAttribute("data-playing")).toBe(false);
    expect(container.querySelector("#grey-truck")).not.toBeNull();
  });

  it("keeps the static image when the SVG cannot be fetched", async () => {
    fetchSvg.mockResolvedValue({ ok: false, text: () => Promise.resolve("") });
    const { container, frame } = renderFactory();

    act(() => triggerIntersection(frame, true));
    await waitFor(() => expect(fetchSvg).toHaveBeenCalled());
    expect(container.querySelector("img[src*='factory.svg']")).not.toBeNull();
  });

  it("keeps the static image and never fetches with reduced motion", () => {
    setMediaQueryMatches(reducedMotionQuery, true);
    const { container, frame } = renderFactory();

    act(() => triggerIntersection(frame, true));
    expect(fetchSvg).not.toHaveBeenCalled();
    expect(container.querySelector("img[src*='factory.svg']")).not.toBeNull();
    expect(frame.hasAttribute("data-playing")).toBe(false);
  });
});
