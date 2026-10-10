import styles from "./styles/MenuButton.module.css";

type MenuButtonProps = {
  isOpen: boolean;
  controlsId: string;
  onToggle: () => void;
};

export function MenuButton({ isOpen, controlsId, onToggle }: MenuButtonProps) {
  return (
    <button
      type="button"
      className={styles.menuButton}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls={controlsId}
      onClick={onToggle}
    >
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d={isOpen ? "M4.5 4.5l11 11M15.5 4.5l-11 11" : "M3 6h14M3 10h14M3 14h14"} />
      </svg>
    </button>
  );
}
