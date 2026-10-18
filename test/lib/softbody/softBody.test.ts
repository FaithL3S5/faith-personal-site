import { describe, expect, it } from "vitest";
import {
  averageVelocity,
  createSoftBody,
  dampSwing,
  fastestPointMovement,
  grabNearestPoint,
  hasCrossingEdges,
  interpolatedFrame,
  interpolatedPositions,
  moveGrab,
  releaseGrab,
  setRoundness,
  stepSoftBody,
  surfaceRotation,
} from "@/lib/softbody/softBody";
import { signedArea } from "@/lib/softbody/vector";

const params = {
  gravity: 2400,
  damping: 0.995,
  iterations: 4,
  edgeStiffness: 0.6,
  braceStiffness: 0.04,
  pressureStiffness: 0.5,
  shapeStiffness: 0.06,
  recoveryStiffness: 0.4,
  grabStiffness: 0.35,
  heldSwingDamping: 0.04,
  restitution: 0.25,
  friction: 0.15,
  edgeMargin: 2,
};
const bounds = { width: 800, height: 600 };
const step = 1 / 120;

const ring = Array.from({ length: 16 }, (_, index) => {
  const angle = (index / 16) * Math.PI * 2;
  return { x: Math.cos(angle) * 50, y: Math.sin(angle) * 30 };
});

function simulate(body: ReturnType<typeof createSoftBody>, steps: number) {
  for (let index = 0; index < steps; index++) stepSoftBody(body, step, bounds, params);
}

describe("soft body", () => {
  it("falls and settles on the floor inside the window", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 100 });
    simulate(body, 600);

    for (const point of body.positions) {
      expect(point.y).toBeLessThanOrEqual(bounds.height - params.edgeMargin + 0.001);
      expect(point.x).toBeGreaterThanOrEqual(params.edgeMargin - 0.001);
    }
    expect(Math.max(...body.positions.map((point) => point.y))).toBeGreaterThan(bounds.height - 10);
  });

  it("keeps roughly its area after a hard landing", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 100 });
    simulate(body, 600);
    expect(Math.abs(signedArea(body.positions))).toBeGreaterThan(Math.abs(body.restArea) * 0.85);
  });

  it("follows the pointer while grabbed and keeps moving once released", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 300 });
    expect(grabNearestPoint(body, { x: 400, y: 300 })).toBe(true);

    for (let index = 0; index < 30; index++) {
      moveGrab(body, { x: 400 + index * 8, y: 300 - index * 6 });
      simulate(body, 1);
    }
    const grabbed = body.positions[body.grab?.index ?? 0];
    expect(Math.hypot(grabbed.x - 632, grabbed.y - 126)).toBeLessThan(40);

    releaseGrab(body);
    const before = body.frame.centroid.x;
    simulate(body, 6);
    expect(body.frame.centroid.x).toBeGreaterThan(before);
  });

  it("ignores a grab outside the body", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 300 });
    expect(grabNearestPoint(body, { x: 10, y: 10 })).toBe(false);
    expect(body.grab).toBeNull();
  });

  it("gives the same result for the same inputs", () => {
    const first = createSoftBody(ring, 1, { x: 400, y: 100 });
    const second = createSoftBody(ring, 1, { x: 400, y: 100 });
    simulate(first, 240);
    simulate(second, 240);
    expect(first.positions).toEqual(second.positions);
  });

  it("untangles himself after his outline is folded over itself", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 300 });
    [body.positions[2], body.positions[10]] = [{ ...body.positions[10] }, { ...body.positions[2] }];
    [body.previous[2], body.previous[10]] = [{ ...body.positions[2] }, { ...body.positions[10] }];
    expect(hasCrossingEdges(body.positions)).toBe(true);

    simulate(body, 240);
    expect(hasCrossingEdges(body.positions)).toBe(false);
    expect(body.isTangled).toBe(false);
    expect(Math.sign(signedArea(body.positions))).toBe(Math.sign(body.restArea));
  });

  it("measures how far the surface has turned at a point", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 300 });
    expect(surfaceRotation(body, body.positions, 4)).toBeCloseTo(0);

    const turned = body.positions.map((point) => ({ x: 400 - (point.y - 300), y: 300 + (point.x - 400) }));
    expect(Math.abs(surfaceRotation(body, turned, 4))).toBeCloseTo(Math.PI / 2);
  });

  it("leans toward a shape goal when given one", () => {
    const free = createSoftBody(ring, 1, { x: 400, y: 300 });
    const steered = createSoftBody(ring, 1, { x: 400, y: 300 });
    for (let index = 0; index < 20; index++) {
      stepSoftBody(free, step, bounds, { ...params, gravity: 0 });
      stepSoftBody(steered, step, bounds, { ...params, gravity: 0 }, { stiffness: 0.2, rotation: 1 });
    }
    expect(free.frame.rotation).toBeCloseTo(0);
    expect(steered.frame.rotation).toBeGreaterThan(0.3);
  });

  it("pulls his bottom in more than his top when squashed", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 300 });
    for (let index = 0; index < 30; index++) {
      stepSoftBody(body, step, bounds, { ...params, gravity: 0 }, { stiffness: 0.2, squash: { top: 0.9, bottom: 0.6 } });
    }
    const centreY = body.frame.centroid.y;
    const topReach = centreY - Math.min(...body.positions.map((point) => point.y));
    const bottomReach = Math.max(...body.positions.map((point) => point.y)) - centreY;
    expect(bottomReach).toBeLessThan(topReach);
  });

  it("hangs as a water drop below the grip, without turning sideways", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 300 });
    grabNearestPoint(body, { x: 400, y: 275 });
    const grip = body.grab?.index ?? 0;
    const drop = { anchorIndex: grip, direction: { x: 0, y: 1 }, share: 1, aspect: 1.6 };
    for (let index = 0; index < 240; index++) stepSoftBody(body, step, bounds, params, { stiffness: 0.12, drop });

    const xs = body.positions.map((point) => point.x);
    const ys = body.positions.map((point) => point.y);
    expect((Math.max(...ys) - Math.min(...ys)) / (Math.max(...xs) - Math.min(...xs))).toBeGreaterThan(1.2);
    expect(Math.abs(body.frame.centroid.x - body.positions[grip].x)).toBeLessThan(5);
    expect(Math.abs(body.frame.rotation)).toBeLessThan(0.2);
  });

  it("keeps the gap between the pointer and his outline while held", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 300 });
    grabNearestPoint(body, { x: 400, y: 285 });
    const grip = body.grab?.index ?? 0;
    const gap = body.positions[grip].y - 285;
    for (let index = 0; index < 120; index++) stepSoftBody(body, step, bounds, { ...params, gravity: 0 });
    expect(body.positions[grip].y - 285).toBeCloseTo(gap, 0);
  });

  it("brings the grip onto the pointer once the gap is let go", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 300 });
    grabNearestPoint(body, { x: 400, y: 285 });
    const grip = body.grab?.index ?? 0;
    if (body.grab) body.grab.gapShare = 0;
    for (let index = 0; index < 120; index++) stepSoftBody(body, step, bounds, { ...params, gravity: 0 });
    expect(body.positions[grip].y).toBeCloseTo(285, 0);
  });

  it("flattens toward a shape goal for the moment after a hit", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 300 });
    for (let index = 0; index < 30; index++) {
      stepSoftBody(body, step, bounds, { ...params, gravity: 0 }, { stiffness: 0.12, flatten: { axis: { x: 0, y: 1 }, amount: 0.2 } });
    }
    const height = Math.max(...body.positions.map((point) => point.y)) - Math.min(...body.positions.map((point) => point.y));
    expect(height).toBeLessThan(60 * 0.9);
    expect(Math.abs(body.frame.rotation)).toBeLessThan(0.1);
  });

  it("becomes a ball when fully round, with every remembered length following", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 300 });
    const drawnEdge = body.edgeLengths[0];
    setRoundness(body, 1);
    expect(body.edgeLengths[0]).not.toBeCloseTo(drawnEdge);
    expect(body.braces[0].length).toBeCloseTo(
      Math.hypot(
        body.shapeOffsets[body.braces[0].to].x - body.shapeOffsets[body.braces[0].from].x,
        body.shapeOffsets[body.braces[0].to].y - body.shapeOffsets[body.braces[0].from].y,
      ),
    );
    simulate(body, 1);
    for (let index = 0; index < 180; index++) stepSoftBody(body, step, bounds, { ...params, gravity: 0 });
    const width = Math.max(...body.positions.map((point) => point.x)) - Math.min(...body.positions.map((point) => point.x));
    const height = Math.max(...body.positions.map((point) => point.y)) - Math.min(...body.positions.map((point) => point.y));
    expect(width / height).toBeCloseTo(1, 1);
  });

  it("slows a swing around the grip without slowing the hand", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 300 });
    grabNearestPoint(body, { x: 400, y: 275 });
    const grip = body.grab?.index ?? 0;
    body.previous.forEach((point) => (point.x -= 3));
    dampSwing(body, grip, 0.5);
    body.positions.forEach((point, index) => expect(point.x - body.previous[index].x).toBeCloseTo(3));

    const spinning = createSoftBody(ring, 1, { x: 400, y: 300 });
    const pivot = spinning.positions[grip];
    spinning.previous.forEach((point, index) => {
      const current = spinning.positions[index];
      point.x = current.x + (current.y - pivot.y) * 0.01;
      point.y = current.y - (current.x - pivot.x) * 0.01;
    });
    const before = spinning.positions[6].x - spinning.previous[6].x;
    dampSwing(spinning, grip, 0.5);
    expect(Math.abs(spinning.positions[6].x - spinning.previous[6].x)).toBeCloseTo(Math.abs(before) / 2);
  });

  it("reports how hard he hits the floor and the walls", () => {
    const falling = createSoftBody(ring, 1, { x: 400, y: 100 });
    let hardestFloorHit = 0;
    for (let index = 0; index < 120; index++) {
      stepSoftBody(falling, step, bounds, params);
      hardestFloorHit = Math.max(hardestFloorHit, falling.impacts.floor);
    }
    expect(hardestFloorHit).toBeGreaterThan(1000);
    expect(falling.impacts.wall).toBe(0);

    const thrown = createSoftBody(ring, 1, { x: 700, y: 300 });
    thrown.previous.forEach((point) => (point.x -= 1500 * step));
    let hardestWallHit = 0;
    for (let index = 0; index < 30; index++) {
      stepSoftBody(thrown, step, bounds, { ...params, gravity: 0 });
      hardestWallHit = Math.max(hardestWallHit, thrown.impacts.wall);
    }
    expect(hardestWallHit).toBeGreaterThan(1000);
  });

  it("measures his average velocity and how far his fastest point moved", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 300 });
    body.previous.forEach((point) => (point.x -= 60 * step));
    body.lastStep.forEach((point) => (point.x -= 60 * step));
    body.lastStep[3].y -= 120 * step;

    expect(averageVelocity(body, step).x).toBeCloseTo(60);
    expect(fastestPointMovement(body, step)).toBeCloseTo(Math.hypot(60, 120));
  });

  it("draws in between the last two steps", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 100 });
    simulate(body, 30);
    const halfway = interpolatedPositions(body, 0.5)[0];
    expect(halfway.y).toBeCloseTo((body.lastStep[0].y + body.positions[0].y) / 2);
    expect(interpolatedFrame(body, 1).centroid).toEqual(body.frame.centroid);
  });
});
