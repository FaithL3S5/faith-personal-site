import { describe, expect, it } from "vitest";
import {
  cappedRotation,
  chooseTurn,
  createSelfRighting,
  launch,
  plantLanding,
  rememberHeading,
  stepSelfRighting,
  type SelfRighting,
  type SelfRightingPhase,
} from "@/lib/softbody/selfRighting";
import { averageVelocity, createSoftBody, grabNearestPoint, stepSoftBody, type SoftBody } from "@/lib/softbody/softBody";
import { rotate } from "@/lib/softbody/vector";

const bodyParams = {
  gravity: 2400,
  damping: 0.995,
  iterations: 4,
  edgeStiffness: 0.6,
  braceStiffness: 0.04,
  pressureStiffness: 0.5,
  shapeStiffness: 0.03,
  recoveryStiffness: 0.4,
  grabStiffness: 0.35,
  heldSwingDamping: 0.04,
  restitution: 0.25,
  friction: 0.15,
  edgeMargin: 2,
};
const params = {
  tiltThreshold: Math.PI / 2,
  groundTolerance: 1,
  stillSpeed: 8,
  stillSeconds: 0.6,
  pauseSeconds: { min: 0.2, max: 0.5 },
  squeezeSeconds: 0.35,
  squeeze: { top: 0.6, bottom: 0.9, width: 1.15 },
  squeezeStiffness: 0.4,
  jumpHeight: { min: 300, max: 420 },
  extraHeightForHalfTurn: 60,
  takeoffStretch: 0.25,
  headingRecordSpeed: 400,
  landingAirSeconds: 0.15,
  headingShare: 0.5,
  maxSideSpeed: 500,
  rollWithTravelWithin: Math.PI / 6,
  minTravelSpeed: 60,
  alignShare: 1,
  alignStiffness: 0.03,
  landingSeconds: 1,
  landingStiffness: 0.1,
  landingSettleAngle: 0.05,
  maxCorrectionSpeed: Math.PI,
  landingBrake: 0.7,
};
const bounds = { width: 1600, height: 900 };
const world = { floorY: bounds.height - bodyParams.edgeMargin, gravity: bodyParams.gravity, damping: bodyParams.damping };
const step = 1 / 120;
const half = () => 0.5;

const ring = Array.from({ length: 16 }, (_, index) => {
  const angle = (index / 16) * Math.PI * 2;
  return { x: Math.cos(angle) * 50, y: Math.sin(angle) * 30 };
});

function bodyLyingAt(rotation: number): SoftBody {
  const turnedRing = ring.map((point) => rotate(point, rotation));
  const origin = { x: 800, y: world.floorY - Math.max(...turnedRing.map((point) => point.y)) };
  const body = createSoftBody(ring, 1, origin);
  body.positions.forEach((point, index) => {
    point.x = origin.x + turnedRing[index].x;
    point.y = origin.y + turnedRing[index].y;
    body.previous[index] = { ...point };
  });
  stepSoftBody(body, step, bounds, bodyParams);
  return body;
}

function simulate(body: SoftBody, righting: SelfRighting, steps: number, stopAt?: SelfRightingPhase) {
  const phases: SelfRightingPhase[] = [];
  const goals: ReturnType<typeof stepSelfRighting>[] = [];
  let stepsTaken = 0;
  for (; stepsTaken < steps; stepsTaken++) {
    const shapeGoal = stepSelfRighting(righting, body, step, world, params);
    stepSoftBody(body, step, bounds, bodyParams, shapeGoal);
    goals.push(shapeGoal);
    if (phases.at(-1) !== righting.phase) phases.push(righting.phase);
    if (righting.phase === stopAt) break;
  }
  return { phases, goals, stepsTaken };
}

describe("self-righting", () => {
  it("waits, squeezes, jumps, flips, and lands the right side up", () => {
    const body = bodyLyingAt(2.8);
    const righting = createSelfRighting(params, half);
    const { phases } = simulate(body, righting, 720);

    expect(phases).toEqual(["idle", "squeezing", "airborne", "landing", "idle"]);
    expect(Math.abs(body.frame.rotation)).toBeLessThan(0.2);
  });

  it("only squeezes after lying completely still for a while", () => {
    const body = bodyLyingAt(2.8);
    const righting = createSelfRighting(params, () => 0);
    const { stepsTaken } = simulate(body, righting, 600, "squeezing");

    expect(righting.phase).toBe("squeezing");
    expect(stepsTaken * step).toBeGreaterThanOrEqual(params.stillSeconds + params.pauseSeconds.min);
  });

  it("stays put when he only leans", () => {
    const body = bodyLyingAt(1);
    const righting = createSelfRighting(params, half);
    expect(simulate(body, righting, 300).phases).toEqual(["idle"]);
  });

  it("squeezes his floor-side top harder than his bottom, more as the squeeze goes on", () => {
    const body = bodyLyingAt(2.8);
    const righting = createSelfRighting(params, half);
    simulate(body, righting, 600, "squeezing");
    const { goals } = simulate(body, righting, 30, "airborne");
    const squeezes = goals.flatMap((goal) => (goal?.squash ? [goal.squash] : []));

    expect(squeezes.length).toBeGreaterThan(10);
    const last = squeezes.at(-1);
    expect(last?.top).toBeLessThan(last?.bottom ?? 1);
    expect(last?.top).toBeLessThan(squeezes[0].top);
  });

  it("jumps higher or lower from one flip to the next", () => {
    const low = createSelfRighting(params, () => 0);
    const high = createSelfRighting(params, () => 1);
    simulate(bodyLyingAt(2.8), low, 600, "airborne");
    simulate(bodyLyingAt(2.8), high, 600, "airborne");

    expect(high.flightSeconds).toBeGreaterThan(low.flightSeconds);
  });

  it("carries on in the direction he was last travelling", () => {
    const body = bodyLyingAt(2.8);
    const righting = createSelfRighting(params, half);
    righting.heading = -400;
    const startX = body.frame.centroid.x;
    simulate(body, righting, 600);

    expect(body.frame.centroid.x).toBeLessThan(startX - 40);
  });

  it("gives up the flip and forgets his heading the moment he is grabbed", () => {
    const body = bodyLyingAt(2.8);
    const righting = createSelfRighting(params, half);
    righting.heading = 300;
    simulate(body, righting, 600, "squeezing");
    grabNearestPoint(body, body.frame.centroid);

    expect(stepSelfRighting(righting, body, step, world, params)).toBeUndefined();
    expect(righting.phase).toBe("idle");
    expect(righting.heading).toBe(0);
  });
});

describe("correcting his angle", () => {
  it("never asks him to turn faster than the cap allows", () => {
    expect(cappedRotation(-1, 0, 0.1)).toBeCloseTo(-0.9);
    expect(cappedRotation(1, 0, 0.1)).toBeCloseTo(0.9);
    expect(cappedRotation(0.05, 0, 0.1)).toBeCloseTo(0);
  });

  it("goes the short way round past half a turn", () => {
    expect(cappedRotation(3, -3, 0.1)).toBeCloseTo(3.1);
  });

  it("plants himself on landing, losing most of his sideways speed and spin but not his bounce", () => {
    const body = bodyLyingAt(0);
    const centroid = body.frame.centroid;
    body.previous.forEach((point, index) => {
      const current = body.positions[index];
      point.x = current.x - 4 + (current.y - centroid.y) * 0.02;
      point.y = current.y + 3 - (current.x - centroid.x) * 0.02;
    });
    const sidewaysBefore = averageVelocity(body, step).x;
    const bounceBefore = averageVelocity(body, step).y;
    const tipSpeed = (index: number) => body.positions[index].y - body.previous[index].y;
    const spinBefore = tipSpeed(0) - tipSpeed(8);

    plantLanding(body, step, 0.7);
    const after = averageVelocity(body, step);
    expect(after.x).toBeCloseTo(sidewaysBefore * 0.3);
    expect(after.y).toBeCloseTo(bounceBefore);
    expect(tipSpeed(0) - tipSpeed(8)).toBeCloseTo(spinBefore * 0.3);
  });

  it("never snaps him upright after landing his own jump", () => {
    const body = bodyLyingAt(2.8);
    const righting = createSelfRighting(params, half);
    let previous = body.frame.rotation;
    let fastest = 0;
    for (let index = 0; index < 720; index++) {
      const shapeGoal = stepSelfRighting(righting, body, step, world, params);
      stepSoftBody(body, step, bounds, bodyParams, shapeGoal);
      if (righting.phase === "landing") {
        const turn = Math.abs(Math.atan2(Math.sin(body.frame.rotation - previous), Math.cos(body.frame.rotation - previous)));
        fastest = Math.max(fastest, turn / step);
      }
      previous = body.frame.rotation;
    }
    expect(fastest).toBeLessThan(params.maxCorrectionSpeed * 2);
  });
});

describe("choosing the turn", () => {
  it("takes the short way when he is only on his side", () => {
    expect(chooseTurn(2, 300, params)).toBe(-2);
    expect(chooseTurn(-2, -300, params)).toBe(2);
  });

  it("rolls the way he was travelling when nearly upside down", () => {
    expect(chooseTurn(3, -300, params)).toBe(-3);
    expect(chooseTurn(3, 300, params)).toBeCloseTo(Math.PI * 2 - 3);
    expect(chooseTurn(-3, -300, params)).toBeCloseTo(3 - Math.PI * 2);
  });

  it("takes the short way with nowhere to go or only a slight drift", () => {
    expect(chooseTurn(3, 0, params)).toBe(-3);
    expect(chooseTurn(3, 20, params)).toBe(-3);
  });
});

describe("heading and launch", () => {
  it("remembers his sideways speed only after a real hit", () => {
    const body = bodyLyingAt(0);
    const righting = createSelfRighting(params, half);
    body.previous.forEach((point) => (point.x += 2));

    body.impacts = { floor: 50, wall: 0, ceiling: 0 };
    rememberHeading(righting, body, step, params);
    expect(righting.heading).toBe(0);

    body.impacts = { floor: 0, wall: 800, ceiling: 0 };
    rememberHeading(righting, body, step, params);
    expect(righting.heading).toBeCloseTo(-240);
  });

  it("keeps his heading when a hit leaves him barely moving sideways", () => {
    const body = bodyLyingAt(0);
    const righting = createSelfRighting(params, half);
    righting.heading = 300;
    body.previous.forEach((point) => (point.x += 0.1));
    body.impacts = { floor: 0, wall: 800, ceiling: 0 };

    rememberHeading(righting, body, step, params);
    expect(righting.heading).toBe(300);
  });

  it("counts a floor hit only as a landing after some time in the air, not while rocking", () => {
    const body = bodyLyingAt(0);
    const righting = createSelfRighting(params, half);
    body.previous.forEach((point) => (point.x += 2));
    body.impacts = { floor: 800, wall: 0, ceiling: 0 };

    rememberHeading(righting, body, step, params);
    expect(righting.heading).toBe(0);

    righting.airFor = 0.3;
    rememberHeading(righting, body, step, params);
    expect(righting.heading).toBeCloseTo(-240);
  });

  it("adds the jump on top of the speed he already has", () => {
    const body = bodyLyingAt(0);
    body.previous.forEach((point) => (point.x -= 100 * step));
    const before = averageVelocity(body, step);
    launch(body, step, { upwardSpeed: 1000, sideSpeed: 50, spinSpeed: 0, stretch: 0 });

    const after = averageVelocity(body, step);
    expect(before.x).toBeCloseTo(100);
    expect(after.x - before.x).toBeCloseTo(50);
    expect(after.y - before.y).toBeCloseTo(-1000);
  });

  it("launches his bottom side faster so he stretches on takeoff", () => {
    const body = bodyLyingAt(0);
    launch(body, step, { upwardSpeed: 1000, sideSpeed: 0, spinSpeed: 0, stretch: 0.25 });
    const upwardSpeedAt = (index: number) => (body.previous[index].y - body.positions[index].y) / step;
    const bottom = body.restOffsets.findIndex((offset) => offset.y > 25);
    const top = body.restOffsets.findIndex((offset) => offset.y < -25);

    expect(upwardSpeedAt(bottom)).toBeGreaterThan(1200);
    expect(upwardSpeedAt(top)).toBeLessThan(800);
  });
});
