import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("Colophon", () => {
  it("shows the build stamp and the page weight placeholder", async () => {
    vi.stubEnv("NEXT_PUBLIC_COMMIT_SHA", "a1b2c3d4e5");
    vi.stubEnv("NEXT_PUBLIC_BUILT_AT", "2026-10-11T07:05:00Z");
    vi.spyOn(document, "readyState", "get").mockReturnValue("loading");
    vi.resetModules();
    const { Colophon } = await import("@/components/layout/Colophon/Colophon");

    render(<Colophon />);

    expect(screen.getByText("a1b2c3d, deployed 11 Oct 2026, 14:05")).toBeTruthy();
    expect(screen.getByText("--- KB")).toBeTruthy();
    vi.unstubAllEnvs();
  });
});
