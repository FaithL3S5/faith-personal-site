"use client";

import { JellyFigure } from "@/components/jelly/JellyFigure/JellyFigure";
import { RoundEyes } from "@/components/jelly/JellyFigure/JellyEyes";
import { eyeCenters } from "@/components/jelly/JellyFigure/jellyShapes";
import { PillLink } from "@/components/ui/Pill/PillLink";
import { links } from "@/content/site";
import { useMenu } from "@/hooks/useMenu";
import type { PageVariant } from "@/lib/sectionHref";
import { MenuButton } from "../MenuButton/MenuButton";
import { MenuPanel } from "../MenuPanel/MenuPanel";
import { SectionNavLinks } from "../SectionNavLinks/SectionNavLinks";
import { Wordmark } from "../Wordmark/Wordmark";
import styles from "./styles/SiteHeader.module.css";

const menuPanelId = "site-menu";

export function SiteHeader({ variant }: { variant: PageVariant }) {
  const menu = useMenu();

  return (
    <header id="top" className={styles.header}>
      <div className={styles.bar}>
        <Wordmark href={variant === "home" ? "#top" : "/"} />
        <nav aria-label="Sections" className={styles.nav}>
          <SectionNavLinks
            variant={variant}
            linkClassName={styles.navLink}
            numberClassName={styles.navNumber}
            labelClassName={styles.navLabel}
          />
        </nav>
        <PillLink
          href={links.resume}
          variant="resume"
          size="compact"
          arrow="download"
          isExternal
          className={styles.resume}
        >
          Resume
        </PillLink>
        {variant === "home" && (
          <JellyFigure
            facing="right"
            isOutlined
            label="Jelly, the mascot, looking around"
            className={styles.jelly}
          >
            <RoundEyes centers={eyeCenters.rightNeutral} />
          </JellyFigure>
        )}
        <MenuButton isOpen={menu.isOpen} controlsId={menuPanelId} onToggle={menu.toggle} />
      </div>
      <MenuPanel id={menuPanelId} variant={variant} isOpen={menu.isOpen} onNavigate={menu.close} />
    </header>
  );
}
