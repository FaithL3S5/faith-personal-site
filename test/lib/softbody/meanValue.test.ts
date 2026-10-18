import { describe, expect, it } from "vitest";
import { meanValueWeights, pinnedPoint } from "@/lib/softbody/meanValue";

const ring = Array.from({ length: 16 }, (_, index) => {
  const angle = (index / 16) * Math.PI * 2;
  return { x: Math.cos(angle) * 50, y: Math.sin(angle) * 30 };
});
const inside = { x: -20, y: 8 };

describe("mean value weights", () => {
  it("adds up to one and rebuilds the point from the outline", () => {
    const weights = meanValueWeights(ring, inside);
    expect(weights.reduce((sum, weight) => sum + weight, 0)).toBeCloseTo(1);
    const rebuilt = pinnedPoint(weights, ring);
    expect(rebuilt.x).toBeCloseTo(inside.x);
    expect(rebuilt.y).toBeCloseTo(inside.y);
  });

  it("moves the point along with a stretched and shifted outline", () => {
    const weights = meanValueWeights(ring, inside);
    const stretched = ring.map(({ x, y }) => ({ x: x * 0.6 + 100, y: y * 1.5 - 40 }));
    const moved = pinnedPoint(weights, stretched);
    expect(moved.x).toBeCloseTo(inside.x * 0.6 + 100);
    expect(moved.y).toBeCloseTo(inside.y * 1.5 - 40);
  });
});
