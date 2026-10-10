import Image from "next/image";
import styles from "./styles/FactoryArt.module.css";

type FactoryArtProps = {
  placement: "experience" | "stack";
};

export function FactoryArt({ placement }: FactoryArtProps) {
  return (
    <Image
      src="/factory.svg"
      alt=""
      aria-hidden="true"
      width={1790}
      height={1407}
      className={`${styles.factory} ${styles[placement]}`}
      data-reveal-item=""
    />
  );
}
