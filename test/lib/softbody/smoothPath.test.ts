import { describe, expect, it } from "vitest";
import { smoothClosedPath } from "@/lib/softbody/smoothPath";

describe("smoothClosedPath", () => {
  it("draws one curve per point and closes the shape", () => {
    const path = smoothClosedPath([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ]);

    expect(path.startsWith("M0,0")).toBe(true);
    expect(path.match(/C/g)).toHaveLength(4);
    expect(path.endsWith("0,0Z")).toBe(true);
  });
});
