import { CornerNotch } from "@/components/ui/CornerNotch/CornerNotch";
import { FactList } from "@/components/ui/FactList/FactList";
import type { CaseStudy } from "@/content/home";
import { CaseIllustration } from "../CaseIllustration/CaseIllustration";
import styles from "./styles/CaseCard.module.css";

export function CaseCard({ caseStudy }: { caseStudy: CaseStudy }) {
  const isDark = caseStudy.tone === "dark";

  return (
    <article className={`${styles.card} ${styles[caseStudy.tone]}`} data-reveal-item="">
      <div className={styles.head}>
        <p className={styles.code}>{caseStudy.code}</p>
        <CornerNotch mark="corner" isOutlined={!isDark} className={styles.notch} />
      </div>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{caseStudy.title}</h3>
          <CaseIllustration variant={caseStudy.illustration} />
        </div>
        <p className={styles.summary}>{caseStudy.summary}</p>
        <FactList facts={caseStudy.facts} variant={isDark ? "dark" : "paper"} />
      </div>
    </article>
  );
}
