import { describe, expect, it } from "vitest";
import { truncateMiddle } from "@/lib/truncateMiddle";

describe("truncateMiddle", () => {
  it("leaves values at or under the limit alone", () => {
    const exactly48 = "a".repeat(48);
    expect(truncateMiddle("/missing", 48)).toBe("/missing");
    expect(truncateMiddle(exactly48, 48)).toBe(exactly48);
  });

  it("keeps the start and end of long values around an ellipsis", () => {
    const truncated = truncateMiddle(`/start${"x".repeat(60)}end`, 48);
    expect([...truncated]).toHaveLength(48);
    expect(truncated.startsWith("/start")).toBe(true);
    expect(truncated.endsWith("end")).toBe(true);
    expect(truncated).toContain("…");
  });
});
