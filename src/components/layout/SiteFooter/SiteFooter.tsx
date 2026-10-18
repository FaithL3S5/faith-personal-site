import { FooterJelly } from "@/components/jelly/FooterJelly/FooterJelly";
import { Arrow } from "@/components/ui/Arrow/Arrow";
import { DotMatrix } from "@/components/ui/DotMatrix/DotMatrix";
import { RevealGroup } from "@/components/ui/RevealGroup/RevealGroup";
import { copyrightLine, jellyBubble, jellyCaption, offDutyTagline } from "@/content/footer";
import { jellyLinkLabel, links } from "@/content/site";
import { Colophon } from "../Colophon/Colophon";
import styles from "./styles/SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div aria-hidden="true" className={styles.stripe} />
      <RevealGroup
        playKey="footer"
        trigger="view"
        staggerMs={80}
        className={styles.columns}
      >
        <div className={styles.identity} data-reveal-item="">
          <div className={styles.nameRow}>
            <div>
              <p className={styles.kicker}>This guy&apos;s name is</p>
              <p className={styles.mascotName}>
                J<span lang="ja">三</span>LLY
              </p>
            </div>
            <DotMatrix
              columns={10}
              rows={6}
              circleLeft={91}
              tone="paper"
              className={styles.mobileDots}
            />
            <DotMatrix
              columns={9}
              rows={6}
              circleLeft={77}
              tone="paper"
              className={styles.tabletDots}
            />
          </div>
          <div className={styles.jellyRow}>
            <a href="/jelly" className={styles.jellyLink} aria-label={jellyLinkLabel}>
              <figure className={styles.jellyFigure}>
                <span aria-hidden="true" className={styles.jellyBubble}>
                  {jellyBubble}
                </span>
                <FooterJelly className={styles.jelly} />
                <figcaption className={styles.jellyCaption}>
                  {jellyCaption}
                </figcaption>
              </figure>
            </a>
          </div>
          <a href="#top" className={styles.backToTop}>
            Back to top
            <Arrow direction="up" />
          </a>
        </div>
        <div className={styles.colophon} data-reveal-item="">
          <Colophon />
        </div>
        <div className={styles.offDuty} data-reveal-item="">
          <h2 className={styles.heading}>Off duty</h2>
          <a
            href={links.gamingChannel}
            target="_blank"
            rel="noopener"
            className={styles.channel}
          >
            Gaming channel, Faith_L3S5
            <Arrow direction="out" />
          </a>
          <DotMatrix
            columns={13}
            rows={6}
            circleLeft={133}
            tone="paper"
            className={styles.desktopDots}
          />
          <p className={styles.tagline}>{offDutyTagline}</p>
          <p className={styles.copyright}>{copyrightLine}</p>
        </div>
      </RevealGroup>
    </footer>
  );
}
