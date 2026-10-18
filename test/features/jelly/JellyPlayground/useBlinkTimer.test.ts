import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useBlinkTimer } from "@/features/jelly/JellyPlayground/useBlinkTimer";

const playBlink = vi.hoisted(() => vi.fn());
vi.mock("@/hooks/useJellyBlink", () => ({ playBlink }));

describe("useBlinkTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    playBlink.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("blinks every few seconds until unmounted", () => {
    const figure = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const { unmount } = renderHook(() => useBlinkTimer({ current: figure }));

    vi.advanceTimersByTime(6000);
    expect(playBlink).toHaveBeenCalledWith(figure);

    const blinks = playBlink.mock.calls.length;
    unmount();
    vi.advanceTimersByTime(20000);
    expect(playBlink).toHaveBeenCalledTimes(blinks);
  });
});
