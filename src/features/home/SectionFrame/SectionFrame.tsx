"use client";

import { useRef, type ReactNode } from "react";
import { BrushCircle } from "@/components/ui/BrushCircle/BrushCircle";
import { KanjiRuby } from "@/components/ui/KanjiRuby/KanjiRuby";
import { getSection, type SectionId } from "@/content/sections";
import { SectionProgress } from "../SectionProgress/SectionProgress";
import styles from "./styles/SectionFrame.module.css";
import { useSectionReveal, type SectionRevealSelectors } from "./useSectionReveal";

const revealSelectors: SectionRevealSelectors = {
  horizontalLines: "[data-hairline='horizontal']",
  verticalLines: "[data-hairline='vertical']",
  railItems: [styles.number, styles.title, styles.kanji, styles.brush, styles.progress].map(
    (className) => `.${className}`,
  ),
  countUpNumber: "[data-count-up]",
  progressSegments: "[data-progress-segment]",
};

type SectionFrameProps = {
  sectionId: SectionId;
  contentClassName?: string;
  hasBottomRule?: boolean;
  decoration?: ReactNode;
  children: ReactNode;
};

export function SectionFrame({
  sectionId,
  contentClassName,
  hasBottomRule = true,
  decoration,
  children,
}: SectionFrameProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const section = getSection(sectionId);
  const titleId = `${section.id}-title`;
  useSectionReveal(sectionRef, section.number, revealSelectors);

  return (
    <section
      ref={sectionRef}
      id={section.id}
      aria-labelledby={titleId}
      className={styles.frame}
      data-section={section.number}
    >
      {decoration}
      <div className={styles.rail}>
        <BrushCircle className={styles.brush} />
        <span aria-hidden="true" className={styles.number} data-count-up="">
          {section.number}
        </span>
        <h2 id={titleId} className={styles.title}>
          {section.label}
        </h2>
        <KanjiRuby kanji={section.kanji} romaji={section.romaji} className={styles.kanji} />
        <SectionProgress currentNumber={section.number} className={styles.progress} />
        <span aria-hidden="true" className={styles.railBandLine} data-hairline="horizontal" />
        <span aria-hidden="true" className={styles.railDivider} data-hairline="vertical" />
      </div>
      <div className={contentClassName ? `${styles.content} ${contentClassName}` : styles.content}>
        {children}
      </div>
      {hasBottomRule && (
        <span aria-hidden="true" className={styles.bottomRule} data-hairline="horizontal" />
      )}
    </section>
  );
}
