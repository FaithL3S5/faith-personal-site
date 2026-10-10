import type { ReactNode } from "react";
import styles from "./styles/Eyebrow.module.css";

type EyebrowProps = {
  children: ReactNode;
  className?: string;
};

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span className={className ? `${styles.eyebrow} ${className}` : styles.eyebrow}>
      <span aria-hidden="true" className={styles.square} />
      {children}
    </span>
  );
}
