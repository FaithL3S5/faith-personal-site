"use client";

import { animate } from "animejs";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";
import { planStatusCount } from "@/lib/motion/statusCount";

const countDurationMs = 700;

export function CountUpStatus({ statusCode, className }: { statusCode: string; className: string }) {
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const statusElement = statusRef.current;
    if (!statusElement || prefersReducedMotion()) return;

    const { countTo, format } = planStatusCount(statusCode);
    const counter = { value: 0 };
    statusElement.textContent = format(0);
    const countUp = animate(counter, {
      value: countTo,
      duration: countDurationMs,
      modifier: Math.round,
      onUpdate: () => {
        statusElement.textContent = format(counter.value);
      },
    });

    return () => {
      countUp.revert();
      statusElement.textContent = statusCode;
    };
  }, [statusCode]);

  return (
    <p ref={statusRef} className={className}>
      {statusCode}
    </p>
  );
}
