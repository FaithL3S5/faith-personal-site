"use client";

import { useLiveClock } from "@/hooks/useLiveClock";
import styles from "./styles/LiveClock.module.css";

export function LiveClock() {
  return <span className={styles.clock}>{useLiveClock()}</span>;
}
