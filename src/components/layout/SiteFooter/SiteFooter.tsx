import { JellyFigure } from "@/components/jelly/JellyFigure/JellyFigure";
import { RoundEyes } from "@/components/jelly/JellyFigure/JellyEyes";
import { eyeCenters } from "@/components/jelly/JellyFigure/jellyShapes";
import { Arrow } from "@/components/ui/Arrow/Arrow";
import { DotMatrix } from "@/components/ui/DotMatrix/DotMatrix";
import { copyrightLine, offDutyTagline } from "@/content/footer";
import { links } from "@/content/site";
import { Colophon } from "../Colophon/Colophon";
import styles from "./styles/SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div aria-hidden="true" className={styles.stripe} />
      <div className={styles.columns}>
        <div className={styles.identity}>
          <div>
            <p className={styles.kicker}>This guy&apos;s name is</p>
            <p className={styles.mascotName}>
              J<span lang="ja">三</span>LLY
            </p>
          </div>
          <div className={styles.jellyRow}>
            <JellyFigure facing="left" isOutlined label="Jelly looking up" className={styles.jelly}>
              <RoundEyes centers={eyeCenters.leftLookingUp} />
            </JellyFigure>
            <DotMatrix columns={10} rows={6} circleLeft={91} tone="paper" className={styles.mobileDots} />
            <DotMatrix columns={9} rows={6} circleLeft={77} tone="paper" className={styles.tabletDots} />
          </div>
          <a href="#top" className={styles.backToTop}>
            Back to top
            <Arrow direction="up" />
          </a>
        </div>
        <Colophon className={styles.colophon} />
        <div className={styles.offDuty}>
          <h2 className={styles.heading}>Off duty</h2>
          <a href={links.gamingChannel} target="_blank" rel="noopener" className={styles.channel}>
            Gaming channel, Faith_L3S5
            <Arrow direction="out" />
          </a>
          <DotMatrix columns={13} rows={6} circleLeft={133} tone="paper" className={styles.desktopDots} />
          <p className={styles.tagline}>{offDutyTagline}</p>
          <p className={styles.copyright}>{copyrightLine}</p>
        </div>
      </div>
    </footer>
  );
}
