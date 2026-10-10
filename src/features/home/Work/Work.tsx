import { caseStudies } from "@/content/home";
import { CaseCard } from "../CaseCard/CaseCard";
import { NdaNote } from "../NdaNote/NdaNote";
import { SectionFrame } from "../SectionFrame/SectionFrame";
import { Walkthrough } from "../Walkthrough/Walkthrough";
import styles from "./styles/Work.module.css";

export function Work() {
  return (
    <SectionFrame sectionId="work" contentClassName={styles.content}>
      <NdaNote />
      <div className={styles.cases}>
        {caseStudies.map((caseStudy) => (
          <CaseCard key={caseStudy.code} caseStudy={caseStudy} />
        ))}
      </div>
      <Walkthrough />
    </SectionFrame>
  );
}
