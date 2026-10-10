import styles from "./styles/SkipLink.module.css";

export function SkipLink() {
  return (
    <a href="#main" className={styles.skipLink}>
      Skip to content
    </a>
  );
}
