import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLiveClock } from "@/hooks/useLiveClock";

function setVisibility(visibilityState: DocumentVisibilityState) {
  vi.spyOn(document, "visibilityState", "get").mockReturnValue(visibilityState);
  document.dispatchEvent(new Event("visibilitychange"));
}

describe("useLiveClock", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-11T07:05:09.400Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows Jakarta time and ticks on the second boundary", () => {
    const { result } = renderHook(() => useLiveClock());
    expect(result.current).toBe("14:05:09 UTC+07:00");

    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(result.current).toBe("14:05:10 UTC+07:00");
  });

  it("stops while the tab is hidden and resyncs on return", () => {
    const { result, unmount } = renderHook(() => useLiveClock());

    act(() => setVisibility("hidden"));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current).toBe("14:05:09 UTC+07:00");

    act(() => setVisibility("visible"));
    expect(result.current).toBe("14:05:14 UTC+07:00");
    unmount();
  });
});
