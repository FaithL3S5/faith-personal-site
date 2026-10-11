"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import { useNearScreen } from "@/hooks/useNearScreen";
import { useWhileOnScreen } from "@/hooks/useWhileOnScreen";
import { FactorySmoke } from "../FactorySmoke/FactorySmoke";
import { prepareFactoryMarkup } from "./prepareFactoryMarkup";
import styles from "./styles/FactoryArt.module.css";
import { useInlineSvg } from "./useInlineSvg";

const factoryUrl = "/factory.svg";
const loadAheadMargin = "100% 0px";

export function FactoryArt({ className }: { className: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isNearScreen = useNearScreen(frameRef, loadAheadMargin);
  const fetchedMarkup = useInlineSvg(factoryUrl, isNearScreen);
  const markup = useMemo(
    () =>
      fetchedMarkup &&
      prepareFactoryMarkup(fetchedMarkup, {
        headlights: styles.headlights,
        beam: styles.beam,
        glow: styles.glow,
        core: styles.core,
      }),
    [fetchedMarkup],
  );

  const startPlaying = useCallback(() => {
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
