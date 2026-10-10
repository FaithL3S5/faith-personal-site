import type { ReactNode } from "react";
import styles from "./styles/FactList.module.css";

export type Fact = {
  label: string;
  value: ReactNode;
  stacksOnMobile?: boolean;
};

type FactListProps = {
  facts: readonly Fact[];
  variant: "paper" | "dark" | "plate" | "colophon";
  hasClosingRule?: boolean;
};

export function FactList({ facts, variant, hasClosingRule = true }: FactListProps) {
  const listClassName = [styles.list, styles[variant], hasClosingRule && styles.closed]
    .filter(Boolean)
    .join(" ");

  return (
    <dl className={listClassName}>
      {facts.map((fact) => (
        <div key={fact.label} className={fact.stacksOnMobile ? `${styles.row} ${styles.stacks}` : styles.row}>
          <dt className={styles.label}>{fact.label}</dt>
          <dd className={styles.value}>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
