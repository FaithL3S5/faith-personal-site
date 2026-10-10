import { describe, expect, it } from "vitest";
import { formatBuildStamp } from "@/lib/buildInfo";

describe("formatBuildStamp", () => {
  it("shortens the hash and adds the Jakarta deploy date and time", () => {
    expect(formatBuildStamp("a1b2c3d4e5f6", "2026-10-11T07:05:00Z")).toBe(
      "a1b2c3d, deployed 11 Oct 2026, 14:05",
    );
  });

  it("falls back to local when no hash is known", () => {
    expect(formatBuildStamp(undefined, "2026-10-11T07:05:00Z")).toBe(
      "local, deployed 11 Oct 2026, 14:05",
    );
  });

  it("drops the date when the build time is missing or invalid", () => {
    expect(formatBuildStamp("a1b2c3d4", undefined)).toBe("a1b2c3d");
    expect(formatBuildStamp("a1b2c3d4", "not a date")).toBe("a1b2c3d");
  });
});
