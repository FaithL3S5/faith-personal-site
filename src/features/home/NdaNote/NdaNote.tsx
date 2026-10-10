import { JellyImage } from "@/components/jelly/JellyImage/JellyImage";
import { ndaNote } from "@/content/home";
import styles from "./styles/NdaNote.module.css";

export function NdaNote() {
  return (
    <div className={styles.note} data-reveal-item="">
      <span aria-hidden="true" className={styles.stripe} />
      <div className={styles.text}>
        <p className={styles.kicker}>Under NDA</p>
        <p className={styles.body}>{ndaNote}</p>
      </div>
      <JellyImage pose="mir-eyebrow_raised" alt="Jelly raising an eyebrow" className={styles.jelly} />
    </div>
  );
}
