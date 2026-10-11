export const blinkClosedMs = 120;

export function nextBlinkDelayMs(random: () => number = Math.random): number {
  return 3000 + random() * 3000;
}

export type EyeOffset = { x: number; y: number };

export type EyeBounds = { left: number; right: number; up: number; down: number };

export function clampEyeOffset(deltaX: number, deltaY: number, bounds: EyeBounds): EyeOffset {
  const horizontalBound = deltaX < 0 ? bounds.left : bounds.right;
  const verticalBound = deltaY < 0 ? bounds.up : bounds.down;
  const reach = Math.hypot(deltaX / horizontalBound, deltaY / verticalBound);
  if (reach <= 1) return { x: deltaX, y: deltaY };
  return { x: deltaX / reach, y: deltaY / reach };
}

export function keepUnderSlopingTop(offset: EyeOffset, bounds: EyeBounds, dropAtFullLeft: number): EyeOffset {
  const leftShare = Math.min(1, Math.max(0, -offset.x) / bounds.left);
  const highestY = -bounds.up + leftShare * (bounds.up + dropAtFullLeft);
  return { x: offset.x, y: Math.max(offset.y, highestY) };
}

export function randomEyeOffset(maxOffset: number, random: () => number = Math.random): EyeOffset {
  const angle = random() * Math.PI * 2;
  const distance = maxOffset * (0.5 + random() * 0.5);
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
}
