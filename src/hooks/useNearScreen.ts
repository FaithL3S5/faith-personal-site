"use client";

import { useEffect, useState, type RefObject } from "react";

export function useNearScreen(targetRef: RefObject<Element | null>, rootMargin: string): boolean {
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || isNear) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        setIsNear(true);
      },
      { rootMargin },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef, rootMargin, isNear]);

  return isNear;
}
