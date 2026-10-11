"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";

export function useInlineSvg(url: string, shouldLoad: boolean): string | null {
  const [markup, setMarkup] = useState<string | null>(null);

  useEffect(() => {
    if (!shouldLoad || markup || prefersReducedMotion()) return;
    let isCancelled = false;

    fetch(url)
      .then((response) => (response.ok ? response.text() : null))
      .then((text) => {
        if (!isCancelled && text) setMarkup(text);
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [url, shouldLoad, markup]);

  return markup;
}
