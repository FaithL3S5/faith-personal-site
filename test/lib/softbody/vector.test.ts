import { describe, expect, it } from "vitest";
import { centroidOf, containsPoint, lerpAngle, perimeterOf, rotate, signedArea } from "@/lib/softbody/vector";

const square = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 10, y: 10 },
  { x: 0, y: 10 },
];

describe("vector helpers", () => {
  it("measures a polygon", () => {
    expect(Math.abs(signedArea(square))).toBe(100);
    expect(centroidOf(square)).toEqual({ x: 5, y: 5 });
    expect(perimeterOf(square)).toBe(40);
  });

  it("knows whether a point is inside a polygon", () => {
    expect(containsPoint(square, { x: 5, y: 5 })).toBe(true);
    expect(containsPoint(square, { x: 15, y: 5 })).toBe(false);
  });

  it("rotates a vector", () => {
    const turned = rotate({ x: 1, y: 0 }, Math.PI / 2);
    expect(turned.x).toBeCloseTo(0);
    expect(turned.y).toBeCloseTo(1);
  });

  it("blends angles the short way round", () => {
    expect(lerpAngle(Math.PI - 0.1, -Math.PI + 0.1, 0.5)).toBeCloseTo(Math.PI);
  });
});
