import Image from "next/image";
import styles from "./styles/FooterTrees.module.css";

export function FooterTrees() {
  return (
    <>
      <Image
        src="/decor/tree-1-white.svg"
        alt=""
        aria-hidden="true"
        width={2492}
        height={2473}
        className={`${styles.tree} ${styles.leftTree}`}
      />
      <Image
        src="/decor/tree-2-white.svg"
        alt=""
        aria-hidden="true"
        width={2415}
        height={2456}
        className={`${styles.tree} ${styles.rightTree}`}
      />
    </>
  );
}
