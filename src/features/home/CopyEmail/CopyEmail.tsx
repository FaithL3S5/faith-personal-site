"use client";

import { JellyFigure } from "@/components/jelly/JellyFigure/JellyFigure";
import { RoundEyes, SquintEyes } from "@/components/jelly/JellyFigure/JellyEyes";
import { eyeCenters } from "@/components/jelly/JellyFigure/jellyShapes";
import { email } from "@/content/site";
import { useCopyEmail } from "@/hooks/useCopyEmail";
import styles from "./styles/CopyEmail.module.css";

export function CopyEmail() {
  const { isCopied, copyEmail } = useCopyEmail(email);

  return (
    <span className={styles.actions}>
      <button type="button" className={styles.copyButton} onClick={copyEmail}>
        {isCopied ? "Copied" : "Copy"}
      </button>
      <JellyFigure
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
