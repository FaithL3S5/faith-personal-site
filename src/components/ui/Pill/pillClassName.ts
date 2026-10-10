import styles from "./styles/Pill.module.css";

export type PillVariant = "primary" | "outline" | "resume";

export type PillStyleProps = {
  variant: PillVariant;
  size?: "regular" | "compact";
  stretchOnMobile?: boolean;
  className?: string;
};

export function pillClassName({ variant, size = "regular", stretchOnMobile, className }: PillStyleProps) {
  return [
    styles.pill,
    styles[variant],
    size === "compact" && styles.compact,
    stretchOnMobile && styles.stretchOnMobile,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
