"use client";

import { useState } from "react";
import { explainerVideo } from "@/content/site";
import styles from "./styles/VideoFacade.module.css";

export function VideoFacade({ className }: { className?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const frameClassName = className ? `${styles.frame} ${className}` : styles.frame;

  if (isLoaded) {
    return (
      <div className={frameClassName}>
        <iframe
          className={styles.player}
          src={explainerVideo.embedUrl}
          title={explainerVideo.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={`${frameClassName} ${styles.facade}`}>
      <span className={styles.label}>
        <span aria-hidden="true" className={styles.marker} />
        Portfolio explainer
      </span>
      <span className={styles.source}>YouTube</span>
      <button
        type="button"
        className={styles.play}
        aria-label="Play the portfolio explainer video"
        onClick={() => setIsLoaded(true)}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M5 2.5v11l9-5.5z" />
        </svg>
      </button>
      <span aria-hidden="true" className={styles.timeline}>
        <span>00:00</span>
        <span className={styles.track}>
          <span className={styles.progress} />
        </span>
        <span>{explainerVideo.duration}</span>
      </span>
    </div>
  );
}
