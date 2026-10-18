export type Vec = { x: number; y: number };

export function signedArea(points: readonly Vec[]): number {
  let doubled = 0;
  for (let index = 0; index < points.length; index++) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    doubled += current.x * next.y - next.x * current.y;
  }
  return doubled / 2;
}

export function centroidOf(points: readonly Vec[]): Vec {
  let x = 0;
  let y = 0;
  for (const point of points) {
    x += point.x;
    y += point.y;
  }
  return { x: x / points.length, y: y / points.length };
}

export function perimeterOf(points: readonly Vec[]): number {
  let length = 0;
  for (let index = 0; index < points.length; index++) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    length += Math.hypot(next.x - current.x, next.y - current.y);
  }
  return length;
}

export function rotate({ x, y }: Vec, angle: number): Vec {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: x * cos - y * sin, y: x * sin + y * cos };
}

export function lerp(from: number, to: number, share: number): number {
  return from + (to - from) * share;
}

export function lerpAngle(from: number, to: number, share: number): number {
  const difference = Math.atan2(Math.sin(to - from), Math.cos(to - from));
  return from + difference * share;
}

export function containsPoint(polygon: readonly Vec[], point: Vec): boolean {
  let isInside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const a = polygon[index];
    const b = polygon[previous];
    const crossesRow = a.y > point.y !== b.y > point.y;
    if (crossesRow && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x) isInside = !isInside;
  }
  return isInside;
}
