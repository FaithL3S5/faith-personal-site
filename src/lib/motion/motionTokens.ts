import { cubicBezier } from "animejs";

export const easeOut = cubicBezier(0.16, 1, 0.3, 1);
export const easeLine = cubicBezier(0.65, 0, 0.35, 1);

export const durations = {
  fast: 150,
  base: 500,
  line: 600,
} as const;

export const riseDistance = "0.75rem";
export const siblingStagger = 60;
