import { centroidOf, signedArea, type Vec } from "./vector";

export type Drop = { anchorIndex: number; direction: Vec; share: number; aspect: number };

const curveSamples = 360;
const widestHalfWidth = 0.724;

function unitDropCurve(aspect: number): Vec[] {
  const widen = 1 / aspect / (widestHalfWidth * 2);
  return Array.from({ length: curveSamples }, (_, index) => {
    const angle = (index / curveSamples) * Math.PI * 2;
    return { x: Math.sin(angle) * Math.sin(angle / 2) * widen, y: (1 - Math.cos(angle)) / 2 };
  });
}

function pointAtShare(curve: readonly Vec[], cumulative: readonly number[], share: number): Vec {
  const distance = share * cumulative[cumulative.length - 1];
  const index = cumulative.findIndex((length) => length >= distance);
  if (index <= 0) return curve[0];
  const start = curve[index - 1];
  const end = curve[index % curve.length];
  const span = cumulative[index] - cumulative[index - 1] || 1;
  const along = (distance - cumulative[index - 1]) / span;
  return { x: start.x + (end.x - start.x) * along, y: start.y + (end.y - start.y) * along };
}

export function dropLength(area: number, aspect: number): number {
  return Math.sqrt(Math.abs(area) / Math.abs(signedArea(unitDropCurve(aspect))));
}

export function dropOffsets(shares: readonly number[], area: number, { anchorIndex, direction, aspect }: Drop): Vec[] {
  const curve = unitDropCurve(aspect);
  const cumulative = [0];
  curve.forEach((point, index) => {
    const next = curve[(index + 1) % curve.length];
    cumulative.push(cumulative[index] + Math.hypot(next.x - point.x, next.y - point.y));
  });
  const across = { x: -direction.y, y: direction.x };
  const toScreen = ({ x, y }: Vec) => ({ x: across.x * x + direction.x * y, y: across.y * x + direction.y * y });
  const flip = Math.sign(signedArea(curve.map(toScreen))) === Math.sign(area) ? 1 : -1;
  const scale = Math.sqrt(Math.abs(area) / Math.abs(signedArea(curve)));
  const placed = shares.map((share) => {
    const fromTip = (share - shares[anchorIndex] + 1) % 1;
    const point = pointAtShare(curve, cumulative, fromTip);
    return toScreen({ x: point.x * flip * scale, y: point.y * scale });
  });
  const centre = centroidOf(placed);
  return placed.map(({ x, y }) => ({ x: x - centre.x, y: y - centre.y }));
}
