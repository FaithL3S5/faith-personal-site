import { dropLength } from "./dropShape";
import type { Flatten } from "./shapeDeform";
import { fastestPointMovement, setRoundness, type ShapeGoal, type SoftBody } from "./softBody";
import { lerp, type Vec } from "./vector";

export type ShapeSteeringParams = {
  roundSeconds: number;
  reformSeconds: number;
  reformAfterStillSeconds: number;
  settleSpeed: number;
  looseStiffness: number;
  heldStiffness: number;
  heldEaseSeconds: number;
  dropAspect: number;
  swingShare: number;
  swingSmoothing: number;
  maxLean: number;
  squashPerSpeed: number;
  maxSquash: number;
  squashSeconds: number;
  squashStiffness: number;
  restFlatten: number;
  floorMemorySeconds: number;
};

export type ShapeSteering = {
  squash: Flatten;
  sinceFloor: number;
  stillFor: number;
  held: number;
  lastPointer: Vec | null;
  velocity: Vec;
  acceleration: Vec;
};

const down = { x: 0, y: 1 };
const sideways = { x: 1, y: 0 };

export function createShapeSteering(): ShapeSteering {
  return {
    squash: { axis: down, amount: 0 },
    sinceFloor: Infinity,
    stillFor: 0,
    held: 0,
    lastPointer: null,
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
  };
}

function smoothTowards(from: Vec, to: Vec, share: number): Vec {
  return { x: lerp(from.x, to.x, share), y: lerp(from.y, to.y, share) };
}

function trackSwing(steering: ShapeSteering, pointer: Vec, seconds: number, smoothing: number): void {
  const last = steering.lastPointer ?? pointer;
  const rawVelocity = { x: (pointer.x - last.x) / seconds, y: (pointer.y - last.y) / seconds };
  const velocity = smoothTowards(steering.velocity, rawVelocity, smoothing);
  const rawAcceleration = {
    x: (velocity.x - steering.velocity.x) / seconds,
    y: (velocity.y - steering.velocity.y) / seconds,
  };
  steering.acceleration = smoothTowards(steering.acceleration, rawAcceleration, smoothing);
  steering.velocity = velocity;
  steering.lastPointer = { ...pointer };
}

function forgetSwing(steering: ShapeSteering): void {
  steering.lastPointer = null;
  steering.velocity = { x: 0, y: 0 };
  steering.acceleration = { x: 0, y: 0 };
}

export function droopDirection(acceleration: Vec, gravity: number, swingShare: number, maxLean: number): Vec {
  const pull = { x: -acceleration.x * swingShare, y: gravity - acceleration.y * swingShare };
  const angle = Math.atan2(pull.x, pull.y);
  const lean = Math.min(Math.max(angle, -maxLean), maxLean);
  return { x: Math.sin(lean), y: Math.cos(lean) };
}

function registerHits(steering: ShapeSteering, body: SoftBody, seconds: number, params: ShapeSteeringParams): void {
  const { floor, wall, ceiling } = body.impacts;
  steering.sinceFloor = floor > 0 ? 0 : steering.sinceFloor + seconds;
  steering.squash.amount *= Math.exp((-seconds * 3) / params.squashSeconds);
  const hits: [number, Vec][] = [
    [floor, down],
    [ceiling, down],
    [wall, sideways],
  ];
  hits.forEach(([speed, axis]) => {
    const amount = Math.min(speed * params.squashPerSpeed, params.maxSquash);
    if (amount > steering.squash.amount) steering.squash = { axis, amount };
  });
}

function moveTowards(current: number, goal: number, maxStep: number): number {
  return current + Math.min(Math.max(goal - current, -maxStep), maxStep);
}

function steerRoundness(
  steering: ShapeSteering,
  body: SoftBody,
  seconds: number,
  floorY: number,
  params: ShapeSteeringParams,
): void {
  if (body.grab) {
    steering.stillFor = 0;
    const lift = roomToRound(body, floorY);
    body.grab.gapShare = 1 - lift;
    setRoundness(body, moveTowards(body.roundness, lift, seconds / params.roundSeconds));
    return;
  }
  const isResting = steering.sinceFloor <= params.floorMemorySeconds;
  if (!isResting) {
    steering.stillFor = 0;
    setRoundness(body, body.roundness + seconds / params.roundSeconds);
    return;
  }
  const isReforming = steering.stillFor >= params.reformAfterStillSeconds;
  const isSettled = fastestPointMovement(body, seconds) < params.settleSpeed;
  if (isReforming || isSettled) steering.stillFor += seconds;
  else steering.stillFor = 0;
  if (steering.stillFor >= params.reformAfterStillSeconds) {
    setRoundness(body, body.roundness - seconds / params.reformSeconds);
  }
}

function smoothStep(share: number): number {
  return share * share * (3 - 2 * share);
}

export function heldShare(steering: ShapeSteering): number {
  return smoothStep(steering.held);
}

function roomShare(body: SoftBody, floorY: number, fromHeight: number, toHeight: number): number {
  if (!body.grab) return 0;
  const room = floorY - body.grab.target.y;
  return smoothStep(Math.min(Math.max((room - fromHeight) / (toHeight - fromHeight), 0), 1));
}

function ballHeight(body: SoftBody): number {
  return 2 * Math.sqrt(Math.abs(body.restArea) / Math.PI);
}

export function roomToRound(body: SoftBody, floorY: number): number {
  const drawnHeight = Math.max(...body.restOffsets.map(({ y }) => y)) - Math.min(...body.restOffsets.map(({ y }) => y));
  return roomShare(body, floorY, drawnHeight, ballHeight(body));
}

export function roomToHang(body: SoftBody, floorY: number, aspect: number): number {
  return roomShare(body, floorY, ballHeight(body), dropLength(body.restArea, aspect));
}

export function stepShapeSteering(
  steering: ShapeSteering,
  body: SoftBody,
  seconds: number,
  world: { gravity: number; floorY: number },
  params: ShapeSteeringParams,
): ShapeGoal | undefined {
  const { gravity, floorY } = world;
  registerHits(steering, body, seconds, params);
  steerRoundness(steering, body, seconds, floorY, params);

  if (body.grab) {
    trackSwing(steering, body.grab.target, seconds, params.swingSmoothing);
    steering.held = Math.min(steering.held + seconds / params.heldEaseSeconds, 1);
    const easedHeld = heldShare(steering);
    return {
      stiffness: lerp(params.looseStiffness, params.heldStiffness, easedHeld),
      drop: {
        anchorIndex: body.grab.index,
        direction: droopDirection(steering.acceleration, gravity, params.swingShare, params.maxLean),
        share: easedHeld * roomToHang(body, floorY, params.dropAspect),
        aspect: params.dropAspect,
      },
    };
  }
  steering.held = Math.max(steering.held - seconds / params.heldEaseSeconds, 0);
  forgetSwing(steering);

  const isResting = steering.sinceFloor <= params.floorMemorySeconds;
  if (steering.squash.amount > params.restFlatten) {
    return { stiffness: params.squashStiffness, flatten: steering.squash };
  }
  if (isResting) return { flatten: { axis: down, amount: params.restFlatten } };
  return undefined;
}
