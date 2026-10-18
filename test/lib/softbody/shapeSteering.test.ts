import { describe, expect, it } from "vitest";
import { createShapeSteering, heldShare, stepShapeSteering } from "@/lib/softbody/shapeSteering";
import { createSoftBody, grabNearestPoint, moveGrab, releaseGrab, setRoundness } from "@/lib/softbody/softBody";

const params = {
  roundSeconds: 0.2,
  reformSeconds: 0.5,
  reformAfterStillSeconds: 0.3,
  settleSpeed: 30,
  looseStiffness: 0.03,
  heldStiffness: 0.12,
  heldEaseSeconds: 0.3,
  dropAspect: 1.6,
  swingShare: 0.5,
  swingSmoothing: 0.15,
  maxLean: Math.PI / 3,
  squashPerSpeed: 0.00015,
  maxSquash: 0.25,
  squashSeconds: 0.25,
  squashStiffness: 0.08,
  restFlatten: 0.05,
  floorMemorySeconds: 0.1,
};
const lifted = { gravity: 2400, floorY: 10000 };
const step = 1 / 120;
const ring = Array.from({ length: 16 }, (_, index) => {
  const angle = (index / 16) * Math.PI * 2;
  return { x: Math.cos(angle) * 50, y: Math.sin(angle) * 30 };
});
const noHits = { floor: 0, wall: 0, ceiling: 0 };

function heldBody() {
  const body = createSoftBody(ring, 1, { x: 400, y: 300 });
  grabNearestPoint(body, { x: 400, y: 280 });
  return body;
}

describe("shape steering", () => {
  it("eases into a water drop hanging straight down from the grip", () => {
    const body = heldBody();
    const steering = createShapeSteering();

    const first = stepShapeSteering(steering, body, step, lifted, params);
    expect(first?.stiffness).toBeLessThan(0.04);
    expect(first?.drop?.share).toBeLessThan(0.05);
    expect(first?.drop?.anchorIndex).toBe(body.grab?.index);
    expect(first?.drop?.aspect).toBe(params.dropAspect);

    let goal = first;
    for (let index = 0; index < 40; index++) goal = stepShapeSteering(steering, body, step, lifted, params);
    expect(goal?.stiffness).toBe(params.heldStiffness);
    expect(goal?.drop?.share).toBe(1);
    expect(goal?.drop?.direction.x).toBeCloseTo(0);
    expect(goal?.drop?.direction.y).toBeCloseTo(1);
  });

  it("keeps his shape and the grip gap while held with no room under him", () => {
    const body = heldBody();
    const steering = createShapeSteering();
    const onFloor = { gravity: 2400, floorY: 330 };
    let goal = stepShapeSteering(steering, body, step, onFloor, params);
    for (let index = 0; index < 60; index++) goal = stepShapeSteering(steering, body, step, onFloor, params);

    expect(goal?.drop?.share).toBe(0);
    expect(body.roundness).toBe(0);
    expect(body.grab?.gapShare).toBe(1);
  });

  it("closes the grip gap once he is lifted", () => {
    const body = heldBody();
    const steering = createShapeSteering();
    stepShapeSteering(steering, body, step, lifted, params);
    expect(body.grab?.gapShare).toBe(0);
  });

  it("eases the hold in on grab and back out on release", () => {
    const body = heldBody();
    const steering = createShapeSteering();
    for (let index = 0; index < 40; index++) stepShapeSteering(steering, body, step, lifted, params);
    expect(heldShare(steering)).toBe(1);

    releaseGrab(body);
    stepShapeSteering(steering, body, step, lifted, params);
    expect(heldShare(steering)).toBeGreaterThan(0.9);
    for (let index = 0; index < 40; index++) stepShapeSteering(steering, body, step, lifted, params);
    expect(heldShare(steering)).toBe(0);
  });

  it("lets the drop trail behind a quick swing", () => {
    const body = heldBody();
    const steering = createShapeSteering();
    let goal = stepShapeSteering(steering, body, step, lifted, params);
    for (let index = 1; index <= 20; index++) {
      moveGrab(body, { x: 400 + index * index * 2, y: 280 });
      goal = stepShapeSteering(steering, body, step, lifted, params);
    }
    expect(goal?.drop?.direction.x).toBeLessThan(-0.2);
  });

  it("flattens him against whatever he hits, harder for a harder hit, then lets go", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 300 });
    const steering = createShapeSteering();

    body.impacts = { floor: 0, wall: 1000, ceiling: 0 };
    const softHit = stepShapeSteering(steering, body, step, lifted, params);
    expect(softHit?.flatten?.axis).toEqual({ x: 1, y: 0 });
    expect(softHit?.flatten?.amount).toBeCloseTo(0.15, 2);

    body.impacts = { floor: 0, wall: 0, ceiling: 4000 };
    const hardHit = stepShapeSteering(steering, body, step, lifted, params);
    expect(hardHit?.flatten?.axis).toEqual({ x: 0, y: 1 });
    expect(hardHit?.flatten?.amount).toBe(params.maxSquash);

    body.impacts = noHits;
    let goal = hardHit;
    for (let index = 0; index < 120; index++) goal = stepShapeSteering(steering, body, step, lifted, params);
    expect(goal).toBeUndefined();
  });

  it("balls up quickly once he leaves the floor", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 300 });
    const steering = createShapeSteering();
    for (let index = 0; index < 12; index++) stepShapeSteering(steering, body, step, lifted, params);
    expect(body.roundness).toBeCloseTo((12 * step) / params.roundSeconds);
    for (let index = 0; index < 20; index++) stepShapeSteering(steering, body, step, lifted, params);
    expect(body.roundness).toBe(1);
  });

  it("reforms into his drawn shape only after resting still for a moment", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 300 });
    setRoundness(body, 1);
    body.impacts = { floor: 20, wall: 0, ceiling: 0 };
    const steering = createShapeSteering();

    for (let index = 0; index < 30; index++) stepShapeSteering(steering, body, step, lifted, params);
    expect(body.roundness).toBe(1);
    for (let index = 0; index < 90; index++) stepShapeSteering(steering, body, step, lifted, params);
    expect(body.roundness).toBe(0);
  });

  it("keeps reforming even though reshaping moves him", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 300 });
    setRoundness(body, 1);
    body.impacts = { floor: 20, wall: 0, ceiling: 0 };
    const steering = createShapeSteering();
    for (let index = 0; index < 40; index++) stepShapeSteering(steering, body, step, lifted, params);
    body.lastStep.forEach((point) => (point.x -= 5));

    stepShapeSteering(steering, body, step, lifted, params);
    expect(steering.stillFor).toBeGreaterThan(params.reformAfterStillSeconds);
  });

  it("sits a little flatter while resting on the floor", () => {
    const body = createSoftBody(ring, 1, { x: 400, y: 300 });
    const steering = createShapeSteering();
    body.impacts = { floor: 20, wall: 0, ceiling: 0 };

    const goal = stepShapeSteering(steering, body, step, lifted, params);
    expect(goal).toEqual({ flatten: { axis: { x: 0, y: 1 }, amount: params.restFlatten } });
  });
});
