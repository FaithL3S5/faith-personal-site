import { sections } from "@/content/sections";
import styles from "./styles/SectionProgress.module.css";

type SectionProgressProps = {
  currentNumber: string;
  className?: string;
};

export function SectionProgress({ currentNumber, className }: SectionProgressProps) {
  return (
    <div aria-hidden="true" className={className ? `${styles.progress} ${className}` : styles.progress}>
      {sections.map((section) => (
        <span
          key={section.id}
          className={styles.segment}
          data-progress-segment=""
          data-current={section.number === currentNumber ? "" : undefined}
        />
      ))}
      <span className={styles.count}>
        {currentNumber} / {String(sections.length).padStart(2, "0")}
      </span>
    </div>
  );
}
