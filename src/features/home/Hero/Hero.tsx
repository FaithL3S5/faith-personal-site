import { HeroJelly } from "@/components/jelly/HeroJelly/HeroJelly";
import { DotMatrix } from "@/components/ui/DotMatrix/DotMatrix";
import { Eyebrow } from "@/components/ui/Eyebrow/Eyebrow";
import { PillLink } from "@/components/ui/Pill/PillLink";
import { RevealGroup } from "@/components/ui/RevealGroup/RevealGroup";
import { fullName, heroParagraph } from "@/content/site";
import { HeroLetterPanel } from "../HeroLetterPanel/HeroLetterPanel";
import styles from "./styles/Hero.module.css";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className={styles.hero}>
      <HeroLetterPanel />
      <RevealGroup playKey="hero-text" trigger="load" staggerMs={80} className={styles.text}>
        <div aria-hidden="true" className={styles.edition}>
          <span>Portfolio / 2026</span>
          <span className={styles.barcode} />
        </div>
        <div data-reveal-item="">
          <Eyebrow className={styles.eyebrow}>Hello, I&apos;m Faith</Eyebrow>
        </div>
        <h1 id="hero-title" className={styles.title} data-reveal-item="">
          FULL-STACK DEVELOPER
        </h1>
        <p className={styles.paragraph} data-reveal-item="">
          {heroParagraph}
        </p>
        <p className={styles.byline} data-reveal-item="">
          {fullName} / Software Engineer
        </p>
        <div className={styles.actions} data-reveal-item="">
          <PillLink href="#work" variant="primary" arrow="down">
            View work
          </PillLink>
          <PillLink href="#contact" variant="outline">
            Get in touch
          </PillLink>
        </div>
        <DotMatrix columns={11} rows={6} circleLeft={105} tone="ink" className={styles.dots} />
        <HeroJelly className={styles.jelly} />
      </RevealGroup>
    </section>
  );
}
