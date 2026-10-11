import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { triggerIntersection } from "@test/support/intersectionObserver";
import { useNearScreen } from "@/hooks/useNearScreen";

describe("useNearScreen", () => {
  it("turns true once the target nears the screen and stays true", () => {
    const target = document.createElement("div");
    const { result } = renderHook(() => useNearScreen({ current: target }, "100% 0px"));
    expect(result.current).toBe(false);

    act(() => triggerIntersection(target, false));
    expect(result.current).toBe(false);

    act(() => triggerIntersection(target, true));
    expect(result.current).toBe(true);

    act(() => triggerIntersection(target, false));
    expect(result.current).toBe(true);
  });
});
