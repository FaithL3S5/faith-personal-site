"use client";

import { useEffect, type RefObject } from "react";
import { playBlink } from "@/hooks/useJellyBlink";
import { nextBlinkDelayMs } from "@/lib/motion/jellyMotion";

export function useBlinkTimer(figureRef: RefObject<SVGSVGElement | null>) {
  useEffect(() => {
    let blinkTimeout: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      blinkTimeout = setTimeout(() => {
        playBlink(figureRef.current);
        scheduleBlink();
      }, nextBlinkDelayMs());
    };

    scheduleBlink();
    return () => clearTimeout(blinkTimeout);
  }, [figureRef]);
}
