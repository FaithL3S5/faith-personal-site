import { dailyStackTiers, extraStackTiers } from "@/content/home";
import { FactoryArt } from "../FactoryArt/FactoryArt";
import { SectionFrame } from "../SectionFrame/SectionFrame";
import { StackTier } from "../StackTier/StackTier";
import styles from "./styles/Stack.module.css";

export function Stack() {
  return (
    <SectionFrame sectionId="stack" contentClassName={styles.content}>
      <div className={styles.daily}>
        <div className={styles.dailyTiers}>
          {dailyStackTiers.map((tier) => (
            <StackTier key={tier.label} tier={tier} />
          ))}
        </div>
        <div aria-hidden="true" className={styles.factoryCell}>
          <FactoryArt placement="stack" />
        </div>
      </div>
      <div className={styles.extraTiers}>
        {extraStackTiers.map((tier) => (
          <StackTier key={tier.label} tier={tier} />
        ))}
      </div>
    </SectionFrame>
  );
}
