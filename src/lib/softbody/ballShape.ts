import { lerp, signedArea, type Vec } from "./vector";

export function arcShares(points: readonly Vec[]): number[] {
  const count = points.length;
  const lengths = points.map((point, index) => {
    const next = points[(index + 1) % count];
    return Math.hypot(next.x - point.x, next.y - point.y);
  });
  const perimeter = lengths.reduce((sum, length) => sum + length, 0);
  let travelled = 0;
  return lengths.map((length) => {
    const share = travelled / perimeter;
    travelled += length;
    return share;
  });
}

export function createBallOffsets(restOffsets: readonly Vec[]): Vec[] {
  const radius = Math.sqrt(Math.abs(signedArea(restOffsets)) / Math.PI);
  return restOffsets.map(({ x, y }) => {
    const angle = Math.atan2(y, x);
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  });
}

export function blendShape(restOffsets: readonly Vec[], ballOffsets: readonly Vec[], roundness: number): Vec[] {
  const blended = restOffsets.map((rest, index) => ({
    x: lerp(rest.x, ballOffsets[index].x, roundness),
    y: lerp(rest.y, ballOffsets[index].y, roundness),
  }));
  const keepArea = Math.sqrt(signedArea(restOffsets) / signedArea(blended));
  return blended.map(({ x, y }) => ({ x: x * keepArea, y: y * keepArea }));
}
