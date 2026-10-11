"use client";

import { useRef } from "react";
import { useJellyBlink } from "@/hooks/useJellyBlink";
import { RoundEyes } from "../JellyFigure/JellyEyes";
import { JellyFigure } from "../JellyFigure/JellyFigure";
import { eyeCenters } from "../JellyFigure/jellyShapes";

function RaisedEyebrow() {
  return (
    <g>
      <path
        fill="#fff"
        d="M444.72,1041.65l33.98,40.82-72.85,33.89-31.88-41.58c12.69-5.94,24.6-13.02,37.29-18.96,10.9-5.1,22.96-9.36,33.46-14.17Z"
      />
      <path
        fill="none"
        stroke="#141414"
        strokeWidth={50}
        d="M630.36,1182.61c-24.36,4.66-79.24-5.09-140.51-44.3-70.67-45.23-107.44-122.81-120.29-153.03"
      />
      <line fill="none" stroke="#141414" strokeWidth={50} x1="1227.19" y1="1225.11" x2="890.81" y2="1270.95" />
    </g>
  );
}

export function NdaJelly({ className }: { className: string }) {
  const figureRef = useRef<SVGSVGElement>(null);
  useJellyBlink(figureRef);

  return (
    <JellyFigure ref={figureRef} facing="right" label="Jelly raising an eyebrow" className={className}>
      <RoundEyes centers={eyeCenters.rightNeutral} />
      <RaisedEyebrow />
    </JellyFigure>
  );
}
