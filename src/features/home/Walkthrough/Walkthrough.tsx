import { Eyebrow } from "@/components/ui/Eyebrow/Eyebrow";
import { FactList } from "@/components/ui/FactList/FactList";
import { PillLink } from "@/components/ui/Pill/PillLink";
import { walkthrough } from "@/content/home";
import { links } from "@/content/site";
import { VideoFacade } from "../VideoFacade/VideoFacade";
import styles from "./styles/Walkthrough.module.css";

export function Walkthrough() {
  return (
    <div className={styles.walkthrough} data-reveal-item="">
      <VideoFacade className={styles.video} />
      <div className={styles.aside}>
        <div className={styles.intro}>
          <Eyebrow className={styles.eyebrow}>{walkthrough.eyebrow}</Eyebrow>
          <h3 className={styles.title}>{walkthrough.title}</h3>
          <p className={styles.summary}>{walkthrough.summary}</p>
        </div>
        <div className={styles.details}>
          <FactList facts={walkthrough.facts} variant="paper" />
          <PillLink href={links.deck} variant="outline" arrow="out" isExternal stretchOnMobile>
            Open the deck
          </PillLink>
        </div>
      </div>
    </div>
  );
}
