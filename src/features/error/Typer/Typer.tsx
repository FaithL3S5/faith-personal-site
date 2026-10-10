"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";
import { truncateMiddle } from "@/lib/truncateMiddle";
import styles from "./styles/Typer.module.css";

const maxDisplayLength = 48;
const startDelayMs = 300;
const characterIntervalMs = 45;

export function Typer({ value }: { value: string }) {
  const displayCharacters = [...truncateMiddle(value, maxDisplayLength)];
  const [typedCount, setTypedCount] = useState(displayCharacters.length);
  const isTyping = typedCount < displayCharacters.length;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const totalCharacters = [...truncateMiddle(value, maxDisplayLength)].length;
    const timeouts = Array.from({ length: totalCharacters + 1 }, (_, count) =>
      setTimeout(() => setTypedCount(count), count === 0 ? 0 : startDelayMs + count * characterIntervalMs),
    );
    return () => timeouts.forEach(clearTimeout);
  }, [value]);

  return (
    <span className={styles.typer}>
      <span className={styles.accessibleValue}>{value}</span>
      <span aria-hidden="true">
        {displayCharacters.slice(0, typedCount).join("")}
        <span className={isTyping ? styles.cursor : `${styles.cursor} ${styles.blinking}`} />
      </span>
    </span>
  );
}
