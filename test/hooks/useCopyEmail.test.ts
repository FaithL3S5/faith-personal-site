import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { copiedDurationMs, useCopyEmail } from "@/hooks/useCopyEmail";

function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
}

describe("useCopyEmail", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("copies the email and resets after the copied duration", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);
    const { result } = renderHook(() => useCopyEmail("hello@example.com"));

    await act(() => result.current.copyEmail());
    expect(writeText).toHaveBeenCalledWith("hello@example.com");
    expect(result.current.isCopied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(copiedDurationMs);
    });
    expect(result.current.isCopied).toBe(false);
  });

  it("restarts the timer when copied again", async () => {
    mockClipboard(vi.fn().mockResolvedValue(undefined));
    const { result } = renderHook(() => useCopyEmail("hello@example.com"));

    await act(() => result.current.copyEmail());
    act(() => {
      vi.advanceTimersByTime(copiedDurationMs - 100);
    });
    await act(() => result.current.copyEmail());
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current.isCopied).toBe(true);
  });

  it("stays idle when the clipboard refuses", async () => {
    mockClipboard(vi.fn().mockRejectedValue(new Error("denied")));
    const { result } = renderHook(() => useCopyEmail("hello@example.com"));

    await act(() => result.current.copyEmail());
    expect(result.current.isCopied).toBe(false);
  });
});
