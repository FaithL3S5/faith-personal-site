import type { Vec } from "./vector";

const tension = 1 / 6;

function format(value: number): string {
  return String(Math.round(value * 10) / 10);
}

export function smoothClosedPath(points: readonly Vec[]): string {
  const count = points.length;
  const at = (index: number) => points[(index + count) % count];
  const segments = [`M${format(points[0].x)},${format(points[0].y)}`];

  for (let index = 0; index < count; index++) {
    const before = at(index - 1);
    const start = at(index);
    const end = at(index + 1);
    const after = at(index + 2);
    const controlOne = { x: start.x + (end.x - before.x) * tension, y: start.y + (end.y - before.y) * tension };
    const controlTwo = { x: end.x - (after.x - start.x) * tension, y: end.y - (after.y - start.y) * tension };
    segments.push(
      `C${format(controlOne.x)},${format(controlOne.y)} ${format(controlTwo.x)},${format(controlTwo.y)} ${format(end.x)},${format(end.y)}`,
    );
  }

  return `${segments.join("")}Z`;
}
