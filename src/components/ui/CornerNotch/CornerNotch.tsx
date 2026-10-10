import styles from "./styles/CornerNotch.module.css";

type CornerNotchProps = {
  mark: "triangle" | "corner";
  isOutlined: boolean;
  className?: string;
};

export function CornerNotch({ mark, isOutlined, className }: CornerNotchProps) {
  const notchClassName = [styles.notch, isOutlined && styles.outlined, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span aria-hidden="true" className={notchClassName}>
      {mark === "triangle" ? (
        <span className={styles.triangle} />
      ) : (
        <svg viewBox="0 0 16 16" className={styles.corner}>
          <path d="M2 2h12v12z" />
        </svg>
      )}
    </span>
  );
}
