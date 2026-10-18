"use client";

import { useEffect } from "react";

export function useLockedPageScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previousOverflow;
    };
  }, []);
}
