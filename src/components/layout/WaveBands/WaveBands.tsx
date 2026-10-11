"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";
import { nextWaveFill, waveFrontInBand } from "@/lib/motion/waveFill";

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

    let fill = 0;
    let lastScrollY = window.scrollY;
    let frameId = 0;

    const applyFill = () => {
      frameId = 0;
      bands.forEach((band) => {
        const front = waveFrontInBand(band.getBoundingClientRect().top, fill, window.innerHeight);
        band.style.setProperty("--wave-front", `${front}px`);
      });
    };
    const followScroll = () => {
      fill = nextWaveFill(fill, window.scrollY - lastScrollY, window.innerHeight);
      lastScrollY = window.scrollY;
      if (!frameId) frameId = requestAnimationFrame(applyFill);
    };

    bands.forEach((band) => band.setAttribute("data-wave-masked", ""));
    applyFill();
    window.addEventListener("scroll", followScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", followScroll);
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
