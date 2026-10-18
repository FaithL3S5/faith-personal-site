import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useFixedStepLoop } from "@/hooks/useFixedStepLoop";

let frameCallbacks: FrameRequestCallback[] = [];

function runFrame(time: number) {
  const callbacks = frameCallbacks;
  frameCallbacks = [];
  callbacks.forEach((callback) => callback(time));
}

describe("useFixedStepLoop", () => {
  beforeEach(() => {
    frameCallbacks = [];
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      frameCallbacks.push(callback);
      return frameCallbacks.length;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {
      frameCallbacks = [];
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("runs fixed steps for the time that passed, then draws once per frame", () => {
    const step = vi.fn();
    const render = vi.fn();
    renderHook(() => useFixedStepLoop({ stepsPerSecond: 120, maxStepsPerFrame: 8, isRunning: true, step, render }));

    runFrame(0);
    runFrame(50);

    expect(step).toHaveBeenCalledTimes(6);
    expect(step).toHaveBeenCalledWith(1 / 120);
    expect(render).toHaveBeenCalledTimes(2);
    expect(render.mock.calls[1][0]).toBeGreaterThanOrEqual(0);
    expect(render.mock.calls[1][0]).toBeLessThanOrEqual(1);
  });

  it("does nothing while not running and stops when unmounted", () => {
    const step = vi.fn();
    const render = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ isRunning }) => useFixedStepLoop({ stepsPerSecond: 120, maxStepsPerFrame: 8, isRunning, step, render }),
      { initialProps: { isRunning: false } },
    );
    expect(frameCallbacks).toHaveLength(0);

    rerender({ isRunning: true });
    expect(frameCallbacks).toHaveLength(1);

    unmount();
    expect(frameCallbacks).toHaveLength(0);
  });
});
