import { PillLink } from "@/components/ui/Pill/PillLink";
import { experienceEntries } from "@/content/home";
import { links } from "@/content/site";
import { ExperienceRow } from "../ExperienceRow/ExperienceRow";
import { FactoryArt } from "../FactoryArt/FactoryArt";
import { SectionFrame } from "../SectionFrame/SectionFrame";
import styles from "./styles/Experience.module.css";

export function Experience() {
  return (
    <SectionFrame
      sectionId="experience"
      contentClassName={styles.content}
      decoration={<span aria-hidden="true" className={styles.cornerTriangle} />}
    >
      <div>
        <div aria-hidden="true" className={styles.columnHeads}>
          <span>No.</span>
          <span>Company</span>
          <span>Role</span>
          <span className={styles.periodHead}>Period</span>
        </div>
        <ol className={styles.rows}>
          {experienceEntries.map((entry) => (
            <ExperienceRow key={entry.number} entry={entry} />
          ))}
        </ol>
      </div>
      <FactoryArt placement="experience" />
      <div className={styles.actions}>
        <PillLink href={links.resume} variant="primary" arrow="download" isExternal stretchOnMobile>
          Resume, PDF
        </PillLink>
        <PillLink href={links.linkedIn} variant="outline" arrow="out" isExternal stretchOnMobile>
          Full history on LinkedIn
        </PillLink>
      </div>
    </SectionFrame>
  );
}
