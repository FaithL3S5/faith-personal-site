import type { ExperienceEntry } from "@/content/home";
import styles from "./styles/ExperienceRow.module.css";

export function ExperienceRow({ entry }: { entry: ExperienceEntry }) {
  return (
    <li className={styles.row} data-reveal-item="">
      <span aria-hidden="true" className={styles.number}>
        {entry.number}
      </span>
      <h3 className={styles.company}>{entry.company}</h3>
      <p className={styles.role}>{entry.role}</p>
      <p className={styles.period}>
        {entry.isCurrent && (
          <span className={styles.badge}>
            <span aria-hidden="true" className={styles.badgeDot} />
            Now
          </span>
        )}
        {entry.period}
      </p>
    </li>
  );
}
