"use client";

import { animate } from "animejs";
import { useCallback, type RefObject } from "react";
import { blinkClosedMs, nextBlinkDelayMs } from "@/lib/motion/jellyMotion";
import { useWhileOnScreen } from "./useWhileOnScreen";

export const jellyEyesSelector = "[data-jelly-eyes]";

export function playBlink(figure: SVGSVGElement | null) {
  const eyes = figure?.querySelector(jellyEyesSelector);
  if (!eyes) return;
  animate(eyes, {
    scaleY: [
      { to: 0.1, duration: 60 },
      { to: 0.1, duration: blinkClosedMs },
      { to: 1, duration: 60 },
    ],
  });
}

export function useJellyBlink(figureRef: RefObject<SVGSVGElement | null>, isPaused = false) {
  const startBlinking = useCallback(() => {
    let blinkTimeout: ReturnType<typeof setTimeout>;

    const scheduleBlink = () => {
      blinkTimeout = setTimeout(() => {
        if (!isPaused) playBlink(figureRef.current);
        scheduleBlink();
      }, nextBlinkDelayMs());
    };

    scheduleBlink();
    return () => clearTimeout(blinkTimeout);
  }, [figureRef, isPaused]);

  useWhileOnScreen(figureRef, startBlinking);
}
