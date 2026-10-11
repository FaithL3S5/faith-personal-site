"use client";

import { animate } from "animejs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLoopWhileVisible } from "@/hooks/useLoopWhileVisible";
import { easeOut } from "@/lib/motion/motionTokens";
import styles from "./styles/HeroLetterPanel.module.css";

export const heroLetters = ["F", "A", "I", "T", "H"] as const;

const beatMs = 560;

export function HeroLetterPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLSpanElement>(null);
  const [beatCount, setBeatCount] = useState(0);
  const activeLetterIndex = beatCount % heroLetters.length;

  const advanceLetter = useCallback(() => setBeatCount((count) => count + 1), []);
  useLoopWhileVisible(panelRef, advanceLetter, beatMs);

  useEffect(() => {
    if (beatCount === 0 || !letterRef.current) return;
    const drift = animate(letterRef.current, {
      translateX: { from: "-3rem", to: "0rem" },
      duration: 520,
      ease: easeOut,
    });
    return () => {
      drift.revert();
    };
  }, [beatCount]);

  return (
    <div ref={panelRef} className={styles.panel}>
      <span aria-hidden="true" className={styles.verticalRule} />
      <span aria-hidden="true" className={styles.horizontalRule} />
      <span ref={letterRef} aria-hidden="true" className={styles.letter} data-hero-letter="">
        {heroLetters[activeLetterIndex]}
      </span>
      <span className={styles.tag}>00 / Hero</span>
      <span lang="ja" aria-hidden="true" className={styles.katakana}>
        ポートフォリオ
      </span>
      <div aria-hidden="true" className={styles.index}>
        {heroLetters.map((letter, position) => (
          <span
            key={letter}
            className={styles.box}
            data-hero-box={position}
            data-active={position === activeLetterIndex ? "" : undefined}
          >
            {letter}
          </span>
        ))}
        <span className={styles.counter} data-hero-counter="">
          {String(activeLetterIndex + 1).padStart(2, "0")} / 05
        </span>
      </div>
      <div aria-hidden="true" className={styles.edition}>
        <span className={styles.editionBlock} />
        <span className={styles.editionLabel}>Ed. 2026</span>
      </div>
    </div>
  );
}
