import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usePageWeight } from "@/hooks/usePageWeight";
import { pageWeightPlaceholder } from "@/lib/pageWeight";

const entries = [{ encodedBodySize: 51_200 }] as unknown as PerformanceEntryList;

describe("usePageWeight", () => {
  it("measures straight away once the page has loaded", () => {
    vi.spyOn(document, "readyState", "get").mockReturnValue("complete");
    vi.spyOn(performance, "getEntriesByType").mockReturnValue(entries);

    const { result } = renderHook(() => usePageWeight());

    expect(result.current).toBe("100 KB");
  });

  it("shows the placeholder until the load event", () => {
    vi.spyOn(document, "readyState", "get").mockReturnValue("interactive");
    vi.spyOn(performance, "getEntriesByType").mockReturnValue(entries);

    const { result, unmount } = renderHook(() => usePageWeight());
    expect(result.current).toBe(pageWeightPlaceholder);

    act(() => {
      window.dispatchEvent(new Event("load"));
    });
    expect(result.current).toBe("100 KB");
    unmount();
  });
});
