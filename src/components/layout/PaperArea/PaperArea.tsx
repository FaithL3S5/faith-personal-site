import type { ReactNode } from "react";
import { wideScreenWave } from "@/content/site";
import { WaveBands } from "../WaveBands/WaveBands";
import styles from "./styles/PaperArea.module.css";

export function PaperArea({ children }: { children: ReactNode }) {
  const waveClassName = styles[wideScreenWave];

  return (
    <div className={styles.paperArea}>
      <WaveBands
        leftClassName={`${styles.waveBand} ${styles.leftBand} ${waveClassName}`}
        rightClassName={`${styles.waveBand} ${styles.rightBand} ${waveClassName}`}
      />
      {children}
    </div>
  );
}
