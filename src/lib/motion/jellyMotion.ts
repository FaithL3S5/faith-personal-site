export const blinkClosedMs = 120;

export function nextBlinkDelayMs(random: () => number = Math.random): number {
  return 3000 + random() * 3000;
}

export type EyeOffset = { x: number; y: number };

export type EyeBounds = { horizontal: number; up: number; down: number };

export function clampEyeOffset(deltaX: number, deltaY: number, bounds: EyeBounds): EyeOffset {
  const verticalBound = deltaY < 0 ? bounds.up : bounds.down;
  const reach = Math.hypot(deltaX / bounds.horizontal, deltaY / verticalBound);
  if (reach <= 1) return { x: deltaX, y: deltaY };
  return { x: deltaX / reach, y: deltaY / reach };
}

export function randomEyeOffset(maxOffset: number, random: () => number = Math.random): EyeOffset {
  const angle = random() * Math.PI * 2;
  const distance = maxOffset * (0.5 + random() * 0.5);
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
}
