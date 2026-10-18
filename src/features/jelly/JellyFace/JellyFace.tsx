import type { Ref } from "react";
import { ClosedEyes, RoundEyes, SquintEyes } from "@/components/jelly/JellyFigure/JellyEyes";
import { softJellyBrows, softJellyEyes } from "../softJellyShape";
import styles from "./styles/JellyFace.module.css";

export const browKnockoutId = "jelly-brow-knockout";

type JellyFaceProps = {
  faceRef: Ref<SVGGElement>;
  eyesRef: Ref<SVGGElement>;
  lookRef: Ref<SVGGElement>;
  raisedBrowRef: Ref<SVGGElement>;
};

export function JellyFace({ faceRef, eyesRef, lookRef, raisedBrowRef }: JellyFaceProps) {
  return (
    <g ref={faceRef} className={styles.face} data-expression="open">
      <g ref={eyesRef}>
        <g ref={lookRef} className={styles.open}>
          <RoundEyes centers={softJellyEyes} />
          <line {...softJellyBrows.flat} className={styles.brow} stroke="#141414" strokeWidth={50} />
        </g>
        <g className={styles.squint}>
          <SquintEyes />
        </g>
        <g className={styles.closed}>
          <ClosedEyes />
        </g>
      </g>
      <g ref={raisedBrowRef} className={styles.brow}>
        <path d={softJellyBrows.raised} fill="none" stroke="#141414" strokeWidth={50} />
      </g>
    </g>
  );
}

export function BrowKnockout({ maskBrowRef, gap }: { maskBrowRef: Ref<SVGGElement>; gap: number }) {
  return (
    <defs>
      <mask id={browKnockoutId} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
        <rect width="100%" height="100%" fill="#fff" />
        <g ref={maskBrowRef}>
          <path d={softJellyBrows.raised} fill="none" stroke="#000" strokeWidth={50 + gap * 2} />
        </g>
      </mask>
    </defs>
  );
}
