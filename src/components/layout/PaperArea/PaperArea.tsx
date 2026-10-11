import type { ReactNode } from "react";
import { wideScreenWave } from "@/content/site";
import styles from "./styles/PaperArea.module.css";

export function PaperArea({ children }: { children: ReactNode }) {
  const waveClassName = styles[wideScreenWave];

  return (
    <div className={styles.paperArea}>
      <span aria-hidden="true" className={`${styles.waveBand} ${styles.leftBand} ${waveClassName}`} />
      <span aria-hidden="true" className={`${styles.waveBand} ${styles.rightBand} ${waveClassName}`} />
      {children}
    </div>
  );
}
