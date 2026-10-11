"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";

const restAfterScrollMs = 1000;

type WaveBandsProps = {
  leftClassName: string;
  rightClassName: string;
};

export function WaveBands({ leftClassName, rightClassName }: WaveBandsProps) {
  const leftBandRef = useRef<HTMLSpanElement>(null);
  const rightBandRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bands = [leftBandRef.current, rightBandRef.current].filter(
      (band): band is HTMLSpanElement => band !== null,
    );
    if (prefersReducedMotion()) return;

    const setWaveState = (state: "resting" | "scrolling") =>
      bands.forEach((band) => band.setAttribute("data-wave-state", state));
    let restTimeout: ReturnType<typeof setTimeout> | undefined;

    const showWhileScrolling = () => {
      setWaveState("scrolling");
      clearTimeout(restTimeout);
      restTimeout = setTimeout(() => setWaveState("resting"), restAfterScrollMs);
    };

    setWaveState("resting");
    window.addEventListener("scroll", showWhileScrolling, { passive: true });
    return () => {
      clearTimeout(restTimeout);
      window.removeEventListener("scroll", showWhileScrolling);
      bands.forEach((band) => band.removeAttribute("data-wave-state"));
    };
  }, []);

  return (
    <>
      <span ref={leftBandRef} aria-hidden="true" className={leftClassName} />
      <span ref={rightBandRef} aria-hidden="true" className={rightClassName} />
    </>
  );
}
