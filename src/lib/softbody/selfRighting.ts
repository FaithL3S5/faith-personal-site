import { flightOf, launchSpeedFor, spinSpeedFor, spunShare, type Physics } from "./ballistics";
import { averageVelocity, fastestPointMovement, type ShapeGoal, type SoftBody, type Squash } from "./softBody";
import { lerp } from "./vector";

export type Range = { min: number; max: number };

export type SelfRightingParams = {
  tiltThreshold: number;
  groundTolerance: number;
  stillSpeed: number;
  stillSeconds: number;
  pauseSeconds: Range;
  squeezeSeconds: number;
  squeeze: Squash;
  squeezeStiffness: number;
  jumpHeight: Range;
  extraHeightForHalfTurn: number;
  takeoffStretch: number;
  headingRecordSpeed: number;
  landingAirSeconds: number;
  headingShare: number;
  maxSideSpeed: number;
  rollWithTravelWithin: number;
  minTravelSpeed: number;
  alignShare: number;
  alignStiffness: number;
  landingSeconds: number;
  landingStiffness: number;
  landingSettleAngle: number;
  maxCorrectionSpeed: number;
  landingBrake: number;
};

export type RightingWorld = { floorY: number; gravity: number; damping: number };

export type SelfRightingPhase = "idle" | "squeezing" | "airborne" | "landing";

export type SelfRighting = {
  phase: SelfRightingPhase;
  elapsed: number;
  stillFor: number;
  pause: number;
  heading: number;
  airFor: number;
  startRotation: number;
  turn: number;
  flightSeconds: number;
  random: () => number;
};

export type Launch = { upwardSpeed: number; sideSpeed: number; spinSpeed: number; stretch: number };

function between({ min, max }: Range, random: () => number): number {
  return lerp(min, max, random());
}

export function createSelfRighting(params: SelfRightingParams, random: () => number = Math.random): SelfRighting {
  return {
    phase: "idle",
    elapsed: 0,
    stillFor: 0,
    pause: between(params.pauseSeconds, random),
    heading: 0,
    airFor: 0,
    startRotation: 0,
    turn: 0,
    flightSeconds: 0,
    random,
  };
}

function enterPhase(righting: SelfRighting, phase: SelfRightingPhase): void {
  righting.phase = phase;
  righting.elapsed = 0;
}

export function isOnFloor(body: SoftBody, floorY: number, tolerance: number): boolean {
  return body.positions.some((point) => point.y >= floorY - tolerance);
}

function isUpsideDown(body: SoftBody, params: SelfRightingParams): boolean {
  return Math.abs(body.frame.rotation) > params.tiltThreshold;
}

function isUpsideDownOnFloor(body: SoftBody, floorY: number, params: SelfRightingParams): boolean {
  return isUpsideDown(body, params) && isOnFloor(body, floorY, params.groundTolerance);
}

export function rememberHeading(
  righting: SelfRighting,
  body: SoftBody,
  seconds: number,
  params: Pick<SelfRightingParams, "headingRecordSpeed" | "minTravelSpeed" | "landingAirSeconds">,
): void {
  const { floor, wall } = body.impacts;
  const isLanding = floor > params.headingRecordSpeed && righting.airFor >= params.landingAirSeconds;
  const isWallHit = wall > params.headingRecordSpeed;
  righting.airFor = floor > 0 ? 0 : righting.airFor + seconds;
  if (!isLanding && !isWallHit) return;
  const sideways = averageVelocity(body, seconds).x;
  if (Math.abs(sideways) >= params.minTravelSpeed) righting.heading = sideways;
}

export function chooseTurn(
  rotation: number,
  heading: number,
  { rollWithTravelWithin, minTravelSpeed }: Pick<SelfRightingParams, "rollWithTravelWithin" | "minTravelSpeed">,
): number {
  const shortest = -rotation;
  const travelSign = Math.abs(heading) >= minTravelSpeed ? Math.sign(heading) : 0;
  const isNearlyUpsideDown = Math.abs(rotation) > Math.PI - rollWithTravelWithin;
  if (!isNearlyUpsideDown || travelSign === 0 || Math.sign(shortest) === travelSign) return shortest;
  return shortest + travelSign * Math.PI * 2;
}

export function launch(body: SoftBody, seconds: number, { upwardSpeed, sideSpeed, spinSpeed, stretch }: Launch): void {
  const { centroid } = body.frame;
  const deepestRest = Math.max(...body.restOffsets.map((offset) => Math.abs(offset.y)));
  body.positions.forEach((point, index) => {
    const bottomShare = body.restOffsets[index].y / deepestRest;
    const pointUpwardSpeed = upwardSpeed * (1 + stretch * bottomShare);
    const velocityX = sideSpeed - spinSpeed * (point.y - centroid.y);
    const velocityY = spinSpeed * (point.x - centroid.x) - pointUpwardSpeed;
    body.previous[index].x -= velocityX * seconds;
    body.previous[index].y -= velocityY * seconds;
  });
}

function jump(righting: SelfRighting, body: SoftBody, seconds: number, world: RightingWorld, params: SelfRightingParams) {
  const physics: Physics = { gravity: world.gravity, damping: world.damping, stepSeconds: seconds };
  const turn = chooseTurn(body.frame.rotation, righting.heading, params);
  const height =
    between(params.jumpHeight, righting.random) + (params.extraHeightForHalfTurn * Math.abs(turn)) / Math.PI;
  const upwardSpeed = launchSpeedFor(height, physics);
  const flightSeconds = flightOf(upwardSpeed, physics).seconds;
  const sideSpeed = Math.min(Math.max(righting.heading * params.headingShare, -params.maxSideSpeed), params.maxSideSpeed);

  launch(body, seconds, {
    upwardSpeed,
    sideSpeed,
    spinSpeed: spinSpeedFor(turn, flightSeconds, physics),
    stretch: params.takeoffStretch,
  });
  righting.startRotation = body.frame.rotation;
  righting.turn = turn;
  righting.flightSeconds = flightSeconds;
  enterPhase(righting, "airborne");
}

function settleTimer(righting: SelfRighting, body: SoftBody, seconds: number, world: RightingWorld, params: SelfRightingParams) {
  const isStill = fastestPointMovement(body, seconds) < params.stillSpeed;
  if (isStill && isUpsideDownOnFloor(body, world.floorY, params)) {
    righting.stillFor += seconds;
    return;
  }
  if (righting.stillFor > 0) righting.pause = between(params.pauseSeconds, righting.random);
  righting.stillFor = 0;
}

function squeezeGoal(share: number, params: SelfRightingParams): ShapeGoal {
  const easedOut = 1 - (1 - share) ** 2;
  return {
    stiffness: params.squeezeStiffness,
    squash: {
      top: lerp(1, params.squeeze.top, easedOut),
      bottom: lerp(1, params.squeeze.bottom, easedOut),
      width: lerp(1, params.squeeze.width ?? 1, easedOut),
    },
  };
}

export function plantLanding(body: SoftBody, seconds: number, share: number): void {
  const { centroid } = body.frame;
  const sideways = averageVelocity(body, seconds).x * seconds;
  let spin = 0;
  let spread = 0;
  body.positions.forEach((point, index) => {
    const offsetX = point.x - centroid.x;
    const offsetY = point.y - centroid.y;
    spin += offsetX * (point.y - body.previous[index].y) - offsetY * (point.x - body.previous[index].x);
    spread += offsetX * offsetX + offsetY * offsetY;
  });
  const angularStep = spin / (spread || 1);
  body.positions.forEach((point, index) => {
    body.previous[index].x += (sideways - angularStep * (point.y - centroid.y)) * share;
    body.previous[index].y += angularStep * (point.x - centroid.x) * share;
  });
}

export function cappedRotation(current: number, goal: number, maxStep: number): number {
  const gap = Math.atan2(Math.sin(goal - current), Math.cos(goal - current));
  return current + Math.min(Math.max(gap, -maxStep), maxStep);
}

function correctToward(
  body: SoftBody,
  goal: number,
  seconds: number,
  stiffness: number,
  params: SelfRightingParams,
): ShapeGoal {
  return { stiffness, rotation: cappedRotation(body.frame.rotation, goal, params.maxCorrectionSpeed * seconds) };
}

export function stepSelfRighting(
  righting: SelfRighting,
  body: SoftBody,
  seconds: number,
  world: RightingWorld,
  params: SelfRightingParams,
): ShapeGoal | undefined {
  righting.elapsed += seconds;

  rememberHeading(righting, body, seconds, params);
  if (body.grab) {
    if (righting.phase !== "idle") enterPhase(righting, "idle");
    righting.stillFor = 0;
    righting.heading = 0;
    return undefined;
  }

  switch (righting.phase) {
    case "idle":
      settleTimer(righting, body, seconds, world, params);
      if (righting.stillFor >= params.stillSeconds + righting.pause) {
        righting.stillFor = 0;
        enterPhase(righting, "squeezing");
      }
      return undefined;

    case "squeezing": {
      if (!isUpsideDown(body, params)) {
        enterPhase(righting, "idle");
        return undefined;
      }
      const share = righting.elapsed / params.squeezeSeconds;
      if (share < 1) return squeezeGoal(share, params);
      jump(righting, body, seconds, world, params);
      return undefined;
    }

    case "airborne": {
      const share = righting.elapsed / righting.flightSeconds;
      if (share > 0.5 && isOnFloor(body, world.floorY, params.groundTolerance)) {
        plantLanding(body, seconds, params.landingBrake);
        enterPhase(righting, "landing");
        return correctToward(body, 0, seconds, params.landingStiffness, params);
      }
      if (share < 1 - params.alignShare) return undefined;
      const physics = { gravity: world.gravity, damping: world.damping, stepSeconds: seconds };
      const planned = righting.startRotation + righting.turn * spunShare(righting.elapsed, righting.flightSeconds, physics);
      return correctToward(body, planned, seconds, params.alignStiffness, params);
    }

    case "landing":
      if (righting.elapsed >= params.landingSeconds || Math.abs(body.frame.rotation) <= params.landingSettleAngle) {
        enterPhase(righting, "idle");
        return undefined;
      }
      return correctToward(body, 0, seconds, params.landingStiffness, params);
  }
}
