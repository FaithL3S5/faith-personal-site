import { describe, expect, it } from "vitest";
import {
  bindOutline,
  createEarChain,
  interpolatedChain,
  skinOutline,
  stepEarChain,
  type EarBase,
} from "@/lib/softbody/earChain";

const params = { pinnedPoints: 2, baseStiffness: 3000, tipStiffness: 1200, damping: 0.95, iterations: 3 };
const step = 1 / 120;
const root = { x: 0, y: 0 };
const tip = { x: 0, y: -100 };
const atRest: EarBase = { position: { x: 200, y: 200 }, rotation: 0 };

function run(chain: ReturnType<typeof createEarChain>, base: EarBase, steps: number) {
  const tipXs: number[] = [];
  for (let index = 0; index < steps; index++) {
    stepEarChain(chain, base, step, params);
    tipXs.push(chain.positions.at(-1)?.x ?? 0);
  }
  return tipXs;
}

describe("ear chain", () => {
  it("keeps its lower part rigidly attached to the body", () => {
    const chain = createEarChain(root, tip, 1, 4, atRest);
    run(chain, { position: { x: 260, y: 180 }, rotation: 0.3 }, 3);
    expect(chain.positions[0]).toEqual({ x: 260, y: 180 });
    expect(chain.positions[1].x).toBeCloseTo(260 + 25 * Math.sin(0.3));
    expect(chain.positions[1].y).toBeCloseTo(180 - 25 * Math.cos(0.3));
  });

  it("lags behind when the body jumps sideways, then overshoots and settles", () => {
    const chain = createEarChain(root, tip, 1, 4, atRest);
    const moved: EarBase = { position: { x: 260, y: 200 }, rotation: 0 };
    const tipXs = run(chain, moved, 480);

    expect(tipXs[0]).toBeLessThan(260);
    expect(Math.max(...tipXs)).toBeGreaterThan(260);
    expect(Math.abs((tipXs.at(-1) ?? 0) - 260)).toBeLessThan(1);
  });

  it("keeps each segment close to its length while swinging", () => {
    const chain = createEarChain(root, tip, 1, 4, atRest);
    run(chain, { position: { x: 400, y: 100 }, rotation: 1 }, 20);
    for (let index = 0; index < chain.positions.length - 1; index++) {
      const start = chain.positions[index];
      const end = chain.positions[index + 1];
      const stretch = Math.hypot(end.x - start.x, end.y - start.y) / chain.segmentLength;
      expect(stretch).toBeGreaterThan(0.9);
      expect(stretch).toBeLessThan(1.1);
    }
  });

  it("pushes the base of the outline further into the body", () => {
    const [below, above] = bindOutline([{ x: 0, y: 10 }, { x: 0, y: -10 }], root, tip, 1, 12);
    expect(below.along).toBe(-22);
    expect(above.along).toBe(10);
  });

  it("also pushes in base corners that sit just above the root", () => {
    const outline = [{ x: 0, y: -1 }, { x: 0, y: -5 }];
    const [corner, side] = bindOutline(outline, root, tip, 1, 12, 2);
    expect(corner.along).toBe(-11);
    expect(side.along).toBe(5);
  });

  it("wraps the ear outline around the chain, matching the drawing at rest", () => {
    const outline = [
      { x: -10, y: 5 },
      { x: -10, y: -100 },
      { x: 10, y: -100 },
      { x: 10, y: 5 },
    ];
    const chain = createEarChain(root, tip, 1, 4, atRest);
    const skinned = skinOutline(interpolatedChain(chain, 1), bindOutline(outline, root, tip, 1), chain.segmentLength);

    skinned.forEach((point, index) => {
      expect(point.x).toBeCloseTo(outline[index].x + 200);
      expect(point.y).toBeCloseTo(outline[index].y + 200);
    });
  });
});
