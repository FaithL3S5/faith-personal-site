"use client";

import { utils } from "animejs";
import { useCallback, useRef } from "react";
import { jellyEyesSelector, useJellyBlink } from "@/hooks/useJellyBlink";
import { useWhileOnScreen } from "@/hooks/useWhileOnScreen";
import { clampEyeOffset, keepUnderSlopingTop } from "@/lib/motion/jellyMotion";
import { RoundEyes } from "../JellyFigure/JellyEyes";
import { JellyFigure } from "../JellyFigure/JellyFigure";
import { eyeCenters } from "../JellyFigure/jellyShapes";

const eyeBounds = { left: 560, right: 280, up: 110, down: 320 };
const eyeDropAtFullLeft = 90;
const pointerFollowShare = 0.35;
const finePointerQuery = "(pointer: fine)";
const eyesCenter = {
  x: (eyeCenters.leftLookingUp[0].x + eyeCenters.leftLookingUp[1].x) / 2,
  y: (eyeCenters.leftLookingUp[0].y + eyeCenters.leftLookingUp[1].y) / 2,
};

export function FooterJelly({ className }: { className: string }) {
  const figureRef = useRef<SVGSVGElement>(null);
  useJellyBlink(figureRef);

  const startFollowingCursor = useCallback(() => {
    const figure = figureRef.current;
    const eyes = figure?.querySelector(jellyEyesSelector);
    if (!figure || !eyes || !window.matchMedia(finePointerQuery).matches) return () => {};

    let frameId = 0;
    let latestPointer = { x: 0, y: 0 };
    const updateEyes = () => {
      frameId = 0;
      const bounds = figure.getBoundingClientRect();
      const viewBox = figure.viewBox.baseVal;
      const unitsPerPixel = viewBox.width / bounds.width;
      const pointerX = viewBox.x + (latestPointer.x - bounds.left) * unitsPerPixel;
      const pointerY = viewBox.y + (latestPointer.y - bounds.top) * unitsPerPixel;
      const offset = keepUnderSlopingTop(
        clampEyeOffset(
          (pointerX - eyesCenter.x) * pointerFollowShare,
          (pointerY - eyesCenter.y) * pointerFollowShare,
          eyeBounds,
        ),
        eyeBounds,
        eyeDropAtFullLeft,
      );
      utils.set(eyes, { translateX: offset.x, translateY: offset.y });
    };
    const followPointer = (event: PointerEvent) => {
      latestPointer = { x: event.clientX, y: event.clientY };
      if (!frameId) frameId = requestAnimationFrame(updateEyes);
    };

    window.addEventListener("pointermove", followPointer, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", followPointer);
      utils.set(eyes, { translateX: 0, translateY: 0 });
    };
  }, []);
  useWhileOnScreen(figureRef, startFollowingCursor);

  return (
    <JellyFigure ref={figureRef} facing="left" isOutlined label="Jelly looking up" className={className}>
      <RoundEyes centers={eyeCenters.leftLookingUp} />
    </JellyFigure>
  );
}
