"use client";

import { animate } from "animejs";
import { useEffect, useRef, useState } from "react";
import { easeOut } from "@/lib/motion/motionTokens";
import { hasPlayed, markPlayed } from "@/lib/motion/playOnce";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";
import styles from "./styles/HeroLetterPanel.module.css";

export const heroLetters = ["F", "A", "I", "T", "H"] as const;

const letterSequence = [0, 1, 2, 3, 4, 0];
const beatMs = 560;
const playKey = "hero-letters";

export function HeroLetterPanel() {
  const letterRef = useRef<HTMLSpanElement>(null);
  const [sequenceStep, setSequenceStep] = useState<number | null>(null);
  const activeLetterIndex = letterSequence[sequenceStep ?? 0];

  useEffect(() => {
    if (hasPlayed(playKey) || prefersReducedMotion()) return;
    const timeouts = letterSequence.map((_, step) =>
      setTimeout(() => {
        markPlayed(playKey);
        setSequenceStep(step);
      }, step * beatMs),
    );
    return () => timeouts.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (sequenceStep === null || !letterRef.current) return;
    const drift = animate(letterRef.current, {
      translateX: { from: "-3rem", to: "0rem" },
      duration: 520,
      ease: easeOut,
    });
    return () => {
      drift.revert();
    };
  }, [sequenceStep]);

  return (
    <div className={styles.panel}>
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
