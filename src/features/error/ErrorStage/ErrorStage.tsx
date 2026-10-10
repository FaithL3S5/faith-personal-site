import type { ReactNode } from "react";
import { JellyImage } from "@/components/jelly/JellyImage/JellyImage";
import { Eyebrow } from "@/components/ui/Eyebrow/Eyebrow";
import { KanjiRuby } from "@/components/ui/KanjiRuby/KanjiRuby";
import type { ErrorCopy } from "@/content/errors";
import { StatusStrip } from "../StatusStrip/StatusStrip";
import styles from "./styles/ErrorStage.module.css";

type ErrorStageProps = {
  kind: "notFound" | "serverError";
  copy: ErrorCopy;
  referenceValue: ReactNode;
  actions: ReactNode;
};

export function ErrorStage({ kind, copy, referenceValue, actions }: ErrorStageProps) {
  return (
    <main id="main" tabIndex={-1} className={`${styles.stage} ${styles[kind]}`}>
      <div className={styles.canvas}>
        <span aria-hidden="true" className={styles.verticalRule} />
        <span aria-hidden="true" className={styles.horizontalRule} />
        <span aria-hidden="true" className={styles.numerals}>
          {copy.numerals}
        </span>
        <span className={styles.tag}>{copy.tag}</span>
        <JellyImage
          pose={kind === "notFound" ? "surprised" : "eyes_closed"}
          alt={copy.jellyAlt}
          className={styles.jelly}
        />
      </div>
      <div className={styles.message}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>
            <Eyebrow className={styles.eyebrow}>{copy.title}</Eyebrow>
          </h1>
          <KanjiRuby kanji={copy.kanji} romaji={copy.romaji} className={styles.kanji} />
        </div>
        <p className={styles.headline}>{copy.headline}</p>
        <p className={styles.body}>{copy.message}</p>
        <div className={styles.actions}>{actions}</div>
      </div>
      <div className={styles.strip}>
        <StatusStrip copy={copy} referenceValue={referenceValue} />
      </div>
    </main>
  );
}
