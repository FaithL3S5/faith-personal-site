import Image from "next/image";
import computer from "@/assets/computer.png";
import { about } from "@/content/home";
import { ProfilePlate } from "../ProfilePlate/ProfilePlate";
import { SectionFrame } from "../SectionFrame/SectionFrame";
import styles from "./styles/About.module.css";

export function About() {
  return (
    <SectionFrame sectionId="about" contentClassName={styles.content}>
      <div className={styles.textColumn}>
        <p className={styles.paragraph} data-reveal-item="">
          <span className={styles.paragraphLines}>{about.paragraph}</span>
        </p>
        <Image
          src={computer}
          alt=""
          aria-hidden="true"
          sizes="(min-width: 75rem) 33rem, (min-width: 48rem) 21rem, 19rem"
          className={styles.computer}
          data-reveal-item=""
        />
        <p className={styles.improving} data-reveal-item="">
          <span aria-hidden="true" className={styles.square} />
          {about.improving}
        </p>
      </div>
      <div className={styles.plate} data-reveal-item="">
        <ProfilePlate />
      </div>
    </SectionFrame>
  );
}
