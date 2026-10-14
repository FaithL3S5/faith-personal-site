import { afterEach, describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("lists the home page, dated by the build", () => {
    vi.stubEnv("NEXT_PUBLIC_BUILT_AT", "2026-10-14T03:00:00.000Z");
    expect(sitemap()).toEqual([
      {
        url: "https://faith.l3s5.dev",
        lastModified: "2026-10-14T03:00:00.000Z",
        changeFrequency: "monthly",
        priority: 1,
      },
    ]);
  });

  it("leaves out the date when the build time is unknown", () => {
    vi.stubEnv("NEXT_PUBLIC_BUILT_AT", "");
    expect(sitemap()[0]).not.toHaveProperty("lastModified");
  });
});
