"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";
import { waveFillForScroll, waveFrontInBand } from "@/lib/motion/waveFill";

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

    let frameId = 0;

    const applyFill = () => {
      frameId = 0;
      const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
      const fill = waveFillForScroll(window.scrollY, maxScrollTop, window.innerHeight);
      bands.forEach((band) => {
        const front = waveFrontInBand(band.getBoundingClientRect().top, fill, window.innerHeight);
        band.style.setProperty("--wave-front", `${front}px`);
      });
    };
    const scheduleFill = () => {
      if (!frameId) frameId = requestAnimationFrame(applyFill);
    };

    bands.forEach((band) => band.setAttribute("data-wave-masked", ""));
    applyFill();
    window.addEventListener("scroll", scheduleFill, { passive: true });
    window.addEventListener("resize", scheduleFill);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleFill);
      window.removeEventListener("resize", scheduleFill);
      bands.forEach((band) => {
        band.removeAttribute("data-wave-masked");
        band.style.removeProperty("--wave-front");
      });
    };
  }, []);

  return (
    <>
      <span ref={leftBandRef} aria-hidden="true" className={leftClassName} />
      <span ref={rightBandRef} aria-hidden="true" className={rightClassName} />
    </>
  );
}
