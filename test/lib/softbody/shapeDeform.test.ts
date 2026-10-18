import { describe, expect, it } from "vitest";
import { flattenAlong } from "@/lib/softbody/shapeDeform";
import { signedArea } from "@/lib/softbody/vector";

const square = [
  { x: -10, y: -10 },
  { x: 10, y: -10 },
  { x: 10, y: 10 },
  { x: -10, y: 10 },
];
const down = { x: 0, y: 1 };

describe("shape deformation", () => {
  it("flattens along a surface and widens across it, keeping the area", () => {
    const flat = flattenAlong(square, { axis: down, amount: 0.2 });
    expect(flat[2].y).toBeCloseTo(8);
    expect(flat[2].x).toBeCloseTo(12.5);
    expect(signedArea(flat)).toBeCloseTo(signedArea(square));
  });

  it("flattens against a wall sideways", () => {
    const flat = flattenAlong(square, { axis: { x: 1, y: 0 }, amount: 0.2 });
    expect(flat[1].x).toBeCloseTo(8);
    expect(flat[1].y).toBeCloseTo(-12.5);
  });

});
