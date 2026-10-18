import { describe, expect, it } from "vitest";
import { dropLength, dropOffsets } from "@/lib/softbody/dropShape";
import { signedArea } from "@/lib/softbody/vector";

const count = 24;
const shares = Array.from({ length: count }, (_, index) => index / count);
const area = -6000;
const down = { x: 0, y: 1 };

function extents(points: { x: number; y: number }[]) {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return { width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) };
}

describe("water drop shape", () => {
  it("puts the tip at the grip, as the highest point", () => {
    const drop = dropOffsets(shares, area, { anchorIndex: 5, direction: down, share: 1, aspect: 1.6 });
    expect(Math.min(...drop.map((point) => point.y))).toBeCloseTo(drop[5].y);
  });

  it("is about 1.6 times as long as it is wide, with his area and winding", () => {
    const drop = dropOffsets(shares, area, { anchorIndex: 0, direction: down, share: 1, aspect: 1.6 });
    const { width, height } = extents(drop);
    expect(height / width).toBeCloseTo(1.6, 0);
    expect(signedArea(drop) / area).toBeCloseTo(1, 1);
    expect(height).toBeCloseTo(dropLength(area, 1.6), -1);
  });

  it("hangs whichever way the pull points", () => {
    const sideways = dropOffsets(shares, area, { anchorIndex: 0, direction: { x: 1, y: 0 }, share: 1, aspect: 1.6 });
    expect(Math.min(...sideways.map((point) => point.x))).toBeCloseTo(sideways[0].x);
  });
});
