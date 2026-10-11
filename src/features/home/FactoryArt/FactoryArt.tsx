"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useWhileOnScreen } from "@/hooks/useWhileOnScreen";
import { FactorySmoke } from "../FactorySmoke/FactorySmoke";
import styles from "./styles/FactoryArt.module.css";
import { useInlineSvg } from "./useInlineSvg";

const factoryUrl = "/factory.svg";

export function FactoryArt({ className }: { className: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);
  const markup = useInlineSvg(factoryUrl, hasBeenSeen);

  const startPlaying = useCallback(() => {
    setHasBeenSeen(true);
    setIsPlaying(true);
    return () => setIsPlaying(false);
  }, []);
  useWhileOnScreen(frameRef, startPlaying);

  return (
    <div
      ref={frameRef}
      aria-hidden="true"
      className={`${styles.frame} ${className}`}
      data-reveal-item=""
      data-playing={isPlaying ? "" : undefined}
    >
      {markup ? (
        <>
          <div className={styles.art} dangerouslySetInnerHTML={{ __html: markup }} />
          <FactorySmoke />
        </>
      ) : (
        <Image src={factoryUrl} alt="" width={1790} height={1407} className={styles.art} />
      )}
    </div>
  );
}
