"use client";

import { useLiveClock } from "@/hooks/useLiveClock";
import styles from "./styles/LiveClock.module.css";

const slottedCharacter = /[0-9-]/;

export function LiveClock() {
  const [time, suffix] = useLiveClock().split(" ");

  return (
    <span className={styles.clock}>
      {[...time].map((character, position) =>
        slottedCharacter.test(character) ? (
          <span key={position} className={styles.digitSlot} data-clock-digit="">
            {character}
          </span>
        ) : (
          character
        ),
      )}{" "}
      {suffix}
    </span>
  );
}
