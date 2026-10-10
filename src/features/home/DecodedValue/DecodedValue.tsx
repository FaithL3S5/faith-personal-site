"use client";

import { createTimer } from "animejs";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { decodeFrame, pickScrambleCharacter } from "@/lib/motion/decodeText";
import { hasPlayed, markPlayed } from "@/lib/motion/playOnce";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";
import styles from "./styles/DecodedValue.module.css";

const firstCellDelayMs = 400;
const cellStaggerMs = 120;
const lockIntervalMs = 35;
const rerollIntervalMs = 40;

type DecodedValueProps = {
  order: number;
  children: ReactNode;
};

export function DecodedValue({ order, children }: DecodedValueProps) {
  const realLayerRef = useRef<HTMLSpanElement>(null);
  const [scrambledFrame, setScrambledFrame] = useState<string | null>(null);

  useEffect(() => {
    const playKey = `spec-decode-${order}`;
    if (hasPlayed(playKey) || prefersReducedMotion()) return;

    let decodeTimer: ReturnType<typeof createTimer> | undefined;
    const startTimeout = setTimeout(() => {
      markPlayed(playKey);
      const target = realLayerRef.current?.textContent ?? "";
      let scrambledCharacters = [...target].map(() => pickScrambleCharacter());
      let lastRerollTick = 0;

      decodeTimer = createTimer({
        duration: target.length * lockIntervalMs,
        onUpdate: (timer) => {
          const rerollTick = Math.floor(timer.currentTime / rerollIntervalMs);
          if (rerollTick !== lastRerollTick) {
            lastRerollTick = rerollTick;
            scrambledCharacters = scrambledCharacters.map(() => pickScrambleCharacter());
          }
          const lockedCount = Math.floor(timer.currentTime / lockIntervalMs);
          setScrambledFrame(decodeFrame(target, lockedCount, scrambledCharacters));
        },
        onComplete: () => setScrambledFrame(null),
      });
    }, firstCellDelayMs + order * cellStaggerMs);

    return () => {
      clearTimeout(startTimeout);
      decodeTimer?.revert();
      setScrambledFrame(null);
    };
  }, [order]);

  return (
    <span className={styles.decoded} data-decoding={scrambledFrame === null ? undefined : ""}>
      <span ref={realLayerRef} className={styles.realLayer}>
        {children}
      </span>
      {scrambledFrame !== null && (
        <span aria-hidden="true" className={styles.scrambleLayer}>
          {scrambledFrame}
        </span>
      )}
    </span>
  );
}
