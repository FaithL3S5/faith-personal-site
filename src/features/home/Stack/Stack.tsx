import { dailyStackTiers, extraStackTiers } from "@/content/home";
import { FactoryArt } from "../FactoryArt/FactoryArt";
import { SectionFrame } from "../SectionFrame/SectionFrame";
import { StackTier } from "../StackTier/StackTier";
import styles from "./styles/Stack.module.css";

export function Stack() {
  return (
    <SectionFrame sectionId="stack" contentClassName={styles.content}>
      <div className={styles.dailyTiers}>
        {dailyStackTiers.map((tier) => (
          <StackTier key={tier.label} tier={tier} />
        ))}
      </div>
      <FactoryArt className={styles.factory} />
      <div className={styles.extraTiers}>
        {extraStackTiers.map((tier) => (
          <StackTier key={tier.label} tier={tier} />
        ))}
      </div>
    </SectionFrame>
  );
}
