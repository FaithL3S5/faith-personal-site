import { arcShares, blendShape, createBallOffsets } from "./ballShape";
import { dropOffsets, type Drop } from "./dropShape";
import { bestFitRotation } from "./rotationFit";
import { flattenAlong, type Flatten } from "./shapeDeform";
import { centroidOf, containsPoint, lerp, lerpAngle, perimeterOf, rotate, signedArea, type Vec } from "./vector";

export { bestFitRotation } from "./rotationFit";

export type SoftBodyParams = {
  gravity: number;
  damping: number;
  iterations: number;
  edgeStiffness: number;
  braceStiffness: number;
  pressureStiffness: number;
  shapeStiffness: number;
  recoveryStiffness: number;
  grabStiffness: number;
  heldSwingDamping: number;
  restitution: number;
  friction: number;
  edgeMargin: number;
};

export type Bounds = { width: number; height: number };

export type BodyFrame = { centroid: Vec; rotation: number };

export type Squash = { top: number; bottom: number; width?: number };

export type ShapeGoal = {
  stiffness?: number;
  rotation?: number;
  squash?: Squash;
  flatten?: Flatten;
  drop?: Drop;
};

export type Grab = { index: number; target: Vec; offset: Vec; gapShare: number };

export type SurfaceImpacts = { floor: number; wall: number; ceiling: number };

type Brace = { from: number; to: number; length: number };

export type SoftBody = {
  positions: Vec[];
  previous: Vec[];
  lastStep: Vec[];
  restOffsets: readonly Vec[];
  ballOffsets: readonly Vec[];
  shapeOffsets: readonly Vec[];
  roundness: number;
  fitShape: readonly Vec[];
  edgeLengths: number[];
  braces: Brace[];
  restArea: number;
  grab: Grab | null;
  isTangled: boolean;
  impacts: SurfaceImpacts;
  frame: BodyFrame;
  lastFrame: BodyFrame;
};

const grabFalloff = [1, 0.3];
const fitPasses = 3;

function distanceBetween(a: Vec, b: Vec): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function createBraces(restOffsets: readonly Vec[]): Brace[] {
  const count = restOffsets.length;
  const spans = [Math.round(count / 8), Math.round(count / 4), Math.round(count / 2)];
  return spans.flatMap((span) =>
    Array.from({ length: span === count / 2 ? count / 2 : count }, (_, from) => {
      const to = (from + span) % count;
      return { from, to, length: distanceBetween(restOffsets[from], restOffsets[to]) };
    }),
  );
}

function edgeLengthsOf(offsets: readonly Vec[]): number[] {
  return offsets.map((offset, index) => distanceBetween(offset, offsets[(index + 1) % offsets.length]));
}

export function setRoundness(body: SoftBody, roundness: number): void {
  const clamped = Math.min(Math.max(roundness, 0), 1);
  if (clamped === body.roundness) return;
  body.roundness = clamped;
  body.shapeOffsets = blendShape(body.restOffsets, body.ballOffsets, clamped);
  body.edgeLengths = edgeLengthsOf(body.shapeOffsets);
  body.braces.forEach((brace) => {
    brace.length = distanceBetween(body.shapeOffsets[brace.from], body.shapeOffsets[brace.to]);
  });
}

export function createSoftBody(restShape: readonly Vec[], scale: number, origin: Vec): SoftBody {
  const restCentroid = centroidOf(restShape);
  const restOffsets = restShape.map((point) => ({
    x: (point.x - restCentroid.x) * scale,
    y: (point.y - restCentroid.y) * scale,
  }));
  const positions = restOffsets.map((offset) => ({ x: origin.x + offset.x, y: origin.y + offset.y }));
  const frame = { centroid: { ...origin }, rotation: 0 };

  return {
    positions,
    previous: positions.map((point) => ({ ...point })),
    lastStep: positions.map((point) => ({ ...point })),
    restOffsets,
    ballOffsets: createBallOffsets(restOffsets),
    shapeOffsets: restOffsets,
    roundness: 0,
    fitShape: restOffsets,
    edgeLengths: edgeLengthsOf(restOffsets),
    braces: createBraces(restOffsets),
    restArea: signedArea(restOffsets),
    grab: null,
    isTangled: false,
    impacts: { floor: 0, wall: 0, ceiling: 0 },
    frame,
    lastFrame: { ...frame },
  };
}

function segmentsCross(a: Vec, b: Vec, c: Vec, d: Vec): boolean {
  const side = (p: Vec, q: Vec, r: Vec) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  return side(a, b, c) * side(a, b, d) < 0 && side(c, d, a) * side(c, d, b) < 0;
}

export function hasCrossingEdges(points: readonly Vec[]): boolean {
  const count = points.length;
  for (let first = 0; first < count; first++) {
    for (let second = first + 2; second < count; second++) {
      if (first === 0 && second === count - 1) continue;
      const crosses = segmentsCross(points[first], points[first + 1], points[second], points[(second + 1) % count]);
      if (crosses) return true;
    }
  }
  return false;
}

function isTangled(body: SoftBody): boolean {
  return Math.sign(signedArea(body.positions)) !== Math.sign(body.restArea) || hasCrossingEdges(body.positions);
}

function integrate(body: SoftBody, seconds: number, params: SoftBodyParams): void {
  body.positions.forEach((point, index) => {
    const previous = body.previous[index];
    const velocityX = (point.x - previous.x) * params.damping;
    const velocityY = (point.y - previous.y) * params.damping;
    previous.x = point.x;
    previous.y = point.y;
    point.x += velocityX;
    point.y += velocityY + params.gravity * seconds * seconds;
  });
}

function keepDistance(a: Vec, b: Vec, length: number, stiffness: number): void {
  const deltaX = b.x - a.x;
  const deltaY = b.y - a.y;
  const distance = Math.hypot(deltaX, deltaY) || 1;
  const correction = ((distance - length) / distance) * 0.5 * stiffness;
  a.x += deltaX * correction;
  a.y += deltaY * correction;
  b.x -= deltaX * correction;
  b.y -= deltaY * correction;
}

function keepEdgesAndBraces(body: SoftBody, params: SoftBodyParams, isReversed: boolean): void {
  const { positions } = body;
  const count = positions.length;
  for (let step = 0; step < count; step++) {
    const index = isReversed ? count - 1 - step : step;
    keepDistance(positions[index], positions[(index + 1) % count], body.edgeLengths[index], params.edgeStiffness);
  }
  const braceCount = body.braces.length;
  for (let step = 0; step < braceCount; step++) {
    const { from, to, length } = body.braces[isReversed ? braceCount - 1 - step : step];
    keepDistance(positions[from], positions[to], length, params.braceStiffness);
  }
}

function keepArea(body: SoftBody, stiffness: number): void {
  const { positions } = body;
  const orientation = Math.sign(body.restArea);
  const push = ((Math.abs(body.restArea) - signedArea(positions) * orientation) / perimeterOf(positions)) * stiffness;
  const count = positions.length;
  const normals = positions.map((_, index) => {
    const before = positions[(index - 1 + count) % count];
    const after = positions[(index + 1) % count];
    const tangentX = after.x - before.x;
    const tangentY = after.y - before.y;
    const length = Math.hypot(tangentX, tangentY) || 1;
    return { x: (tangentY / length) * orientation, y: (-tangentX / length) * orientation };
  });
  positions.forEach((point, index) => {
    point.x += normals[index].x * push;
    point.y += normals[index].y * push;
  });
}

function squashedRest(body: SoftBody, squash: Squash): Vec[] {
  return body.shapeOffsets.map((shape, index) => ({
    x: shape.x * (squash.width ?? 1),
    y: shape.y * (body.restOffsets[index].y < 0 ? squash.top : squash.bottom),
  }));
}

type ScreenShaping = { flatten?: Flatten };

function centred(offsets: readonly Vec[]): Vec[] {
  const centre = centroidOf(offsets);
  return offsets.map(({ x, y }) => ({ x: x - centre.x, y: y - centre.y }));
}

function deformInScreen(offsets: readonly Vec[], { flatten }: ScreenShaping): Vec[] {
  return flatten ? flattenAlong(offsets, flatten) : [...offsets];
}

function hangingRotation(shape: readonly Vec[], drop: Drop): number {
  const grip = shape[drop.anchorIndex];
  const centre = centroidOf(shape);
  const gripAngle = Math.atan2(grip.y - centre.y, grip.x - centre.x);
  return Math.atan2(-drop.direction.y, -drop.direction.x) - gripAngle;
}

function withDrop(body: SoftBody, shape: readonly Vec[], drop?: Drop): Vec[] {
  if (!drop) return [...shape];
  const turn = hangingRotation(shape, drop);
  const hanging = dropOffsets(arcShares(body.shapeOffsets), body.restArea, drop).map((offset) => rotate(offset, -turn));
  return centred(shape).map((offset, index) => ({
    x: offset.x + (hanging[index].x - offset.x) * drop.share,
    y: offset.y + (hanging[index].y - offset.y) * drop.share,
  }));
}

function deformedFitShape(squashed: readonly Vec[], rotation: number, shaping: ScreenShaping): Vec[] {
  return deformInScreen(
    squashed.map((rest) => rotate(rest, rotation)),
    shaping,
  ).map((offset) => rotate(offset, -rotation));
}

function fitRotation(body: SoftBody, squashed: readonly Vec[], centroid: Vec, shaping: ScreenShaping): number {
  let rotation = body.frame.rotation;
  for (let pass = 0; pass < fitPasses; pass++) {
    body.fitShape = deformedFitShape(squashed, rotation, shaping);
    rotation = bestFitRotation(body.fitShape, body.positions, centroid);
  }
  return rotation;
}

function keepShape(body: SoftBody, stiffness: number, shapeGoal: ShapeGoal = {}): void {
  const centroid = centroidOf(body.positions);
  const squashed = withDrop(body, squashedRest(body, shapeGoal.squash ?? { top: 1, bottom: 1 }), shapeGoal.drop);
  const shaping = { flatten: shapeGoal.flatten };
  const isDeformed = Boolean(shaping.flatten);
  body.fitShape = squashed;
  const rotation =
    shapeGoal.rotation ??
    (isDeformed ? fitRotation(body, squashed, centroid, shaping) : bestFitRotation(squashed, body.positions, centroid));
  const goals = deformInScreen(
    squashed.map((rest) => rotate(rest, rotation)),
    shaping,
  );
  const goalCentre = centroidOf(goals);
  body.positions.forEach((point, index) => {
    point.x += (centroid.x + goals[index].x - goalCentre.x - point.x) * stiffness;
    point.y += (centroid.y + goals[index].y - goalCentre.y - point.y) * stiffness;
  });
}

export function dampSwing(body: SoftBody, gripIndex: number, share: number): void {
  const grip = body.positions[gripIndex];
  const gripVelocityX = grip.x - body.previous[gripIndex].x;
  const gripVelocityY = grip.y - body.previous[gripIndex].y;
  let swing = 0;
  let spread = 0;
  body.positions.forEach((point, index) => {
    const offsetX = point.x - grip.x;
    const offsetY = point.y - grip.y;
    const relativeX = point.x - body.previous[index].x - gripVelocityX;
    const relativeY = point.y - body.previous[index].y - gripVelocityY;
    swing += offsetX * relativeY - offsetY * relativeX;
    spread += offsetX * offsetX + offsetY * offsetY;
  });
  const angularStep = (swing / (spread || 1)) * share;
  body.positions.forEach((point, index) => {
    body.previous[index].x -= angularStep * (point.y - grip.y);
    body.previous[index].y += angularStep * (point.x - grip.x);
  });
}

function followGrab(body: SoftBody, stiffness: number): void {
  if (!body.grab) return;
  const { positions } = body;
  const { index: grabbedIndex, target, offset, gapShare } = body.grab;
  const grabbed = positions[grabbedIndex];
  const moveX = (target.x + offset.x * gapShare - grabbed.x) * stiffness;
  const moveY = (target.y + offset.y * gapShare - grabbed.y) * stiffness;
  grabFalloff.forEach((weight, distance) => {
    const indices = distance === 0 ? [grabbedIndex] : [grabbedIndex - distance, grabbedIndex + distance];
    indices.forEach((index) => {
      const point = positions[(index + positions.length) % positions.length];
      point.x += moveX * weight;
      point.y += moveY * weight;
    });
  });
}

function collideWithBounds(body: SoftBody, bounds: Bounds, params: SoftBodyParams, seconds: number): void {
  const lowest = params.edgeMargin;
  const right = bounds.width - params.edgeMargin;
  const bottom = bounds.height - params.edgeMargin;
  const impacts = { floor: 0, wall: 0, ceiling: 0 };
  body.positions.forEach((point, index) => {
    const previous = body.previous[index];
    const velocityX = point.x - previous.x;
    const velocityY = point.y - previous.y;
    const speedX = Math.abs(velocityX) / seconds;
    const speedY = Math.abs(velocityY) / seconds;

    if (point.y > bottom) impacts.floor = Math.max(impacts.floor, speedY);
    if (point.y < lowest) impacts.ceiling = Math.max(impacts.ceiling, speedY);
    if (point.x > right || point.x < lowest) impacts.wall = Math.max(impacts.wall, speedX);

    if (point.y > bottom || point.y < lowest) {
      point.y = Math.min(Math.max(point.y, lowest), bottom);
      previous.y = point.y + velocityY * params.restitution;
      previous.x = point.x - velocityX * (1 - params.friction);
    }
    if (point.x > right || point.x < lowest) {
      point.x = Math.min(Math.max(point.x, lowest), right);
      previous.x = point.x + velocityX * params.restitution;
      previous.y = point.y - velocityY * (1 - params.friction);
    }
  });
  body.impacts = impacts;
}

export function stepSoftBody(
  body: SoftBody,
  seconds: number,
  bounds: Bounds,
  params: SoftBodyParams,
  shapeGoal?: ShapeGoal,
): void {
  body.positions.forEach((point, index) => {
    body.lastStep[index].x = point.x;
    body.lastStep[index].y = point.y;
  });

  if (body.grab) dampSwing(body, body.grab.index, params.heldSwingDamping);
  integrate(body, seconds, params);
  body.isTangled = isTangled(body);
  const goal = body.isTangled ? undefined : shapeGoal;
  const shapeStiffness = body.isTangled ? params.recoveryStiffness : (goal?.stiffness ?? params.shapeStiffness);
  for (let iteration = 0; iteration < params.iterations; iteration++) {
    followGrab(body, params.grabStiffness);
    keepEdgesAndBraces(body, params, iteration % 2 === 1);
    if (!body.isTangled) keepArea(body, params.pressureStiffness);
    keepShape(body, shapeStiffness, goal);
  }
  collideWithBounds(body, bounds, params, seconds);

  const centroid = centroidOf(body.positions);
  body.lastFrame = body.frame;
  body.frame = { centroid, rotation: bestFitRotation(body.fitShape, body.positions, centroid) };
}

export function averageVelocity(body: SoftBody, seconds: number): Vec {
  const total = body.positions.reduce(
    (sum, point, index) => ({ x: sum.x + point.x - body.previous[index].x, y: sum.y + point.y - body.previous[index].y }),
    { x: 0, y: 0 },
  );
  return { x: total.x / body.positions.length / seconds, y: total.y / body.positions.length / seconds };
}

export function fastestPointMovement(body: SoftBody, seconds: number): number {
  return Math.max(...body.positions.map((point, index) => distanceBetween(point, body.lastStep[index]) / seconds));
}

export function surfaceRotation(body: SoftBody, positions: readonly Vec[], index: number, span = 2): number {
  const count = positions.length;
  const before = (index - span + count) % count;
  const after = (index + span) % count;
  const restAngle = Math.atan2(
    body.shapeOffsets[after].y - body.shapeOffsets[before].y,
    body.shapeOffsets[after].x - body.shapeOffsets[before].x,
  );
  const angle = Math.atan2(positions[after].y - positions[before].y, positions[after].x - positions[before].x);
  return Math.atan2(Math.sin(angle - restAngle), Math.cos(angle - restAngle));
}

export function grabNearestPoint(body: SoftBody, pointer: Vec): boolean {
  if (!containsPoint(body.positions, pointer)) return false;
  let nearestIndex = 0;
  let nearestDistance = Infinity;
  body.positions.forEach((point, index) => {
    const distance = distanceBetween(point, pointer);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });
  const grabbed = body.positions[nearestIndex];
  body.grab = {
    index: nearestIndex,
    target: { ...pointer },
    offset: { x: grabbed.x - pointer.x, y: grabbed.y - pointer.y },
    gapShare: 1,
  };
  return true;
}

export function moveGrab(body: SoftBody, pointer: Vec): void {
  if (body.grab) body.grab.target = { ...pointer };
}

export function releaseGrab(body: SoftBody): void {
  body.grab = null;
}

export function interpolatedPositions(body: SoftBody, alpha: number): Vec[] {
  return body.positions.map((point, index) => ({
    x: lerp(body.lastStep[index].x, point.x, alpha),
    y: lerp(body.lastStep[index].y, point.y, alpha),
  }));
}

export function interpolatedFrame(body: SoftBody, alpha: number): BodyFrame {
  return {
    centroid: {
      x: lerp(body.lastFrame.centroid.x, body.frame.centroid.x, alpha),
      y: lerp(body.lastFrame.centroid.y, body.frame.centroid.y, alpha),
    },
    rotation: lerpAngle(body.lastFrame.rotation, body.frame.rotation, alpha),
  };
}
