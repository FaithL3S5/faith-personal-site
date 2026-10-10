import styles from "./styles/HeroLetterPanel.module.css";

export const heroLetters = ["F", "A", "I", "T", "H"] as const;

export function HeroLetterPanel() {
  return (
    <div className={styles.panel}>
      <span aria-hidden="true" className={styles.verticalRule} />
      <span aria-hidden="true" className={styles.horizontalRule} />
      <span aria-hidden="true" className={styles.letter} data-hero-letter="">
        F
      </span>
      <span className={styles.tag}>00 / Hero</span>
      <span lang="ja" aria-hidden="true" className={styles.katakana}>
        ポートフォリオ
      </span>
      <div aria-hidden="true" className={styles.index}>
        {heroLetters.map((letter, position) => (
          <span
            key={letter}
            className={styles.box}
            data-hero-box={position}
            data-active={position === 0 ? "" : undefined}
          >
            {letter}
          </span>
        ))}
        <span className={styles.counter} data-hero-counter="">
          01 / 05
        </span>
      </div>
      <div aria-hidden="true" className={styles.edition}>
        <span className={styles.editionBlock} />
        <span className={styles.editionLabel}>Ed. 2026</span>
      </div>
    </div>
  );
}
