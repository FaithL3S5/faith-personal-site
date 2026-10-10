import { describe, expect, it } from "vitest";
import { clockPlaceholder, formatJakartaClock, getJakartaParts } from "@/lib/jakartaTime";

describe("jakartaTime", () => {
  it("formats the clock in Asia/Jakarta regardless of the instant's zone", () => {
    expect(formatJakartaClock(new Date("2026-10-11T07:05:09Z"))).toBe("14:05:09 UTC+07:00");
  });

  it("rolls over to midnight as 00, not 24", () => {
    expect(formatJakartaClock(new Date("2026-10-11T17:00:00Z"))).toBe("00:00:00 UTC+07:00");
  });

  it("returns the Jakarta calendar date with a short English month", () => {
    expect(getJakartaParts(new Date("2026-09-30T18:30:00Z"))).toMatchObject({
      day: "1",
      month: "Oct",
      year: "2026",
    });
    expect(getJakartaParts(new Date("2026-09-03T00:00:00Z")).month).toBe("Sep");
  });

  it("keeps the placeholder the same length as a real reading", () => {
    expect(clockPlaceholder).toHaveLength(formatJakartaClock(new Date()).length);
  });
});
