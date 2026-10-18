"use client";

import { useEffect, useRef } from "react";
import { createFixedStepper } from "@/lib/softbody/fixedStep";

type FixedStepLoop = {
  stepsPerSecond: number;
  maxStepsPerFrame: number;
  isRunning: boolean;
  step: (seconds: number) => void;
  render: (alpha: number) => void;
};

export function useFixedStepLoop({ stepsPerSecond, maxStepsPerFrame, isRunning, step, render }: FixedStepLoop) {
  const stepRef = useRef(step);
  const renderRef = useRef(render);

  useEffect(() => {
    stepRef.current = step;
    renderRef.current = render;
  });

  useEffect(() => {
    if (!isRunning) return;
    const stepper = createFixedStepper(stepsPerSecond, maxStepsPerFrame);
    let previousTime: number | null = null;
    let frameId = 0;

    const tick = (time: number) => {
      const { steps, alpha } = stepper.advance(previousTime === null ? 0 : time - previousTime);
      previousTime = time;
      for (let index = 0; index < steps; index++) stepRef.current(stepper.stepSeconds);
      renderRef.current(alpha);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [stepsPerSecond, maxStepsPerFrame, isRunning]);
}
