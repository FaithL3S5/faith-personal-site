import type { ReactNode } from "react";
import styles from "./styles/Ruler.module.css";

const tickLabels = Array.from({ length: 13 }, (_, index) => String(index).padStart(2, "0"));

export function Ruler({ children }: { children?: ReactNode }) {
  return (
    <div aria-hidden="true" className={styles.ruler}>
      <div className={styles.scale}>
        {tickLabels.map((label, index) => (
          <span key={label} className={styles.label} data-tick={index}>
            {label}
          </span>
        ))}
        {children}
      </div>
    </div>
  );
}
