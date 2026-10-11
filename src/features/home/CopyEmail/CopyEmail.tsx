"use client";

import { useRef } from "react";
import { RoundEyes, SquintEyes } from "@/components/jelly/JellyFigure/JellyEyes";
import { JellyFigure } from "@/components/jelly/JellyFigure/JellyFigure";
import { eyeCenters } from "@/components/jelly/JellyFigure/jellyShapes";
import { email } from "@/content/site";
import { useCopyEmail } from "@/hooks/useCopyEmail";
import { useJellyBlink } from "@/hooks/useJellyBlink";
import { playCopyJump } from "@/lib/motion/copyJump";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";
import styles from "./styles/CopyEmail.module.css";

export function CopyEmail() {
  const { isCopied, copyEmail } = useCopyEmail(email);
  const figureRef = useRef<SVGSVGElement>(null);
  const isJumpingRef = useRef(false);
  useJellyBlink(figureRef, isCopied);

  const copyAndJump = async () => {
    const isCopySuccessful = await copyEmail();
    const figure = figureRef.current;
    if (!isCopySuccessful || !figure || isJumpingRef.current || prefersReducedMotion()) return;

    isJumpingRef.current = true;
    figure.setAttribute("data-jumping", "");
    playCopyJump(figure, () => {
      isJumpingRef.current = false;
      figure.removeAttribute("data-jumping");
    });
  };

  return (
    <span className={styles.actions}>
      <button type="button" className={styles.copyButton} onClick={copyAndJump}>
        {isCopied ? "Copied" : "Copy"}
      </button>
      <JellyFigure
        ref={figureRef}
        facing="right"
        label={isCopied ? "Jelly squinting" : "Jelly waiting"}
        className={styles.jelly}
      >
        {isCopied ? <SquintEyes /> : <RoundEyes centers={eyeCenters.rightNeutral} />}
      </JellyFigure>
      <span role="status" className={styles.status}>
        {isCopied ? "Email copied" : ""}
      </span>
    </span>
  );
}
