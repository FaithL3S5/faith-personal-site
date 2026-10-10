import type { ReactNode } from "react";
import { DotMatrix } from "@/components/ui/DotMatrix/DotMatrix";
import type { ErrorCopy } from "@/content/errors";
import { links } from "@/content/site";
import styles from "./styles/StatusStrip.module.css";

const stillOnlineLinks = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/#work" },
  { label: "Resume", href: links.resume, isExternal: true },
  { label: "Contact", href: "/#contact" },
];

type StatusStripProps = {
  copy: ErrorCopy;
  referenceValue: ReactNode;
};

export function StatusStrip({ copy, referenceValue }: StatusStripProps) {
  return (
    <div className={styles.strip}>
      <div className={styles.cell}>
        <p className={styles.label}>B1 / {copy.referenceLabel}</p>
        <p className={styles.reference}>{referenceValue}</p>
        <p className={styles.note}>{copy.referenceNote}</p>
      </div>
      <div className={styles.cell}>
        <p className={styles.label}>B2 / Status</p>
        <div className={styles.statusRow}>
          <p className={styles.statusCode} data-status-code={copy.statusCode}>
            {copy.statusCode}
          </p>
          <DotMatrix columns={9} rows={4} circleLeft={77} tone="ink" className={styles.mobileDots} />
        </div>
        <p className={styles.caption}>{copy.statusCaption}</p>
      </div>
      <div className={styles.cell}>
        <p className={styles.label}>B3 / Still online</p>
        <nav aria-label="Still online" className={styles.onlineLinks}>
          {stillOnlineLinks.map((link, index) => (
            <span key={link.label} className={styles.onlineItem}>
              {index > 0 && (
                <span aria-hidden="true" className={styles.divider}>
                  |
                </span>
              )}
              <a href={link.href} {...(link.isExternal && { target: "_blank", rel: "noopener" })}>
                {link.label}
              </a>
            </span>
          ))}
        </nav>
        <DotMatrix columns={11} rows={3} circleLeft={105} tone="ink" className={styles.stripDots} />
      </div>
    </div>
  );
}
