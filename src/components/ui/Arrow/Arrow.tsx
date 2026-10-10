import styles from "./styles/Arrow.module.css";

export type ArrowDirection = "down" | "download" | "out" | "up" | "back" | "retry";

const arrowPaths: Record<ArrowDirection, string> = {
  down: "M8 2v11M3.5 8.5 8 13l4.5-4.5",
  download: "M8 2v10M3.5 8 8 12.5 12.5 8M3 14.5h10",
  out: "M4 12 12 4M5.5 4H12v6.5",
  up: "M8 14V3M3.5 7.5 8 3l4.5 4.5",
  back: "M14 8H3M7.5 3.5 3 8l4.5 4.5",
  retry: "M13.5 8a5.5 5.5 0 1 1-1.8-4.1M13.5 2v3.5H10",
};

type ArrowProps = {
  direction: ArrowDirection;
  size?: "regular" | "small";
};

export function Arrow({ direction, size = "regular" }: ArrowProps) {
  return (
    <span className={styles.arrow} data-arrow={direction} data-size={size} aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d={arrowPaths[direction]} />
      </svg>
    </span>
  );
}
