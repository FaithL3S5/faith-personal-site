import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useRequestedPath } from "@/hooks/useRequestedPath";

describe("useRequestedPath", () => {
  it("reads the path the visitor asked for", () => {
    window.history.pushState({}, "", "/missing/page");
    const { result } = renderHook(() => useRequestedPath());
    expect(result.current).toBe("/missing/page");
    window.history.pushState({}, "", "/");
  });
});
