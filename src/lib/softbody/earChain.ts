import { lerp, rotate, type Vec } from "./vector";

export type EarChainParams = {
  pinnedPoints: number;
  baseStiffness: number;
  tipStiffness: number;
  damping: number;
  iterations: number;
};

export type EarBase = { position: Vec; rotation: number };

export type EarChain = {
  restOffsets: readonly Vec[];
  segmentLength: number;
  positions: Vec[];
  previous: Vec[];
  lastStep: Vec[];
};

export type OutlineBinding = { along: number; lateral: number };

function placed(base: EarBase, offset: Vec): Vec {
  const turned = rotate(offset, base.rotation);
  return { x: base.position.x + turned.x, y: base.position.y + turned.y };
}

export function createEarChain(root: Vec, tip: Vec, scale: number, segments: number, base: EarBase): EarChain {
  const restOffsets = Array.from({ length: segments + 1 }, (_, index) => ({
    x: (tip.x - root.x) * scale * (index / segments),
    y: (tip.y - root.y) * scale * (index / segments),
  }));
  const positions = restOffsets.map((offset) => placed(base, offset));

  return {
    restOffsets,
    segmentLength: (Math.hypot(tip.x - root.x, tip.y - root.y) * scale) / segments,
    positions,
    previous: positions.map((point) => ({ ...point })),
    lastStep: positions.map((point) => ({ ...point })),
  };
}

function keepSegmentLengths(chain: EarChain, pinnedPoints: number): void {
  const { positions, segmentLength } = chain;
  for (let index = Math.max(pinnedPoints - 1, 0); index < positions.length - 1; index++) {
    const start = positions[index];
    const end = positions[index + 1];
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const distance = Math.hypot(deltaX, deltaY) || 1;
    const stretch = (distance - segmentLength) / distance;
    const startShare = index < pinnedPoints ? 0 : 0.5;
    start.x += deltaX * stretch * startShare;
    start.y += deltaY * stretch * startShare;
    end.x -= deltaX * stretch * (1 - startShare);
    end.y -= deltaY * stretch * (1 - startShare);
  }
}

export function stepEarChain(chain: EarChain, base: EarBase, seconds: number, params: EarChainParams): void {
  const lastIndex = chain.positions.length - 1;
  chain.positions.forEach((point, index) => {
    chain.lastStep[index].x = point.x;
    chain.lastStep[index].y = point.y;
    const target = placed(base, chain.restOffsets[index]);
    const previous = chain.previous[index];

    if (index < params.pinnedPoints) {
      previous.x = point.x;
      previous.y = point.y;
      point.x = target.x;
      point.y = target.y;
      return;
    }

    const looseShare = (index - params.pinnedPoints) / Math.max(lastIndex - params.pinnedPoints, 1);
    const stiffness = lerp(params.baseStiffness, params.tipStiffness, looseShare);
    const velocityX = (point.x - previous.x) * params.damping;
    const velocityY = (point.y - previous.y) * params.damping;
    previous.x = point.x;
    previous.y = point.y;
    point.x += velocityX + (target.x - point.x) * stiffness * seconds * seconds;
    point.y += velocityY + (target.y - point.y) * stiffness * seconds * seconds;
  });

  for (let iteration = 0; iteration < params.iterations; iteration++) keepSegmentLengths(chain, params.pinnedPoints);
}

export function bindOutline(
  outline: readonly Vec[],
  root: Vec,
  tip: Vec,
  scale: number,
  baseExtension = 0,
  baseCutoff = 0,
): OutlineBinding[] {
  const length = Math.hypot(tip.x - root.x, tip.y - root.y);
  const axis = { x: (tip.x - root.x) / length, y: (tip.y - root.y) / length };
  return outline.map((point) => {
    const deltaX = point.x - root.x;
    const deltaY = point.y - root.y;
    const along = (deltaX * axis.x + deltaY * axis.y) * scale;
    return {
      along: along < baseCutoff ? along - baseExtension : along,
      lateral: (deltaY * axis.x - deltaX * axis.y) * scale,
    };
  });
}

function directionBetween(from: Vec, to: Vec): Vec {
  const length = Math.hypot(to.x - from.x, to.y - from.y) || 1;
  return { x: (to.x - from.x) / length, y: (to.y - from.y) / length };
}

function jointDirections(points: readonly Vec[]): Vec[] {
  const segments = points.slice(1).map((point, index) => directionBetween(points[index], point));
  return points.map((_, index) => {
    const before = segments[Math.max(index - 1, 0)];
    const after = segments[Math.min(index, segments.length - 1)];
    return directionBetween({ x: 0, y: 0 }, { x: before.x + after.x, y: before.y + after.y });
  });
}

export function skinOutline(points: readonly Vec[], bindings: readonly OutlineBinding[], segmentLength: number): Vec[] {
  const directions = jointDirections(points);
  const lastSegment = points.length - 2;

  return bindings.map(({ along, lateral }) => {
    const position = along / segmentLength;
    const segment = Math.min(Math.max(Math.floor(position), 0), lastSegment);
    const share = position - segment;
    const start = points[segment];
    const end = points[segment + 1];
    const tangent = directionBetween(
      { x: 0, y: 0 },
      {
        x: lerp(directions[segment].x, directions[segment + 1].x, Math.min(Math.max(share, 0), 1)),
        y: lerp(directions[segment].y, directions[segment + 1].y, Math.min(Math.max(share, 0), 1)),
      },
    );
    const spine = { x: lerp(start.x, end.x, share), y: lerp(start.y, end.y, share) };
    return { x: spine.x - tangent.y * lateral, y: spine.y + tangent.x * lateral };
  });
}

export function interpolatedChain(chain: EarChain, alpha: number): Vec[] {
  return chain.positions.map((point, index) => ({
    x: lerp(chain.lastStep[index].x, point.x, alpha),
    y: lerp(chain.lastStep[index].y, point.y, alpha),
  }));
}
