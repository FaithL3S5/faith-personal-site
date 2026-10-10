import { JellyFigure } from "@/components/jelly/JellyFigure/JellyFigure";
import { RoundEyes } from "@/components/jelly/JellyFigure/JellyEyes";
import { eyeCenters } from "@/components/jelly/JellyFigure/jellyShapes";
import { DotMatrix } from "@/components/ui/DotMatrix/DotMatrix";
import { Eyebrow } from "@/components/ui/Eyebrow/Eyebrow";
import { PillLink } from "@/components/ui/Pill/PillLink";
import { fullName, heroParagraph } from "@/content/site";
import { HeroLetterPanel } from "../HeroLetterPanel/HeroLetterPanel";
import styles from "./styles/Hero.module.css";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className={styles.hero}>
      <HeroLetterPanel />
      <div className={styles.text}>
        <div aria-hidden="true" className={styles.edition}>
          <span>Portfolio / 2026</span>
          <span className={styles.barcode} />
        </div>
        <Eyebrow className={styles.eyebrow}>Hello, I&apos;m Faith</Eyebrow>
        <h1 id="hero-title" className={styles.title}>
          FULL-STACK DEVELOPER
        </h1>
        <p className={styles.paragraph}>{heroParagraph}</p>
        <p className={styles.byline}>{fullName} / Software Engineer</p>
        <div className={styles.actions}>
          <PillLink href="#work" variant="primary" arrow="down">
            View work
          </PillLink>
          <PillLink href="#contact" variant="outline">
            Get in touch
          </PillLink>
        </div>
        <DotMatrix columns={11} rows={6} circleLeft={105} tone="ink" className={styles.dots} />
        <JellyFigure facing="right" label="Jelly looking down at the page" className={styles.jelly}>
          <RoundEyes centers={eyeCenters.rightLookingDown} />
        </JellyFigure>
      </div>
    </section>
  );
}
