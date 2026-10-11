"use client";

import { useCallback, useRef, useState } from "react";
import { playBlink } from "@/hooks/useJellyBlink";
import { useWhileOnScreen } from "@/hooks/useWhileOnScreen";
import { RoundEyes } from "../JellyFigure/JellyEyes";
import { JellyFigure } from "../JellyFigure/JellyFigure";
import { eyeCenters } from "../JellyFigure/jellyShapes";

const lookingDownMs = 4000;
const neutralMs = 2600;
const blinkIntoNeutralMs = 1200;

export function HeroJelly({ className }: { className: string }) {
  const figureRef = useRef<SVGSVGElement>(null);
  const [isLookingDown, setIsLookingDown] = useState(true);

  const startPoseLoop = useCallback(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const runCycle = () => {
      timeouts.push(
        setTimeout(() => {
          setIsLookingDown(false);
          timeouts.push(setTimeout(() => playBlink(figureRef.current), blinkIntoNeutralMs));
          timeouts.push(
            setTimeout(() => {
              setIsLookingDown(true);
              runCycle();
            }, neutralMs),
          );
        }, lookingDownMs),
      );
    };

    runCycle();
    return () => {
      timeouts.forEach(clearTimeout);
      setIsLookingDown(true);
    };
  }, []);
  useWhileOnScreen(figureRef, startPoseLoop);

  return (
    <JellyFigure ref={figureRef} facing="right" label="Jelly looking down at the page" className={className}>
      <RoundEyes centers={isLookingDown ? eyeCenters.rightLookingDown : eyeCenters.rightNeutral} />
    </JellyFigure>
  );
}
