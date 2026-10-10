"use client";

import { useEffect, useRef } from "react";
import { currentSectionNumber, scrollProgress, shouldFlipLabel } from "@/lib/motion/scrollMarker";
import styles from "./styles/ScrollMarker.module.css";

function readSectionOffsets() {
  return [...document.querySelectorAll<HTMLElement>("[data-section]")].map((section) => ({
    number: section.dataset.section ?? "00",
    top: section.getBoundingClientRect().top + window.scrollY,
  }));
}

export function ScrollMarker() {
  const markerRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const marker = markerRef.current;
    const label = labelRef.current;
    const track = marker?.parentElement;
    if (!marker || !label || !track) return;

    let frameId = 0;
    const update = () => {
      frameId = 0;
      const trackStyle = getComputedStyle(track);
      const trackWidth =
        track.clientWidth - parseFloat(trackStyle.paddingLeft) - parseFloat(trackStyle.paddingRight);
      const progress = scrollProgress(
        window.scrollY,
        document.documentElement.scrollHeight,
        window.innerHeight,
      );
      const markerOffset = progress * trackWidth;
      marker.style.transform = `translateX(${markerOffset}px)`;
      label.textContent = currentSectionNumber(
        readSectionOffsets(),
        window.scrollY + track.getBoundingClientRect().bottom,
      );
      marker.toggleAttribute("data-flipped", shouldFlipLabel(markerOffset, trackWidth, label.offsetWidth + 8));
    };
    const scheduleUpdate = () => {
      if (!frameId) frameId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <span ref={markerRef} className={styles.marker}>
      <span ref={labelRef} className={styles.label}>
        00
      </span>
    </span>
  );
}
