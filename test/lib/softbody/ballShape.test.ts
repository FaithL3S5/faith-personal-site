import { describe, expect, it } from "vitest";
import { blendShape, createBallOffsets } from "@/lib/softbody/ballShape";
import { bestFitRotation } from "@/lib/softbody/rotationFit";
import { signedArea } from "@/lib/softbody/vector";

const ring = Array.from({ length: 16 }, (_, index) => {
  const angle = (index / 16) * Math.PI * 2;
  return { x: Math.cos(angle) * 50, y: Math.sin(angle) * 30 };
});

describe("ball shape", () => {
  it("is a circle with the same area, wound the same way", () => {
    const ball = createBallOffsets(ring);
    const radius = Math.hypot(ball[0].x, ball[0].y);
    ball.forEach((point) => expect(Math.hypot(point.x, point.y)).toBeCloseTo(radius));
    expect(signedArea(ball) / signedArea(ring)).toBeCloseTo(1, 1);
  });

  it("keeps every point at the same angle around his middle as on his drawn shape", () => {
    const ball = createBallOffsets(ring);
    ball.forEach((point, index) => {
      expect(Math.atan2(point.y, point.x)).toBeCloseTo(Math.atan2(ring[index].y, ring[index].x));
    });
    expect(bestFitRotation(ball, ring, { x: 0, y: 0 })).toBeCloseTo(0, 5);
  });

  it("keeps his area all the way through the blend", () => {
    const ball = createBallOffsets(ring);
    for (const roundness of [0, 0.3, 0.5, 0.8, 1]) {
      expect(signedArea(blendShape(ring, ball, roundness))).toBeCloseTo(signedArea(ring));
    }
  });
});
