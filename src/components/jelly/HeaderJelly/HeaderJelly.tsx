"use client";

import { animate, utils } from "animejs";
import { useCallback, useRef } from "react";
import { jellyEyesSelector, useJellyBlink } from "@/hooks/useJellyBlink";
import { useWhileOnScreen } from "@/hooks/useWhileOnScreen";
import { randomEyeOffset } from "@/lib/motion/jellyMotion";
import { easeOut } from "@/lib/motion/motionTokens";
import { RoundEyes } from "../JellyFigure/JellyEyes";
import { JellyFigure } from "../JellyFigure/JellyFigure";
import { eyeCenters } from "../JellyFigure/jellyShapes";

const driftIntervalMs = 4500;
const driftHoldMs = 1400;
const driftMoveMs = 450;
const maxDriftOffset = 150;

export function HeaderJelly({ className }: { className: string }) {
  const figureRef = useRef<SVGSVGElement>(null);
  useJellyBlink(figureRef);

  const startDrifting = useCallback(() => {
    const eyes = figureRef.current?.querySelector(jellyEyesSelector);
    if (!eyes) return () => {};
    let returnTimeout: ReturnType<typeof setTimeout>;

    const driftOnce = () => {
      const offset = randomEyeOffset(maxDriftOffset);
      animate(eyes, { translateX: offset.x, translateY: offset.y, duration: driftMoveMs, ease: easeOut });
      returnTimeout = setTimeout(
        () => animate(eyes, { translateX: 0, translateY: 0, duration: driftMoveMs, ease: easeOut }),
        driftHoldMs,
      );
    };

    const driftInterval = setInterval(driftOnce, driftIntervalMs);
    return () => {
      clearInterval(driftInterval);
      clearTimeout(returnTimeout);
      utils.set(eyes, { translateX: 0, translateY: 0 });
    };
  }, []);
  useWhileOnScreen(figureRef, startDrifting);

  return (
    <JellyFigure
      ref={figureRef}
      facing="right"
      isOutlined
      label="Jelly, the mascot, looking around"
      className={className}
    >
      <RoundEyes centers={eyeCenters.rightNeutral} />
    </JellyFigure>
  );
}
