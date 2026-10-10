import { describe, expect, it } from "vitest";
import { gridStepsBetween, nearestCell } from "@/lib/motion/dotRipple";

describe("dotRipple", () => {
  it("finds the cell under the pointer", () => {
    expect(nearestCell(0, 0, 14, 11, 6)).toEqual({ column: 0, row: 0 });
    expect(nearestCell(30, 15, 14, 11, 6)).toEqual({ column: 2, row: 1 });
  });

  it("clamps pointers on the outer edge to the last cell", () => {
    expect(nearestCell(154, 84, 14, 11, 6)).toEqual({ column: 10, row: 5 });
    expect(nearestCell(-3, -3, 14, 11, 6)).toEqual({ column: 0, row: 0 });
  });

  it("measures distance in whole grid steps", () => {
    expect(gridStepsBetween({ column: 0, row: 0 }, { column: 0, row: 0 })).toBe(0);
    expect(gridStepsBetween({ column: 0, row: 0 }, { column: 3, row: 4 })).toBe(5);
    expect(gridStepsBetween({ column: 2, row: 2 }, { column: 3, row: 3 })).toBe(1);
  });
});
