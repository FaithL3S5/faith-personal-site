export const blinkClosedMs = 120;

export function nextBlinkDelayMs(random: () => number = Math.random): number {
  return 3000 + random() * 3000;
}

export type EyeOffset = { x: number; y: number };

export function clampEyeOffset(deltaX: number, deltaY: number, maxOffset: number): EyeOffset {
  const distance = Math.hypot(deltaX, deltaY);
  if (distance <= maxOffset) return { x: deltaX, y: deltaY };
  const scale = maxOffset / distance;
  return { x: deltaX * scale, y: deltaY * scale };
}

export function randomEyeOffset(maxOffset: number, random: () => number = Math.random): EyeOffset {
  const angle = random() * Math.PI * 2;
  const distance = maxOffset * (0.5 + random() * 0.5);
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
}
