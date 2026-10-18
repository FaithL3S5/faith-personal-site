import { describe, expect, it } from "vitest";
import { heldLookOffset } from "@/features/jelly/JellyFace/faceTransforms";

const look = { followShare: 0.5, reach: { left: 60, right: 60, up: 60, down: 60 } };
const restCentroid = { x: 1000, y: 1000 };
const eyesCenter = { x: 1000, y: 1000 };

describe("face transforms", () => {
  it("looks a little toward the pointer", () => {
    const frame = { centroid: { x: 400, y: 300 }, rotation: 0 };
    const offset = heldLookOffset({ x: 410, y: 300 }, frame, 0.5, restCentroid, eyesCenter, look);
    expect(offset.x).toBeCloseTo(10);
    expect(offset.y).toBeCloseTo(0);
  });

  it("keeps his eyes in a small area however far away the pointer is", () => {
    const frame = { centroid: { x: 400, y: 300 }, rotation: 0 };
    const offset = heldLookOffset({ x: 400, y: -2000 }, frame, 0.5, restCentroid, eyesCenter, look);
    expect(offset.x).toBeCloseTo(0);
    expect(offset.y).toBeCloseTo(-60);
  });

  it("looks the right way while he hangs upside down", () => {
    const frame = { centroid: { x: 400, y: 300 }, rotation: Math.PI };
    const offset = heldLookOffset({ x: 400, y: 200 }, frame, 0.5, restCentroid, eyesCenter, look);
    expect(offset.y).toBeGreaterThan(0);
  });
});
