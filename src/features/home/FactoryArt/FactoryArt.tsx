import Image from "next/image";
import styles from "./styles/FactoryArt.module.css";

export function FactoryArt({ className }: { className: string }) {
  return (
    <Image
      src="/factory.svg"
      alt=""
      aria-hidden="true"
      width={1790}
      height={1407}
      className={`${styles.factory} ${className}`}
      data-reveal-item=""
    />
  );
}
