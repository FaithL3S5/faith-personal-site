"use client";

import { useEffect, useState } from "react";
import { isHeadlineGagEnabled } from "@/content/site";
import {
  gagFirstLine,
  headlineGagAttribute,
  headlineGagTimeline,
  type HeadlineGagStage,
} from "@/lib/motion/headlineGag";
import styles from "./styles/HeroHeadline.module.css";

export function HeroHeadline({ className }: { className: string }) {
  const [gagStage, setGagStage] = useState<HeadlineGagStage>("typo");
  const { beforeCursor, afterCursor } = gagFirstLine(gagStage);
  const isCursorVisible = gagStage === "cursor" || gagStage === "deleted" || gagStage === "corrected";

  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute(headlineGagAttribute)) return;

    const timeouts = headlineGagTimeline.map(({ stage, atMs }) =>
      setTimeout(() => {
        setGagStage(stage);
        if (stage === "done") root.removeAttribute(headlineGagAttribute);
      }, atMs),
    );
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <h1 id="hero-title" className={`${styles.headline} ${className}`} data-reveal-item="">
      <span className={styles.realText}>
        <span className={styles.line}>FULL-STACK</span> <span className={styles.line}>DEVELOPER</span>
      </span>
      {isHeadlineGagEnabled && (
        <span aria-hidden="true" className={styles.gagLayer}>
          <span key={gagStage} className={styles.line}>
            {beforeCursor}
            {isCursorVisible && (
              <span className={gagStage === "corrected" ? `${styles.cursor} ${styles.blinking}` : styles.cursor} />
            )}
            {afterCursor}
          </span>
          <span className={styles.line}>DEVELOPER</span>
        </span>
      )}
    </h1>
  );
}
