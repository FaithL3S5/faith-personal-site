import { act, fireEvent, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useMenu } from "@/hooks/useMenu";

describe("useMenu", () => {
  it("toggles open and closed", () => {
    const { result } = renderHook(() => useMenu());

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });

  it("closes on Escape and ignores other keys", () => {
    const { result } = renderHook(() => useMenu());
    act(() => result.current.toggle());

    fireEvent.keyDown(document, { key: "Enter" });
    expect(result.current.isOpen).toBe(true);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(result.current.isOpen).toBe(false);
  });

  it("closes on request", () => {
    const { result } = renderHook(() => useMenu());
    act(() => result.current.toggle());
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });
});
