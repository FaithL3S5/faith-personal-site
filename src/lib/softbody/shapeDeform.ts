import type { Vec } from "./vector";

export type Flatten = { axis: Vec; amount: number };

function dot(a: Vec, b: Vec): number {
  return a.x * b.x + a.y * b.y;
}

export function flattenAlong(offsets: readonly Vec[], { axis, amount }: Flatten): Vec[] {
  const widen = 1 / (1 - amount);
  return offsets.map((offset) => {
    const along = dot(offset, axis);
    const across = { x: offset.x - axis.x * along, y: offset.y - axis.y * along };
    return {
      x: axis.x * along * (1 - amount) + across.x * widen,
      y: axis.y * along * (1 - amount) + across.y * widen,
    };
  });
}
