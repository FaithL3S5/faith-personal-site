"use client";

import { useRef } from "react";
import { useJellyBlink } from "@/hooks/useJellyBlink";
import { RoundEyes } from "../JellyFigure/JellyEyes";
import { JellyFigure } from "../JellyFigure/JellyFigure";
import { eyeCenters } from "../JellyFigure/jellyShapes";

export function HeroJelly({ className }: { className: string }) {
  const figureRef = useRef<SVGSVGElement>(null);
  useJellyBlink(figureRef);

  return (
    <JellyFigure ref={figureRef} facing="right" label="Jelly looking down at the page" className={className}>
      <RoundEyes centers={eyeCenters.rightLookingDown} />
    </JellyFigure>
  );
}
