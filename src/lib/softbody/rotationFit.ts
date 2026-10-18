import type { Vec } from "./vector";

export function bestFitRotation(restOffsets: readonly Vec[], positions: readonly Vec[], centroid: Vec): number {
  let cross = 0;
  let dot = 0;
  restOffsets.forEach((rest, index) => {
    const x = positions[index].x - centroid.x;
    const y = positions[index].y - centroid.y;
    cross += rest.x * y - rest.y * x;
    dot += rest.x * x + rest.y * y;
  });
  return Math.atan2(cross, dot);
}
