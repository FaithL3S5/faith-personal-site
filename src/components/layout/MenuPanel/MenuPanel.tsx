import { PillLink } from "@/components/ui/Pill/PillLink";
import { links } from "@/content/site";
import type { PageVariant } from "@/lib/sectionHref";
import { SectionNavLinks } from "../SectionNavLinks/SectionNavLinks";
import styles from "./styles/MenuPanel.module.css";

type MenuPanelProps = {
  id: string;
  variant: PageVariant;
  isOpen: boolean;
  onNavigate: () => void;
};

export function MenuPanel({ id, variant, isOpen, onNavigate }: MenuPanelProps) {
  return (
    <nav id={id} aria-label="Sections" className={styles.panel} hidden={!isOpen}>
      <SectionNavLinks
        variant={variant}
        linkClassName={styles.link}
        numberClassName={styles.number}
        labelClassName={styles.label}
        onNavigate={onNavigate}
      />
      <div className={styles.resume}>
        <PillLink
          href={links.resume}
          variant="resume"
          arrow="download"
          isExternal
          stretchOnMobile
          className={styles.resumePill}
        >
          Resume
        </PillLink>
      </div>
    </nav>
  );
}
