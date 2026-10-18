import type { Vec } from "./vector";

function halfAngleTangent(from: Vec, to: Vec): number {
  const cross = from.x * to.y - from.y * to.x;
  const dot = from.x * to.x + from.y * to.y;
  return Math.tan(Math.atan2(cross, dot) / 2);
}

export function meanValueWeights(polygon: readonly Vec[], point: Vec): number[] {
  const count = polygon.length;
  const spokes = polygon.map((vertex) => ({ x: vertex.x - point.x, y: vertex.y - point.y }));
  const raw = spokes.map((spoke, index) => {
    const before = spokes[(index - 1 + count) % count];
    const after = spokes[(index + 1) % count];
    const length = Math.hypot(spoke.x, spoke.y) || 1;
    return (halfAngleTangent(before, spoke) + halfAngleTangent(spoke, after)) / length;
  });
  const total = raw.reduce((sum, weight) => sum + weight, 0);
  return raw.map((weight) => weight / total);
}

export function pinnedPoint(weights: readonly number[], polygon: readonly Vec[]): Vec {
  return weights.reduce(
    (sum, weight, index) => ({ x: sum.x + polygon[index].x * weight, y: sum.y + polygon[index].y * weight }),
    { x: 0, y: 0 },
  );
}
