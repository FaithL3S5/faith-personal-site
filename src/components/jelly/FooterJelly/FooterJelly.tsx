"use client";

import { utils } from "animejs";
import { useCallback, useRef } from "react";
import { jellyEyesSelector, useJellyBlink } from "@/hooks/useJellyBlink";
import { useWhileOnScreen } from "@/hooks/useWhileOnScreen";
import { clampEyeOffset } from "@/lib/motion/jellyMotion";
import { RoundEyes } from "../JellyFigure/JellyEyes";
import { JellyFigure } from "../JellyFigure/JellyFigure";
import { eyeCenters } from "../JellyFigure/jellyShapes";

const maxEyeOffset = 110;
const finePointerQuery = "(pointer: fine)";

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
      const unitsPerPixel = figure.viewBox.baseVal.width / bounds.width;
      const offset = clampEyeOffset(
        (latestPointer.x - (bounds.left + bounds.width / 2)) * unitsPerPixel * 0.2,
        (latestPointer.y - (bounds.top + bounds.height / 2)) * unitsPerPixel * 0.2,
        maxEyeOffset,
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
