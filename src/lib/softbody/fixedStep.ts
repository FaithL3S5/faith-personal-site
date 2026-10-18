export type FixedStepper = {
  stepSeconds: number;
  advance: (elapsedMs: number) => { steps: number; alpha: number };
};

const longestFrameMs = 250;

export function createFixedStepper(stepsPerSecond: number, maxStepsPerFrame: number): FixedStepper {
  const stepMs = 1000 / stepsPerSecond;
  let accumulatedMs = 0;

  return {
    stepSeconds: 1 / stepsPerSecond,
    advance(elapsedMs) {
      accumulatedMs += Math.min(Math.max(elapsedMs, 0), longestFrameMs);
      const steps = Math.min(Math.floor(accumulatedMs / stepMs), maxStepsPerFrame);
      accumulatedMs = Math.min(accumulatedMs - steps * stepMs, stepMs);
      return { steps, alpha: Math.min(accumulatedMs / stepMs, 1) };
    },
  };
}
