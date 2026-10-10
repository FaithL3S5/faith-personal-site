import type { StackTier as StackTierData } from "@/content/home";
import styles from "./styles/StackTier.module.css";

export function StackTier({ tier }: { tier: StackTierData }) {
  return (
    <div className={`${styles.tier} ${styles[tier.variant]}`} data-reveal-item="">
      <h3 className={styles.label}>{tier.label}</h3>
      <ul className={styles.pills}>
        {tier.items.map((item) => (
          <li key={item} className={styles.pill}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
