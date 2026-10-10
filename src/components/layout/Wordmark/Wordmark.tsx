import Image from "next/image";
import logo from "@/assets/logo.png";
import styles from "./styles/Wordmark.module.css";

export function Wordmark({ href }: { href: string }) {
  return (
    <a href={href} className={styles.wordmark}>
      <Image src={logo} alt="Faith logo" sizes="3rem" className={styles.logo} />
      <span className={styles.lockup}>
        <span className={styles.name}>FAITH</span>
        <span lang="ja" className={styles.katakana}>
          フェーツ
        </span>
      </span>
    </a>
  );
}
