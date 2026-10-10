import type { ReactNode } from "react";
import { BrushCircle } from "@/components/ui/BrushCircle/BrushCircle";
import { KanjiRuby } from "@/components/ui/KanjiRuby/KanjiRuby";
import { getSection, type SectionId } from "@/content/sections";
import { SectionProgress } from "../SectionProgress/SectionProgress";
import styles from "./styles/SectionFrame.module.css";

type SectionFrameProps = {
  sectionId: SectionId;
  className?: string;
  contentClassName?: string;
  decoration?: ReactNode;
  children: ReactNode;
};

export function SectionFrame({
  sectionId,
  className,
  contentClassName,
  decoration,
  children,
}: SectionFrameProps) {
  const section = getSection(sectionId);
  const titleId = `${section.id}-title`;

  return (
    <section
      id={section.id}
      aria-labelledby={titleId}
      className={className ? `${styles.frame} ${className}` : styles.frame}
      data-section={section.number}
    >
      {decoration}
      <div className={styles.rail} data-reveal-rail="">
        <BrushCircle className={styles.brush} />
        <span aria-hidden="true" className={styles.number} data-count-up={section.number}>
          {section.number}
        </span>
        <h2 id={titleId} className={styles.title}>
          {section.label}
        </h2>
        <KanjiRuby kanji={section.kanji} romaji={section.romaji} className={styles.kanji} />
        <SectionProgress currentNumber={section.number} className={styles.progress} />
      </div>
      <div className={contentClassName ? `${styles.content} ${contentClassName}` : styles.content}>
        {children}
      </div>
    </section>
  );
}
